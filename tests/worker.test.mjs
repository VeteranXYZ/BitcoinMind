import assert from 'node:assert/strict';
import test from 'node:test';
import worker from '../worker/index.js';

function assetResponse(request) {
  const { pathname } = new URL(request.url);
  if (pathname === '/missing') return new Response('missing', { status: 404 });
  if (pathname === '/404') {
    return new Response('<h1>Not found</h1>', {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
  if (pathname.startsWith('/_astro/')) {
    return new Response('body {}', {
      headers: {
        'Cache-Control': 'public, max-age=300, public, max-age=31536000, immutable',
        'Content-Type': 'text/css; charset=utf-8',
      },
    });
  }
  return new Response('<h1>BitcoinMind</h1>', {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

const env = { ASSETS: { fetch: assetResponse } };

test('normalizes cache and security headers', async () => {
  const html = await worker.fetch(new Request('https://bitcoinmind.com/'), env);
  assert.equal(html.headers.get('Cache-Control'), 'public, max-age=300, must-revalidate');
  assert.equal(html.headers.get('Strict-Transport-Security'), 'max-age=31536000; includeSubDomains');
  assert.match(html.headers.get('Content-Security-Policy'), /frame-ancestors 'none'/);
  assert.match(html.headers.get('Content-Security-Policy'), /connect-src[^;]+\*\.analytics\.google\.com/);
  assert.match(html.headers.get('Content-Security-Policy'), /img-src[^;]+\*\.google-analytics\.com/);

  const asset = await worker.fetch(new Request('https://bitcoinmind.com/_astro/app.abc.css'), env);
  assert.equal(asset.headers.get('Cache-Control'), 'public, max-age=31536000, immutable');
  assert.doesNotMatch(asset.headers.get('Cache-Control'), /max-age=300,/);
});

test('keeps redirects and styled 404 responses hardened', async () => {
  const redirect = await worker.fetch(new Request('https://www.bitcoinmind.com/primer'), env);
  assert.equal(redirect.status, 301);
  assert.equal(redirect.headers.get('Location'), 'https://bitcoinmind.com/primer');
  assert.equal(redirect.headers.get('X-Frame-Options'), 'DENY');

  const missing = await worker.fetch(new Request('https://bitcoinmind.com/missing'), env);
  assert.equal(missing.status, 404);
  assert.equal(missing.headers.get('Cache-Control'), 'public, max-age=300, must-revalidate');
  assert.match(await missing.text(), /Not found/);
});
