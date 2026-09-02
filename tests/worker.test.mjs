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
  // Hashes make 'unsafe-inline' inert in any browser that understands them.
  assert.match(html.headers.get('Content-Security-Policy'), /script-src[^;]+'sha256-[A-Za-z0-9+/=]+'/);

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
  assert.equal(missing.headers.get('Cache-Control'), 'public, max-age=60, must-revalidate');
  assert.match(await missing.text(), /Not found/);
});

test('never caches an error under an immutable path rule', async () => {
  // A 404 for a fingerprinted asset — a half-rolled deploy, or stale HTML
  // pointing at a file that is gone — must not be pinned for a year.
  for (const path of ['/_astro/deleted.abc123.js', '/grain.png', '/favicon.ico']) {
    const response = await worker.fetch(new Request(`https://bitcoinmind.com${path}`), {
      ASSETS: { fetch: () => new Response('gone', { status: 404 }) },
    });
    assert.equal(response.status, 404, path);
    assert.equal(response.headers.get('Cache-Control'), 'public, max-age=60, must-revalidate', path);
  }
});

test('serves the styled 404 without leaking the asset layer body', async () => {
  const head = await worker.fetch(new Request('https://bitcoinmind.com/missing', { method: 'HEAD' }), env);
  assert.equal(head.status, 404);
  assert.equal(await head.text(), '');

  const post = await worker.fetch(new Request('https://bitcoinmind.com/missing', { method: 'POST' }), env);
  assert.equal(post.status, 404);
  assert.equal(await post.text(), '');
});
