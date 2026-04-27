import { BOOKS } from '@/data/books';
import { ESSAYS } from '@/data/essays';
import type { Book, Essay } from '@/data/types';

export type Pick =
  | (Book & { type: 'book' })
  | (Essay & { type: 'essay' });

const ALL: Pick[] = [
  ...BOOKS.map((b) => ({ ...b, type: 'book' as const })),
  ...ESSAYS.map((e) => ({ ...e, type: 'essay' as const })),
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
