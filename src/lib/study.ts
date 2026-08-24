export type StudyStageKey = 'orient' | 'understand' | 'verify' | 'practice' | 'reflect';

export interface StudyStage {
  key: StudyStageKey;
  number: number;
  label: string;
  question: string;
  description: string;
}

export const STUDY_STAGES: StudyStage[] = [
  { key: 'orient', number: 1, label: 'Orient', question: 'What problem is being solved?', description: 'Begin with money, trust, settlement, and the history that made Bitcoin legible.' },
  { key: 'understand', number: 2, label: 'Understand', question: 'How can the rules hold?', description: 'Study keys, transactions, proof of work, incentives, and consensus without slogans.' },
  { key: 'verify', number: 3, label: 'Verify', question: 'Which claims can I check?', description: 'Read primary sources, inspect the network, and separate observation from verification.' },
  { key: 'practice', number: 4, label: 'Practice', question: 'Which risks become mine?', description: 'Learn wallets, custody, recovery, privacy, payments, and the cost of personal control.' },
  { key: 'reflect', number: 5, label: 'Reflect', question: 'What remains uncertain?', description: 'Test the thesis against objections, political tradeoffs, and unresolved questions.' },
];

const STAGE_BY_PATH: Record<string, StudyStageKey> = {
  Money: 'orient',
  History: 'orient',
  Protocol: 'understand',
  Macro: 'understand',
  Verification: 'verify',
  Observation: 'verify',
  Research: 'verify',
  Reference: 'verify',
  Custody: 'practice',
  Payments: 'practice',
  Meaning: 'reflect',
  Sovereignty: 'reflect',
  Adoption: 'reflect',
};

export function studyStageFor(pathStage: string): StudyStage {
  const key = STAGE_BY_PATH[pathStage] ?? 'understand';
  return STUDY_STAGES.find((stage) => stage.key === key)!;
}

export function formatReviewedAt(value: string): string {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}
