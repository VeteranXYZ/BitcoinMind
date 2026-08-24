import { SITE } from '@/lib/seo';
import { CANONICAL_PATHS } from '@/lib/routes';

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
  const urls = CANONICAL_PATHS
    .map((path) => `  <url><loc>${xmlEscape(toUrl(path))}</loc><lastmod>${SITE.lastModified}</lastmod></url>`)
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
