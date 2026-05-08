import { LIBRARY } from '@/data/library';
import { TEXTS } from '@/data/texts';
import type { LibraryItem, TextItem } from '@/data/types';

export type Pick =
  | (LibraryItem & { type: 'library' })
  | (TextItem & { type: 'text' });

const ALL: Pick[] = [
  ...LIBRARY.map((item) => ({ ...item, type: 'library' as const })),
  ...TEXTS.map((item) => ({ ...item, type: 'text' as const })),
];

export function getTodaysPick(now: Date = new Date()): Pick {
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  return ALL[seed % ALL.length]!;
}

export function formatLongDate(now: Date = new Date()): string {
  return now.toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}
