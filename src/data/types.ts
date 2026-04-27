export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type LayerLabel = 'Start Here' | 'Go Deeper' | 'For Thinkers';

export interface Book {
  id: string;
  title: string;
  author: string;
  layer: 1 | 2 | 3;
  ll: LayerLabel;
  tags: string[];
  diff: Difficulty;
  desc: string;
  review: string[];
  link: string;
}

export interface Essay {
  id: string;
  title: string;
  author: string;
  year: number;
  tags: string[];
  rt: string;
  desc: string;
  review: string[];
  link: string;
}

export interface Tool {
  id: string;
  name: string;
  cat: 'Sovereignty' | 'Intelligence';
  tags: string[];
  cost: 'Free' | 'Paid' | 'Freemium';
  desc: string;
  link: string;
}
