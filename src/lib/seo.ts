export interface PageSeo {
  title: string;
  description: string;
  path: string;
}

import siteData from '@/data/site.json';

export const SITE = {
  ...siteData,
  host: new URL(siteData.url).hostname,
  ga4MeasurementId: import.meta.env.PUBLIC_GA4_MEASUREMENT_ID?.trim() || 'G-EW3470R00V',
  socialImage: `${siteData.url}/og/bitcoinmind.png`,
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
