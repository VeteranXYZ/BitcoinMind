export interface PageSeo {
  title: string;
  description: string;
  path: string;
}

import siteData from '@/data/site.json';
import { PUBLIC_ROUTES } from '@/lib/routes';

// Freshness has one source of truth: the reviewed `lastModified` dates in
// routes.json. Deriving both values here keeps the About page, the sitemap,
// and the JSON-LD from drifting apart the way a hand-kept string does.
const latestReviewDate = PUBLIC_ROUTES
  .map((route) => route.lastModified)
  .reduce((latest, value) => (value > latest ? value : latest));

function monthYear(isoDate: string): string {
  return new Date(`${isoDate.slice(0, 7)}-01T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export const SITE = {
  ...siteData,
  host: new URL(siteData.url).hostname,
  ga4MeasurementId: import.meta.env.PUBLIC_GA4_MEASUREMENT_ID?.trim() || 'G-EW3470R00V',
  socialImage: `${siteData.url}/og/bitcoinmind.png`,
  /** Newest reviewed route date, e.g. "2026-09-01". */
  lastModified: latestReviewDate,
  /** The same date rendered for readers, e.g. "September 2026". */
  lastUpdated: monthYear(latestReviewDate),
  /** Readable form of the first-contact month, e.g. "April 2011". */
  firstContactLabel: monthYear(`${siteData.firstContact}-01`),
};

/** Whole years between the first Bitcoin note and the newest reviewed page. */
export function yearsSinceFirstContact(): number {
  const [fromYear, fromMonth] = siteData.firstContact.split('-').map(Number);
  const [toYear, toMonth] = latestReviewDate.slice(0, 7).split('-').map(Number);
  const months = (toYear! - fromYear!) * 12 + (toMonth! - fromMonth!);
  return Math.floor(months / 12);
}

export function fullTitle(title: string): string {
  return title === SITE.name
    ? `${SITE.name} — Learn Bitcoin from First Principles`
    : `${title} — ${SITE.name}`;
}

export function canonical(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE.url}${clean === '/' ? '' : clean}`;
}
