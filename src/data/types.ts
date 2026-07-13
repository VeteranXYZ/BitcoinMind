export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type Cost = 'Free' | 'Paid' | 'Freemium';

export interface LibraryItem {
  id: string;
  title: string;
  author: string;
  group: string;
  pathStage: string;
  resourceType: string;
  layer: 1 | 2 | 3;
  layerLabel: string;
  learningRole: string;
  shortDescription: string;
  whyItBelongs: string;
  bestFor: string;
  learningPathPosition: string;
  difficulty: Difficulty;
  tags: string[];
  link: string;
}

export interface TextItem {
  id: string;
  title: string;
  author: string;
  year: number;
  group: string;
  pathStage: string;
  resourceType: string;
  layer: string;
  learningRole: string;
  shortDescription: string;
  whyItBelongs: string;
  bestFor: string;
  learningPathPosition: string;
  difficulty: Difficulty;
  timeCommitment: string;
  tags: string[];
  link: string;
}

export interface ToolkitItem {
  id: string;
  title: string;
  group: string;
  pathStage: string;
  resourceType: string;
  layer: string;
  learningRole: string;
  shortDescription: string;
  whyItBelongs: string;
  bestFor: string;
  learningPathPosition: string;
  difficulty: Difficulty;
  cost: Cost;
  tags: string[];
  link: string;
  reviewedAt: string;
  timeSensitive: boolean;
  sourceLabel: string;
}
