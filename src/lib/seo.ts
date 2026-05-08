export interface PageSeo {
  title: string;
  description: string;
  path: string;
}

export const SITE = {
  name: 'BitcoinMind',
  url: 'https://bitcoinmind.com',
  tagline: 'Curated resources for people who want to understand Bitcoin, not just own it.',
  author: 'Hiei',
  contactEmail: 'hiei1988@gmail.com',
  foundedYear: 2017,
  currentYear: 2026,
  lastUpdated: 'May 2026',
};

export function fullTitle(title: string): string {
  return title === SITE.name ? `${SITE.name} — ${SITE.author}` : `${title} — ${SITE.name}`;
}

export function canonical(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE.url}${clean === '/' ? '' : clean}`;
}
