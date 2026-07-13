export type StudyStageKey = 'orient' | 'understand' | 'verify' | 'practice' | 'reflect';

export interface StudyStage {
  key: StudyStageKey;
  number: number;
  label: string;
  question: string;
  description: string;
}

export const STUDY_STAGES: StudyStage[] = [
  { key: 'orient', number: 1, label: 'Orient', question: 'Why does this matter?', description: 'Money, history, and the problem Bitcoin is trying to solve.' },
  { key: 'understand', number: 2, label: 'Understand', question: 'How does it work?', description: 'Protocol rules, incentives, and the structure of the network.' },
  { key: 'verify', number: 3, label: 'Verify', question: 'What can I check?', description: 'Primary sources, nodes, data, and independent observation.' },
  { key: 'practice', number: 4, label: 'Practice', question: 'What changes in use?', description: 'Wallets, custody, payments, recovery, and operational tradeoffs.' },
  { key: 'reflect', number: 5, label: 'Reflect', question: 'What follows from it?', description: 'Objections, sovereignty, adoption, and unresolved questions.' },
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
