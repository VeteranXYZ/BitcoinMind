export interface CatalogRabbitHoleStep {
  type: 'library' | 'text' | 'toolkit';
  resourceId: string;
  time?: string;
}

export interface LinkedRabbitHoleStep {
  title: string;
  author?: string;
  type: 'frame' | 'external';
  href: string;
  time?: string;
}

export type RabbitHoleStep = CatalogRabbitHoleStep | LinkedRabbitHoleStep;

export interface RabbitHole {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  desc: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  totalTime: string;
  prerequisite: string;
  outcome: string;
  nextHref: string;
  nextLabel: string;
  steps: RabbitHoleStep[];
}

export const RABBIT_HOLES: RabbitHole[] = [
  {
    id: 'rh-monetary',
    emoji: '🏛',
    title: 'The Monetary Path',
    subtitle: 'Five thousand years of money in five steps',
    desc: 'Understand what money is, where it comes from, and why Bitcoin belongs in a longer history of monetary competition. Begin here if you want to understand the "why" before the "how."',
    difficulty: 'Beginner',
    totalTime: '~12 hours',
    prerequisite: 'No prior Bitcoin knowledge. Curiosity about why societies converge on money is enough.',
    outcome: 'You can explain monetary hardness, compare Bitcoin with earlier monies, and state the monetary thesis without relying on price.',
    nextHref: '/objections',
    nextLabel: 'Test the thesis against serious objections',
    steps: [
      { title: 'A History of Hardness', type: 'frame', href: '/frames/1', time: '15 min' },
      { resourceId: 'the-bitcoin-standard', type: 'library', time: '3 hrs' },
      { resourceId: 'shelling-out', type: 'text', time: '40 min' },
      { resourceId: 'the-bullish-case-for-bitcoin', type: 'text', time: '45 min' },
      { resourceId: 'the-sovereign-individual', type: 'library', time: '8 hrs' },
    ],
  },
  {
    id: 'rh-technical',
    emoji: '🔧',
    title: 'The Technical Path',
    subtitle: 'How Bitcoin actually works',
    desc: 'Go beyond the surface. Understand UTXOs, proof of work, the consensus mechanism, and the code that runs the network. Not for programmers only — for anyone who refuses to take someone else\'s word for it.',
    difficulty: 'Intermediate',
    totalTime: '~11 hours',
    prerequisite: 'Complete the Primer or be comfortable with the basic monetary case for Bitcoin.',
    outcome: 'You can describe transactions, UTXOs, proof of work, validation, and the difference between observing a network and verifying it.',
    nextHref: '/toolkit#bitcoin-core',
    nextLabel: 'Run or inspect a verification tool',
    steps: [
      { resourceId: 'inventing-bitcoin', type: 'library', time: '2 hrs' },
      { resourceId: 'grokking-bitcoin', type: 'library', time: '5 hrs' },
      { resourceId: 'bitcoin-whitepaper', type: 'text', time: '20 min' },
      { resourceId: 'bitcoins-security-model', type: 'text', time: '45 min' },
      { resourceId: 'bitcoin-core', type: 'toolkit', time: '2 hrs' },
      { resourceId: 'mempool-space', type: 'toolkit', time: '1 hr' },
      { resourceId: 'sparrow-wallet', type: 'toolkit', time: '1 hr' },
    ],
  },
  {
    id: 'rh-custody',
    emoji: '🛡',
    title: 'The Sovereignty Path',
    subtitle: 'Your keys, your coins',
    desc: 'Learn self-custody from first principles. Move from exchange-held coins to a hardware wallet, then to multi-sig. Each step increases your sovereignty and reduces your trust surface.',
    difficulty: 'Intermediate',
    totalTime: '~8 hours',
    prerequisite: 'Understand seed phrases, transaction finality, and why self-custody transfers responsibility to the holder.',
    outcome: 'You can compare mobile, hardware, air-gapped, and multisig custody while identifying recovery and inheritance failure modes.',
    nextHref: '/stack',
    nextLabel: 'Read the operating principles behind a custody practice',
    steps: [
      { title: 'Why self-custody matters', type: 'external', href: 'https://unchained.com/blog/bitcoin-self-custody/', time: '15 min' },
      { resourceId: 'bluewallet', type: 'toolkit', time: '45 min' },
      { resourceId: 'trezor-safe-3', type: 'toolkit', time: '1 hr' },
      { resourceId: 'sparrow-wallet', type: 'toolkit', time: '2 hrs' },
      { resourceId: 'coldcard', type: 'toolkit', time: '2 hrs' },
      { resourceId: 'nunchuk', type: 'toolkit', time: '2 hrs' },
    ],
  },
  {
    id: 'rh-philosophy',
    emoji: '📜',
    title: 'The Philosophy Path',
    subtitle: 'What does Bitcoin mean?',
    desc: 'Bitcoin is not just technology. It is an idea about sovereignty, time, trust, and what it means to own something that no one can take from you. This path follows the idea to its edges.',
    difficulty: 'Intermediate',
    totalTime: '~15 hours',
    prerequisite: 'Know the basic monetary and technical case. This path examines implications rather than mechanics.',
    outcome: 'You can distinguish protocol facts from philosophical claims and articulate where sovereignty arguments remain contestable.',
    nextHref: '/questions',
    nextLabel: 'Continue with open questions',
    steps: [
      { resourceId: 'the-internet-of-money', type: 'library', time: '4 hrs' },
      { resourceId: '21-lessons', type: 'library', time: '3 hrs' },
      { resourceId: 'bitcoin-is-time', type: 'text', time: '35 min' },
      { resourceId: 'the-sovereign-individual', type: 'library', time: '8 hrs' },
      { resourceId: 'check-your-financial-privilege', type: 'library', time: '3 hrs' },
    ],
  },
  {
    id: 'rh-economics',
    emoji: '📊',
    title: 'The Economics Path',
    subtitle: 'The case for Bitcoin as a monetary asset',
    desc: 'The strongest arguments for Bitcoin as superior money. Begin with the clearest single text, work through the most systematic framework, and end with the data that supports the thesis.',
    difficulty: 'Intermediate',
    totalTime: '~10 hours',
    prerequisite: 'Understand the difference between monetary adoption, investment performance, and protocol operation.',
    outcome: 'You can read long-term market and purchasing-power data without treating a chart as a forecast or trading signal.',
    nextHref: '/frames/2',
    nextLabel: 'Inspect the data and its methodology',
    steps: [
      { resourceId: 'the-bullish-case-for-bitcoin', type: 'text', time: '45 min' },
      { resourceId: 'gradually-then-suddenly', type: 'text', time: '4 hrs' },
      { title: 'After the Anchor', type: 'frame', href: '/frames/2', time: '20 min' },
      { resourceId: 'speculative-attack', type: 'text', time: '25 min' },
      { resourceId: 'lookintobitcoin', type: 'toolkit', time: '1 hr' },
    ],
  },
];
