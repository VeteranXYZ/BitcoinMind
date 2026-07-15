import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";

const ROOT = new URL("../", import.meta.url).pathname;
const DIST = join(ROOT, "dist");
const EXPECTED_PUBLIC_ROUTES = 16;
const failures = [];
const warnings = [];

const fail = (message) => failures.push(message);
const warn = (message) => warnings.push(message);
const read = (path) => readFile(path, "utf8");
const routeFile = (route) => route === "/" ? join(DIST, "index.html") : join(DIST, `${route.slice(1)}.html`);
const routeFromUrl = (value) => {
  const url = new URL(value, "https://bitcoinmind.org");
  return `${url.pathname.replace(/\/$/, "") || "/"}${url.hash}`;
};

const sitemap = await read(join(DIST, "sitemap.xml"));
const sitemapRoutes = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => routeFromUrl(match[1]));

if (sitemapRoutes.length !== EXPECTED_PUBLIC_ROUTES) {
  fail(`sitemap: expected ${EXPECTED_PUBLIC_ROUTES} public routes, found ${sitemapRoutes.length}`);
}
if (sitemapRoutes.includes("/404")) fail("sitemap: /404 must not be indexed");

const pages = new Map();
for (const route of [...sitemapRoutes, "/404"]) {
  try {
    pages.set(route, await read(routeFile(route)));
  } catch {
    fail(`${route}: built HTML is missing`);
  }
}

const pageTitles = new Map();
const pageDescriptions = new Map();
const pageCanonicals = new Map();

for (const [route, html] of pages) {
  const h1s = html.match(/<h1(?:\s|>)/g) ?? [];
  if (h1s.length !== 1) fail(`${route}: expected one h1, found ${h1s.length}`);
  if (!/<title>[^<]+<\/title>/.test(html)) fail(`${route}: missing title`);
  if (!/<meta\s+name="description"\s+content="[^"]+"/.test(html)) fail(`${route}: missing meta description`);
  if (!/<link\s+rel="canonical"\s+href="[^"]+"/.test(html)) fail(`${route}: missing canonical URL`);
  if (!/<meta\s+property="og:url"\s+content="[^"]+"/.test(html)) fail(`${route}: missing og:url`);
  if (!/<meta\s+name="robots"\s+content="[^"]+"/.test(html)) fail(`${route}: missing robots directive`);
  if (!/<meta\s+property="og:image"\s+content="https:\/\/[^"]+"/.test(html)) fail(`${route}: missing absolute og:image`);
  if (!/<meta\s+name="twitter:card"\s+content="summary_large_image"/.test(html)) fail(`${route}: missing large-image Twitter card`);
  if (!/<script[^>]+type="application\/ld\+json"/.test(html)) fail(`${route}: missing structured data`);

  const canonicalUrl = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/)?.[1];
  const openGraphUrl = html.match(/<meta\s+property="og:url"\s+content="([^"]+)"/)?.[1];
  if (canonicalUrl && openGraphUrl && canonicalUrl !== openGraphUrl) fail(`${route}: canonical and og:url differ`);
  if (route !== '/404' && canonicalUrl) {
    const expectedCanonical = route === '/' ? 'https://bitcoinmind.com' : `https://bitcoinmind.com${route}`;
    if (canonicalUrl !== expectedCanonical) fail(`${route}: canonical is ${canonicalUrl}, expected ${expectedCanonical}`);
    const prior = pageCanonicals.get(canonicalUrl);
    if (prior) fail(`${route}: duplicate canonical also used by ${prior}`);
    pageCanonicals.set(canonicalUrl, route);
  }

  for (const block of html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(block[1]);
    } catch {
      fail(`${route}: invalid JSON-LD`);
    }
  }

  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/)?.[1];
  if (title) {
    const prior = pageTitles.get(title);
    if (prior) fail(`${route}: duplicate title also used by ${prior}`);
    pageTitles.set(title, route);
  }
  if (description) {
    const prior = pageDescriptions.get(description);
    if (prior) fail(`${route}: duplicate description also used by ${prior}`);
    pageDescriptions.set(description, route);
  }

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  if (duplicateIds.length) fail(`${route}: duplicate ids ${duplicateIds.join(", ")}`);
}

const builtGa4Ids = new Set();
for (const [route, html] of pages) {
  const ga4Id = html.match(/(?:const|var) measurementId\s*=\s*["'](G-[A-Z0-9]+)["']/i)?.[1]?.toUpperCase();
  if (!ga4Id) fail(`${route}: GA4 Measurement ID is missing`);
  else builtGa4Ids.add(ga4Id);
  if (!html.includes("analytics_storage: 'granted'")) fail(`${route}: forced GA4 analytics storage is missing`);
  if (!html.includes("ad_storage: 'denied'")) fail(`${route}: denied GA4 advertising storage is missing`);
  if (html.includes('bitcoinmind_analytics_consent') || html.includes('data-analytics-consent')) {
    fail(`${route}: obsolete GA4 consent UI is still present`);
  }
}
if (builtGa4Ids.size > 1) fail(`analytics: multiple GA4 Measurement IDs found: ${[...builtGa4Ids].join(', ')}`);

const sitemapLastmods = [...sitemap.matchAll(/<lastmod>(.*?)<\/lastmod>/g)].map((match) => match[1]);
if (sitemapLastmods.length !== sitemapRoutes.length) fail('sitemap: every URL must have a lastmod value');
for (const value of sitemapLastmods) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value))) {
    fail(`sitemap: invalid lastmod ${value}`);
  }
}

for (const [route, html] of pages) {
  for (const match of html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
    const href = match[1];
    if (/^(mailto:|https:\/\/|#)/.test(href)) continue;
    if (href.startsWith("http://")) {
      fail(`${route}: insecure external link ${href}`);
      continue;
    }
    if (!href.startsWith("/")) continue;

    const target = routeFromUrl(href);
    const [pathname, fragment] = target.split("#");
    const targetHtml = pages.get(pathname);
    if (!targetHtml) {
      fail(`${route}: broken internal route ${href}`);
      continue;
    }
    if (fragment && !new RegExp(`\\sid=["']${fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`).test(targetHtml)) {
      fail(`${route}: missing fragment target ${href}`);
    }
  }
}

const contracts = [
  ["/library", /data-filter-scope/, "library filters"],
  ["/texts", /data-filter-scope/, "text filters"],
  ["/toolkit", /data-filter-scope/, "toolkit filters"],
  ["/frames/2", /aria-labelledby="f2-chart-title f2-chart-desc"/, "accessible chart fallback"],
  ["/", /aria-modal="true"/, "welcome dialog semantics"],
];
for (const [route, pattern, label] of contracts) {
  if (!pattern.test(pages.get(route) ?? "")) fail(`${route}: missing ${label}`);
}

if (!/name="robots"\s+content="noindex, (?:no)?follow"/.test(pages.get("/404") ?? "")) {
  fail("/404: missing noindex directive");
}

for (const filename of await readdir(join(ROOT, "src/data"))) {
  if (!filename.endsWith(".ts")) continue;
  const source = await read(join(ROOT, "src/data", filename));
  const ids = [...source.matchAll(/\bid:\s*["']([^"']+)["']/g)].map((match) => match[1]);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  if (duplicateIds.length) fail(`src/data/${filename}: duplicate ids ${duplicateIds.join(", ")}`);
}

const pulse = JSON.parse(await read(join(ROOT, "public/pulse.json")));
const pulseAgeDays = (Date.now() - Date.parse(pulse.fetchedAt)) / 86_400_000;
if (!Number.isFinite(pulseAgeDays)) fail("public/pulse.json: invalid fetchedAt");
else if (pulseAgeDays > 14) warn(`public/pulse.json: snapshot is ${Math.floor(pulseAgeDays)} days old`);
if (pulse.source !== "snapshot") warn(`public/pulse.json: source is ${pulse.source}; one or more feeds used a fallback`);

const assetDir = join(DIST, "_astro");
const assets = await readdir(assetDir);
const sizes = await Promise.all(assets.map(async (name) => ({ name, bytes: (await stat(join(assetDir, name))).size })));
const css = sizes.filter(({ name }) => name.endsWith(".css"));
const js = sizes.filter(({ name }) => name.endsWith(".js"));
const fonts = sizes.filter(({ name }) => /\.(woff2?|ttf)$/.test(name));
const largestCss = Math.max(0, ...css.map(({ bytes }) => bytes));
const largestJs = Math.max(0, ...js.map(({ bytes }) => bytes));
const totalJs = js.reduce((sum, { bytes }) => sum + bytes, 0);
const totalFonts = fonts.reduce((sum, { bytes }) => sum + bytes, 0);

if (largestCss > 65_536) fail(`performance: largest CSS asset is ${largestCss} bytes (budget 65,536)`);
if (largestJs > 32_768) fail(`performance: largest JS asset is ${largestJs} bytes (budget 32,768)`);
if (totalJs > 98_304) fail(`performance: total JS is ${totalJs} bytes (budget 98,304)`);
if (totalFonts > 550_000) fail(`performance: total fonts are ${totalFonts} bytes (budget 550,000)`);

for (const message of warnings) console.warn(`WARN  ${message}`);
if (failures.length) {
  for (const message of failures) console.error(`FAIL  ${message}`);
  console.error(`\nAudit failed with ${failures.length} error(s).`);
  process.exit(1);
}

console.log(`Audit passed: ${sitemapRoutes.length} routes, ${sizes.length} assets, ${warnings.length} warning(s).`);
