const CANONICAL_HOST = 'bitcoinmind.com';
const LEGACY_SITEMAP_PATHS = new Set(['/sitemap-index.xml', '/sitemap-0.xml']);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === `www.${CANONICAL_HOST}`) {
      url.hostname = CANONICAL_HOST;
      return Response.redirect(url.toString(), 301);
    }

    if (LEGACY_SITEMAP_PATHS.has(url.pathname)) {
      url.pathname = '/sitemap.xml';
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
