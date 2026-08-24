import type { TextItem } from '@/data/types';

export function textTypeLabel(text: TextItem): string {
  if (text.resourceType === 'paper') return 'Paper';
  if (text.resourceType === 'series') return 'Series';
  if (text.resourceType === 'reference') return 'Reference';

  const title = text.title.toLowerCase();
  if (title.includes('documentation') || title.includes('running a full node')) return 'Documentation';
  if (title.includes('questions') || title.includes('faq')) return 'Q&A';
  if (text.tags.includes('Reference')) return 'Reference';
  return 'Essay';
}

export function filterValues(values: string[]): string {
  return values.map((value) => value.toLowerCase()).join('|');
}

export function searchValues(values: Array<string | number>): string {
  return values.join(' ').toLowerCase();
}
