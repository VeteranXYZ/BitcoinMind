import { SITE } from '@/lib/seo';
import { PUBLIC_ROUTES } from '@/lib/routes';

function xmlEscape(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function toUrl(path: string): string {
  const base = SITE.url.replace(/\/$/, '');
  return path === '/' ? base : `${base}${path}`;
}

export function GET() {
  const urls = PUBLIC_ROUTES
    .map((route) => `  <url><loc>${xmlEscape(toUrl(route.path))}</loc><lastmod>${route.lastModified}</lastmod></url>`)
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      `${urls}\n` +
      `</urlset>\n`,
    {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    },
  );
}
