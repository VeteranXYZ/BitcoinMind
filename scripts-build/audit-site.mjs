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

for (const [route, html] of pages) {
  const h1s = html.match(/<h1(?:\s|>)/g) ?? [];
  if (h1s.length !== 1) fail(`${route}: expected one h1, found ${h1s.length}`);
  if (!/<title>[^<]+<\/title>/.test(html)) fail(`${route}: missing title`);
  if (!/<meta\s+name="description"\s+content="[^"]+"/.test(html)) fail(`${route}: missing meta description`);
  if (!/<link\s+rel="canonical"\s+href="[^"]+"/.test(html)) fail(`${route}: missing canonical URL`);
  if (!/<meta\s+property="og:url"\s+content="[^"]+"/.test(html)) fail(`${route}: missing og:url`);

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  if (duplicateIds.length) fail(`${route}: duplicate ids ${duplicateIds.join(", ")}`);
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
  ["/paths", /data-study-ledger/, "local study ledger"],
  ["/paths", /data-study-progress/, "path progress controls"],
  ["/library", /data-filter-scope/, "library filters"],
  ["/library", /data-study-save/, "library save controls"],
  ["/texts", /data-filter-scope/, "text filters"],
  ["/texts", /data-study-save/, "text save controls"],
  ["/toolkit", /data-filter-scope/, "toolkit filters"],
  ["/toolkit", /data-study-save/, "toolkit save controls"],
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
