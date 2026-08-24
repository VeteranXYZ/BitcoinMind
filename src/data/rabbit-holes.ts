export interface CatalogRabbitHoleStep {
  type: 'library' | 'text' | 'toolkit';
  resourceId: string;
  time?: string;
}

export interface LinkedRabbitHoleStep {
  title: string;
  author?: string;
  type: 'frame' | 'internal' | 'external';
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
    subtitle: 'Why societies converge on money',
    desc: 'Begin before Bitcoin. Study how monetary goods emerge, how settlement and credit differ, and why scarcity matters only when people demand the other properties of money.',
    difficulty: 'Beginner',
    totalTime: '~8 hours',
    prerequisite: 'No prior Bitcoin knowledge. Curiosity about why societies converge on money is enough.',
    outcome: 'You can explain monetary hardness, settlement, and Bitcoin’s monetary thesis without using price performance as proof.',
    nextHref: '/paths#rh-technical',
    nextLabel: 'Ask how the proposed system actually works',
    steps: [
      { resourceId: 'shelling-out', type: 'text', time: '40 min' },
      { title: 'A History of Hardness', type: 'frame', href: '/frames/1', time: '15 min' },
      { resourceId: 'broken-money', type: 'library', time: '4 hrs' },
      { resourceId: 'the-bullish-case-for-bitcoin', type: 'text', time: '45 min' },
      { resourceId: 'layered-money', type: 'library', time: '2 hrs' },
    ],
  },
  {
    id: 'rh-technical',
    emoji: '🔧',
    title: 'The Technical Path',
    subtitle: 'How the rules produce a shared ledger',
    desc: 'Move from the original proposal to transactions, keys, proof of work, difficulty, and validation. The aim is not programming fluency; it is knowing which mechanism supports each claim.',
    difficulty: 'Intermediate',
    totalTime: '~10 hours',
    prerequisite: 'Complete the Primer or be comfortable with the basic monetary case for Bitcoin.',
    outcome: 'You can describe transactions, UTXOs, signatures, proof of work, difficulty adjustment, and block validation without relying on analogy alone.',
    nextHref: '/paths#rh-verification',
    nextLabel: 'Turn protocol knowledge into independent checks',
    steps: [
      { resourceId: 'bitcoin-whitepaper', type: 'text', time: '20 min' },
      { resourceId: 'inventing-bitcoin', type: 'library', time: '2 hrs' },
      { resourceId: 'grokking-bitcoin', type: 'library', time: '5 hrs' },
      { resourceId: 'bitcoins-security-model', type: 'text', time: '45 min' },
      { resourceId: 'mastering-bitcoin', type: 'library', time: 'Reference' },
    ],
  },
  {
    id: 'rh-verification',
    emoji: '◉',
    title: 'The Verification Path',
    subtitle: 'Observe less. Verify more.',
    desc: 'Learn the difference between reading a dashboard, querying someone else’s node, and applying Bitcoin’s rules yourself. Verification is a spectrum of dependence, not a badge.',
    difficulty: 'Intermediate',
    totalTime: '~7 hours',
    prerequisite: 'Understand transactions, blocks, proof of work, and the role of validating nodes.',
    outcome: 'You can identify which claims a block explorer, wallet, or full node can verify—and which trust assumptions remain outside the software.',
    nextHref: '/paths#rh-custody',
    nextLabel: 'Apply verification to ownership and recovery',
    steps: [
      { resourceId: 'running-a-full-node', type: 'text', time: '30 min' },
      { resourceId: 'bitcoin-core', type: 'toolkit', time: '2 hrs' },
      { resourceId: 'mempool-space', type: 'toolkit', time: '45 min' },
      { resourceId: 'the-blocksize-war', type: 'library', time: '4 hrs' },
      { resourceId: 'bitcoin-core-documentation', type: 'text', time: 'Reference' },
    ],
  },
  {
    id: 'rh-custody',
    emoji: '🛡',
    title: 'The Custody Path',
    subtitle: 'Control, recovery, and human failure',
    desc: 'Learn custody as risk transfer. Removing an intermediary reduces some failures while making key security, recovery, privacy, and inheritance your responsibility.',
    difficulty: 'Intermediate',
    totalTime: '~8 hours',
    prerequisite: 'Understand seed phrases, transaction finality, and why self-custody transfers responsibility to the holder.',
    outcome: 'You can compare mobile, hardware, air-gapped, and multisignature custody while naming the specific failure mode each design addresses.',
    nextHref: '/questions#q-07',
    nextLabel: 'Ask whether more control always means more sovereignty',
    steps: [
      { title: 'Why self-custody matters', type: 'external', href: 'https://unchained.com/blog/bitcoin-self-custody/', time: '15 min' },
      { resourceId: 'bluewallet', type: 'toolkit', time: '45 min' },
      { resourceId: 'trezor-safe-3', type: 'toolkit', time: '1 hr' },
      { resourceId: 'sparrow-wallet', type: 'toolkit', time: '2 hrs' },
      { resourceId: 'nunchuk', type: 'toolkit', time: '2 hrs' },
    ],
  },
  {
    id: 'rh-philosophy',
    emoji: '📜',
    title: 'The Reflection Path',
    subtitle: 'Claims, objections, and institutional meaning',
    desc: 'Separate protocol facts from claims about freedom, human rights, institutions, and the future. Read sympathetic arguments beside the strongest objections and keep the unresolved parts visible.',
    difficulty: 'Intermediate',
    totalTime: '~12 hours',
    prerequisite: 'Know the basic monetary and technical case. This path examines implications rather than mechanics.',
    outcome: 'You can distinguish protocol facts from philosophical claims and articulate where sovereignty arguments remain contestable.',
    nextHref: '/notes',
    nextLabel: 'Read one early judgment preserved without hindsight',
    steps: [
      { resourceId: 'the-internet-of-money', type: 'library', time: '4 hrs' },
      { resourceId: 'check-your-financial-privilege', type: 'library', time: '3 hrs' },
      { title: 'Honest Objections', type: 'internal', href: '/objections', time: '30 min' },
      { resourceId: 'the-sovereign-individual', type: 'library', time: '8 hrs' },
      { title: 'The 2011 Note', type: 'internal', href: '/notes', time: '10 min' },
    ],
  },
];
