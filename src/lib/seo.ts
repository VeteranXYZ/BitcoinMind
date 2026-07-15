export interface PageSeo {
  title: string;
  description: string;
  path: string;
}

export const SITE = {
  name: 'BitcoinMind',
  url: 'https://bitcoinmind.com',
  ga4MeasurementId: import.meta.env.PUBLIC_GA4_MEASUREMENT_ID?.trim() || 'G-EW3470R00V',
  tagline: 'A curated, first-principles guide to Bitcoin: money, protocol, verification, self-custody, history, and the strongest objections.',
  author: 'Hiei',
  contactEmail: 'hiei1988@gmail.com',
  foundedYear: 2017,
  currentYear: 2026,
  lastUpdated: 'July 2026',
  lastModified: '2026-07-12',
  socialImage: 'https://bitcoinmind.com/og-image.png',
};

export function fullTitle(title: string): string {
  return title === SITE.name
    ? `${SITE.name} — Learn Bitcoin from First Principles`
    : `${title} — ${SITE.name}`;
}

export function canonical(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE.url}${clean === '/' ? '' : clean}`;
}
