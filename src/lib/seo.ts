export interface PageSeo {
  title: string;
  description: string;
  path: string;
}

export const SITE = {
  name: 'BitcoinMind',
  url: 'https://bitcoinmind.com',
  tagline: 'BitcoinMind is a personal knowledge map for studying Bitcoin through the Library, primary texts, custody instruments, monetary history, verification, and sovereignty.',
  author: 'Hiei',
  contactEmail: 'hiei1988@gmail.com',
  foundedYear: 2017,
  currentYear: 2026,
  lastUpdated: 'July 2026',
  socialImage: 'https://bitcoinmind.com/og-image.png',
};

export function fullTitle(title: string): string {
  return title === SITE.name
    ? `${SITE.name} — A Bitcoin Learning Path for Money, Custody, and Sovereignty`
    : `${title} — ${SITE.name}`;
}

export function canonical(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE.url}${clean === '/' ? '' : clean}`;
}
