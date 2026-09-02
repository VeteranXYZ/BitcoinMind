import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { collectScriptHashes } from "./csp-hashes.mjs";

// fileURLToPath, not .pathname: the latter stays percent-encoded, so any
// checkout under a directory with a space in its name resolved to a path
// that does not exist.
const ROOT = fileURLToPath(new URL("../", import.meta.url));
const DIST = join(ROOT, "dist");
const assetDirectory = join(DIST, "_astro");
const siteConfig = JSON.parse(await readFile(join(ROOT, "src/data/site.json"), "utf8"));
const failures = [];
const warnings = [];

const fail = (message) => failures.push(message);
const warn = (message) => warnings.push(message);
const read = (path) => readFile(path, "utf8");
const normalizeText = (value = '') => value
  .replace(/<br\s*\/?>/gi, ' ')
  .replace(/<[^>]+>/g, '')
  .replace(/&amp;/g, '&')
  .replace(/&#x27;|&#39;/g, '’')
  .replace(/&quot;/g, '"')
  .replace(/\s+/g, ' ')
  .trim();
const validDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value));
const pngDimensions = (buffer) => {
  const signature = buffer.subarray(0, 8).toString('hex');
  if (signature !== '89504e470d0a1a0a' || buffer.subarray(12, 16).toString('ascii') !== 'IHDR') return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
};
const routeFile = (route) => route === "/" ? join(DIST, "index.html") : join(DIST, `${route.slice(1)}.html`);
const routeFromUrl = (value) => {
  const url = new URL(value, siteConfig.url);
  return `${url.pathname.replace(/\/$/, "") || "/"}${url.hash}`;
};

async function builtHtmlRoutes(directory, prefix = '') {
  const routes = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('_')) continue;
    const relative = `${prefix}${entry.name}`;
    if (entry.isDirectory()) {
      routes.push(...await builtHtmlRoutes(join(directory, entry.name), `${relative}/`));
    } else if (entry.name.endsWith('.html')) {
      const stem = relative.slice(0, -'.html'.length);
      routes.push(stem === 'index' ? '/' : `/${stem}`);
    }
  }
  return routes;
}

const sitemap = await read(join(DIST, "sitemap.xml"));
const sitemapRoutes = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => routeFromUrl(match[1]));
const routeRegistry = JSON.parse(await read(join(ROOT, "src/data/routes.json")));
const routeByPath = new Map(routeRegistry.map((route) => [route.path, route]));
const expectedPublicRoutes = routeRegistry.map((route) => route.path);
const generatedPublicRoutes = (await builtHtmlRoutes(DIST)).filter((route) => route !== '/404');

for (const route of routeRegistry) {
  if (!route.heading?.trim()) fail(`routes: ${route.path} is missing its reviewed h1 heading`);
  if (!validDate(route.lastModified)) fail(`routes: ${route.path} has invalid lastModified ${route.lastModified}`);
  if (route.parentPath && !routeByPath.has(route.parentPath)) {
    fail(`routes: ${route.path} has unknown parent ${route.parentPath}`);
  }
}

if (sitemapRoutes.length !== expectedPublicRoutes.length) {
  fail(`sitemap: expected ${expectedPublicRoutes.length} registered public routes, found ${sitemapRoutes.length}`);
}
for (const route of expectedPublicRoutes) {
  if (!sitemapRoutes.includes(route)) fail(`sitemap: registered route ${route} is missing`);
}
for (const route of sitemapRoutes) {
  if (!expectedPublicRoutes.includes(route)) fail(`sitemap: unregistered route ${route} is present`);
}
for (const route of generatedPublicRoutes) {
  if (!expectedPublicRoutes.includes(route)) fail(`routes: generated page ${route} is not registered`);
}
for (const route of expectedPublicRoutes) {
  if (!generatedPublicRoutes.includes(route)) fail(`routes: registered page ${route} was not generated`);
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
const inspectedImages = new Map();

for (const [route, html] of pages) {
  const h1s = html.match(/<h1(?:\s|>)/g) ?? [];
  if (h1s.length !== 1) fail(`${route}: expected one h1, found ${h1s.length}`);
  const h1 = normalizeText(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1]);
  const expectedHeading = routeByPath.get(route)?.heading;
  if (expectedHeading && h1 !== expectedHeading) {
    fail(`${route}: h1 is "${h1}", expected reviewed heading "${expectedHeading}"`);
  }
  if (!/<title>[^<]+<\/title>/.test(html)) fail(`${route}: missing title`);
  if (!/<meta\s+name="description"\s+content="[^"]+"/.test(html)) fail(`${route}: missing meta description`);
  if (!/<link\s+rel="canonical"\s+href="[^"]+"/.test(html)) fail(`${route}: missing canonical URL`);
  if (!/<meta\s+property="og:url"\s+content="[^"]+"/.test(html)) fail(`${route}: missing og:url`);
  if (!/<meta\s+name="robots"\s+content="[^"]+"/.test(html)) fail(`${route}: missing robots directive`);
  if (!/<meta\s+property="og:image"\s+content="https:\/\/[^"]+"/.test(html)) fail(`${route}: missing absolute og:image`);
  if (!/<meta\s+name="twitter:card"\s+content="summary_large_image"/.test(html)) fail(`${route}: missing large-image Twitter card`);
  if (!/<meta\s+name="twitter:image:alt"\s+content="[^"]+"/.test(html)) fail(`${route}: missing Twitter image alt text`);
  if (!/<script[^>]+type="application\/ld\+json"/.test(html)) fail(`${route}: missing structured data`);

  const canonicalUrl = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/)?.[1];
  const openGraphUrl = html.match(/<meta\s+property="og:url"\s+content="([^"]+)"/)?.[1];
  if (canonicalUrl && openGraphUrl && canonicalUrl !== openGraphUrl) fail(`${route}: canonical and og:url differ`);
  if (route !== '/404' && canonicalUrl) {
    const expectedCanonical = route === '/' ? siteConfig.url : `${siteConfig.url}${route}`;
    if (canonicalUrl !== expectedCanonical) fail(`${route}: canonical is ${canonicalUrl}, expected ${expectedCanonical}`);
    const prior = pageCanonicals.get(canonicalUrl);
    if (prior) fail(`${route}: duplicate canonical also used by ${prior}`);
    pageCanonicals.set(canonicalUrl, route);
  }

  const structuredData = [];
  for (const block of html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      structuredData.push(JSON.parse(block[1]));
    } catch {
      fail(`${route}: invalid JSON-LD`);
    }
  }

  if (route !== '/') {
    const breadcrumb = structuredData.find((item) => item['@type'] === 'BreadcrumbList');
    const ancestors = [];
    let cursor = routeByPath.get(route);
    while (cursor && cursor.path !== '/') {
      ancestors.unshift(cursor);
      cursor = cursor.parentPath ? routeByPath.get(cursor.parentPath) : undefined;
    }
    const expectedBreadcrumbs = route === '/404'
      ? [{ name: siteConfig.name, item: siteConfig.url }, { name: 'Not Found', item: `${siteConfig.url}/404` }]
      : [{ name: siteConfig.name, item: siteConfig.url }, ...ancestors.map((item) => ({ name: item.label, item: `${siteConfig.url}${item.path}` }))];
    const actualBreadcrumbs = breadcrumb?.itemListElement ?? [];
    if (actualBreadcrumbs.length !== expectedBreadcrumbs.length) {
      fail(`${route}: expected ${expectedBreadcrumbs.length} breadcrumb levels, found ${actualBreadcrumbs.length}`);
    } else {
      expectedBreadcrumbs.forEach((expected, index) => {
        const actual = actualBreadcrumbs[index];
        if (actual?.position !== index + 1 || actual?.name !== expected.name || actual?.item !== expected.item) {
          fail(`${route}: breadcrumb ${index + 1} does not match ${expected.name} (${expected.item})`);
        }
      });
    }
  }

  const ogImage = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/)?.[1];
  const twitterImage = html.match(/<meta\s+name="twitter:image"\s+content="([^"]+)"/)?.[1];
  const declaredWidth = Number(html.match(/<meta\s+property="og:image:width"\s+content="([^"]+)"/)?.[1]);
  const declaredHeight = Number(html.match(/<meta\s+property="og:image:height"\s+content="([^"]+)"/)?.[1]);
  if (ogImage && twitterImage !== ogImage) fail(`${route}: twitter:image differs from og:image`);
  if (ogImage) {
    const imageUrl = new URL(ogImage);
    if (imageUrl.origin !== siteConfig.url) {
      fail(`${route}: social image must use the canonical site origin`);
    } else {
      let dimensions = inspectedImages.get(imageUrl.pathname);
      if (!dimensions) {
        try {
          dimensions = pngDimensions(await readFile(join(DIST, imageUrl.pathname.slice(1))));
          inspectedImages.set(imageUrl.pathname, dimensions);
        } catch {
          fail(`${route}: social image ${imageUrl.pathname} is missing from the build`);
        }
      }
      if (!dimensions) fail(`${route}: social image ${imageUrl.pathname} is not a valid PNG`);
      else {
        if (dimensions.width !== declaredWidth || dimensions.height !== declaredHeight) {
          fail(`${route}: declared social image size ${declaredWidth}x${declaredHeight} differs from ${dimensions.width}x${dimensions.height}`);
        }
        const ratio = dimensions.width / dimensions.height;
        if (ratio < 1.8 || ratio > 2) fail(`${route}: summary_large_image ratio ${ratio.toFixed(3)} is not wide-card safe`);
      }
    }
  }

  const article = structuredData.find((item) => item['@type'] === 'Article');
  const expectedModified = routeByPath.get(route)?.lastModified;
  const webPage = structuredData.find((item) => item['@type'] === 'WebPage');
  if (expectedModified && webPage?.dateModified !== expectedModified) {
    fail(`${route}: WebPage dateModified is ${webPage?.dateModified}, expected ${expectedModified}`);
  }
  if (article) {
    const articleImage = Array.isArray(article.image) ? article.image[0] : article.image;
    if (articleImage !== ogImage) fail(`${route}: Article image must match the page-specific social image`);
    if (articleImage === siteConfig.url + '/og/bitcoinmind.png') fail(`${route}: Article uses the generic site image`);
    if (!article.publisher) fail(`${route}: Article is missing publisher identity`);
    if (expectedModified && article.dateModified !== expectedModified) {
      fail(`${route}: Article dateModified is ${article.dateModified}, expected ${expectedModified}`);
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
  if (!html.includes("analytics_storage: 'granted'")) fail(`${route}: enabled GA4 analytics storage is missing`);
  if (!html.includes("ad_storage: 'denied'")) fail(`${route}: denied GA4 advertising storage is missing`);
  if (!html.includes("ad_user_data: 'denied'")) fail(`${route}: denied GA4 advertising user data is missing`);
  if (!html.includes("ad_personalization: 'denied'")) fail(`${route}: denied GA4 advertising personalization is missing`);
  if (html.includes('bitcoinmind_analytics_consent')) fail(`${route}: obsolete analytics preference storage is present`);
  if (html.includes('data-analytics-consent')) fail(`${route}: obsolete analytics consent UI is present`);
  if (!html.includes('isProductionHost')) fail(`${route}: analytics production-host guard is missing`);
}
if (builtGa4Ids.size > 1) fail(`analytics: multiple GA4 Measurement IDs found: ${[...builtGa4Ids].join(', ')}`);

const sitemapLastmods = [...sitemap.matchAll(/<lastmod>(.*?)<\/lastmod>/g)].map((match) => match[1]);
if (sitemapLastmods.length !== sitemapRoutes.length) fail('sitemap: every URL must have a lastmod value');
for (const [index, value] of sitemapLastmods.entries()) {
  if (!validDate(value)) {
    fail(`sitemap: invalid lastmod ${value}`);
  }
  const route = sitemapRoutes[index];
  const expected = routeByPath.get(route)?.lastModified;
  if (expected && value !== expected) fail(`sitemap: ${route} lastmod is ${value}, expected ${expected}`);
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
  ["/", /id="site-menu"[\s\S]{0,240}?aria-modal="true"/, "modal mobile-menu semantics"],
];
for (const [route, pattern, label] of contracts) {
  if (!pattern.test(pages.get(route) ?? "")) fail(`${route}: missing ${label}`);
}

if (!/name="robots"\s+content="noindex, (?:no)?follow"/.test(pages.get("/404") ?? "")) {
  fail("/404: missing noindex directive");
}

const builtCss = (await Promise.all(
  (await readdir(assetDirectory)).filter((name) => name.endsWith(".css"))
    .map((name) => read(join(assetDirectory, name))),
)).join("\n");

// Inline prose links inherit the global anchor reset, so without an explicit
// rule they render identically to the paragraph around them.
if (!/\.a-body a[^{]*\{[^}]*text-decoration:\s*underline/.test(builtCss)) {
  fail("styles: inline prose links are missing their underline affordance");
}

// Fontsource emits a legacy .woff beside every .woff2; the build strips the
// fallback so those files are never referenced or shipped.
const legacyFonts = (await readdir(assetDirectory)).filter((name) => name.endsWith(".woff"));
if (legacyFonts.length) fail(`performance: ${legacyFonts.length} legacy .woff font(s) shipped`);
if (/format\((["'])woff\1\)/.test(builtCss)) fail("performance: built CSS still references legacy .woff");

// The resource filter belongs only to the pages that render a filter scope.
// It used to be an inline block in the shared layout, so every page paid for
// it. The marker is the code's own attribute lookup, not the card markup.
for (const [route, html] of pages) {
  if (/data-filter-card/.test(html)) continue;
  const shipsFilterCode = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
    .some(([, body]) => body.includes("filter-values"));
  if (shipsFilterCode) fail(`${route}: ships resource-filter code but renders no filters`);
}

// worker/index.js names every inline script by hash. If the committed list
// does not match what this build emitted, the deployed CSP would block them.
const builtHashes = await collectScriptHashes(DIST);
const declaredHashes = JSON.parse(await read(join(ROOT, "worker/script-hashes.json")));
for (const hash of builtHashes) {
  if (!declaredHashes.includes(hash)) fail(`csp: worker/script-hashes.json is missing ${hash}`);
}
for (const hash of declaredHashes) {
  if (!builtHashes.includes(hash)) fail(`csp: worker/script-hashes.json has a stale entry ${hash}`);
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

const assets = await readdir(assetDirectory);
const sizes = await Promise.all(assets.map(async (name) => ({ name, bytes: (await stat(join(assetDirectory, name))).size })));
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
if (totalFonts > 260_000) fail(`performance: total fonts are ${totalFonts} bytes (budget 260,000)`);

for (const message of warnings) console.warn(`WARN  ${message}`);
if (failures.length) {
  for (const message of failures) console.error(`FAIL  ${message}`);
  console.error(`\nAudit failed with ${failures.length} error(s).`);
  process.exit(1);
}

console.log(`Audit passed: ${sitemapRoutes.length} routes, ${sizes.length} assets, ${warnings.length} warning(s).`);
