import { SITE } from '@/lib/seo';

export function GET() {
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
