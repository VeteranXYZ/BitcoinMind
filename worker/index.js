import siteData from '../src/data/site.json' with { type: 'json' };

const CANONICAL_HOST = new URL(siteData.url).hostname;
const LEGACY_SITEMAP_PATHS = new Set(['/sitemap-index.xml', '/sitemap-0.xml']);
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
  "font-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "img-src 'self' data: https://*.google-analytics.com https://www.googletagmanager.com",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  'upgrade-insecure-requests',
  "worker-src 'none'",
].join('; ');

const SECURITY_HEADERS = {
  'Content-Security-Policy': CONTENT_SECURITY_POLICY,
  'Permissions-Policy': 'camera=(), geolocation=(), microphone=()',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

function cacheControlFor(url, response) {
  if (url.pathname.startsWith('/_astro/') || url.pathname === '/grain.png') {
    return 'public, max-age=31536000, immutable';
  }
  if (url.pathname === '/favicon.ico') return 'public, max-age=2592000';
  if (url.pathname === '/pulse.json') return 'public, max-age=300, must-revalidate';
  if (response.headers.get('Content-Type')?.includes('text/html')) {
    return 'public, max-age=300, must-revalidate';
  }
  return null;
}

function finalizeResponse(response, url) {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) headers.set(name, value);

  const cacheControl = cacheControlFor(url, response);
  if (cacheControl) headers.set('Cache-Control', cacheControl);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === `www.${CANONICAL_HOST}`) {
      url.hostname = CANONICAL_HOST;
      return finalizeResponse(Response.redirect(url.toString(), 301), url);
    }

    if (LEGACY_SITEMAP_PATHS.has(url.pathname)) {
      url.pathname = '/sitemap.xml';
      return finalizeResponse(Response.redirect(url.toString(), 301), url);
    }

    const assetResponse = await env.ASSETS.fetch(request);

    if (assetResponse.status === 404 && ['GET', 'HEAD'].includes(request.method)) {
      const notFoundUrl = new URL('/404', url);
      const notFoundResponse = await env.ASSETS.fetch(new Request(notFoundUrl, request));

      return finalizeResponse(new Response(request.method === 'HEAD' ? null : notFoundResponse.body, {
        status: 404,
        headers: notFoundResponse.headers,
      }), url);
    }

    return finalizeResponse(assetResponse, url);
  },
};
