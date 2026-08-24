import routeData from '@/data/routes.json';

export type RouteSection = 'Core' | 'Lens' | 'Hiei';

export interface SiteRoute {
  path: string;
  label: string;
  section: RouteSection;
  legacyHash: string;
  navArea?: 'primary' | 'explore';
  navOrder?: number;
  description?: string;
  parentPath?: string;
}

export const PUBLIC_ROUTES = routeData as SiteRoute[];
export const CANONICAL_PATHS = PUBLIC_ROUTES.map((route) => route.path);

const visibleRoutes = PUBLIC_ROUTES.filter((route) => !route.parentPath);
const byNavOrder = (a: SiteRoute, b: SiteRoute) => (a.navOrder ?? 0) - (b.navOrder ?? 0);

export function matchPaths(route: SiteRoute): string[] {
  return [
    route.path,
    ...PUBLIC_ROUTES.filter((candidate) => candidate.parentPath === route.path).map((candidate) => candidate.path),
  ];
}

export const PRIMARY_NAV_ROUTES = visibleRoutes
  .filter((route) => route.navArea === 'primary')
  .sort(byNavOrder);

export const GROUPED_NAV_ROUTES = (['Core', 'Lens', 'Hiei'] as RouteSection[]).map((section) => ({
  label: section,
  routes: visibleRoutes.filter((route) => route.section === section).sort(byNavOrder),
}));

export const EXPLORE_NAV_ROUTES = GROUPED_NAV_ROUTES
  .filter((group) => group.label !== 'Core')
  .map((group) => ({
    ...group,
    routes: group.routes.filter((route) => route.navArea === 'explore'),
  }));

export const LEGACY_HASH_REDIRECTS = Object.fromEntries(
  PUBLIC_ROUTES.map((route) => [route.legacyHash, route.path]),
);
