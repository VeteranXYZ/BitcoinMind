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

    const assetResponse = await env.ASSETS.fetch(request);

    if (assetResponse.status === 404 && ['GET', 'HEAD'].includes(request.method)) {
      const notFoundUrl = new URL('/404.html', url);
      const notFoundResponse = await env.ASSETS.fetch(new Request(notFoundUrl, request));

      return new Response(request.method === 'HEAD' ? null : notFoundResponse.body, {
        status: 404,
        headers: notFoundResponse.headers,
      });
    }

    return assetResponse;
  },
};
