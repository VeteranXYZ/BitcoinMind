export interface RabbitHoleStep {
  title: string;
  author?: string;
  type: 'library' | 'text' | 'toolkit' | 'frame' | 'external';
  href: string;
  time?: string;
}

export interface RabbitHole {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  desc: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  totalTime: string;
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
    steps: [
      { title: 'A History of Hardness', type: 'frame', href: '/frames/1', time: '15 min' },
      { title: 'The Bitcoin Standard (Part 1)', author: 'Saifedean Ammous', type: 'library', href: '/library', time: '3 hrs' },
      { title: 'Shelling Out: The Origins of Money', author: 'Nick Szabo', type: 'text', href: '/texts', time: '40 min' },
      { title: 'The Bullish Case for Bitcoin', author: 'Vijay Boyapati', type: 'text', href: '/texts', time: '45 min' },
      { title: 'The Sovereign Individual', author: 'Davidson & Rees-Mogg', type: 'library', href: '/library', time: '8 hrs' },
    ],
  },
  {
    id: 'rh-technical',
    emoji: '🔧',
    title: 'The Technical Path',
    subtitle: 'How Bitcoin actually works',
    desc: 'Go beyond the surface. Understand UTXOs, proof of work, the consensus mechanism, and the code that runs the network. Not for programmers only — for anyone who refuses to take someone else\'s word for it.',
    difficulty: 'Advanced',
    totalTime: '~18 hours',
    steps: [
      { title: 'Bitcoin: A Peer-to-Peer Electronic Cash System', author: 'Satoshi Nakamoto', type: 'text', href: '/texts', time: '20 min' },
      { title: 'Inventing Bitcoin', author: 'Yan Pritzker', type: 'library', href: '/library', time: '2 hrs' },
      { title: 'Grokking Bitcoin', author: 'Kalle Rosenbaum', type: 'library', href: '/library', time: '5 hrs' },
      { title: 'Mastering Bitcoin (Ch. 1-6)', author: 'Andreas Antonopoulos', type: 'library', href: '/library', time: '6 hrs' },
      { title: 'Bitcoin is Time', author: 'Gigi', type: 'text', href: '/texts', time: '35 min' },
      { title: 'Install and run Bitcoin Core', type: 'toolkit', href: '/toolkit', time: '2 hrs' },
      { title: 'Explore your node with Mempool.space', type: 'toolkit', href: '/toolkit', time: '1 hr' },
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
    steps: [
      { title: 'Why self-custody matters', type: 'external', href: 'https://unchained.com/blog/bitcoin-self-custody/', time: '15 min' },
      { title: 'BlueWallet — Mobile wallet basics', type: 'toolkit', href: '/toolkit', time: '45 min' },
      { title: 'Trezor Safe 3 — First hardware wallet', type: 'toolkit', href: '/toolkit', time: '1 hr' },
      { title: 'Sparrow Wallet — Full UTXO control', type: 'toolkit', href: '/toolkit', time: '2 hrs' },
      { title: 'Coldcard MK4 — Air-gapped signing', type: 'toolkit', href: '/toolkit', time: '2 hrs' },
      { title: 'Nunchuk — Multisig and inheritance', type: 'toolkit', href: '/toolkit', time: '2 hrs' },
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
    steps: [
      { title: 'The Internet of Money', author: 'Andreas Antonopoulos', type: 'library', href: '/library', time: '4 hrs' },
      { title: '21 Lessons', author: 'Gigi', type: 'library', href: '/library', time: '3 hrs' },
      { title: 'Bitcoin is Time', author: 'Gigi', type: 'text', href: '/texts', time: '35 min' },
      { title: 'The Sovereign Individual', author: 'Davidson & Rees-Mogg', type: 'library', href: '/library', time: '8 hrs' },
      { title: 'Check Your Financial Privilege', author: 'Alex Gladstein', type: 'library', href: '/library', time: '3 hrs' },
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
    steps: [
      { title: 'The Bullish Case for Bitcoin', author: 'Vijay Boyapati', type: 'text', href: '/texts', time: '45 min' },
      { title: 'Gradually, Then Suddenly', author: 'Parker Lewis', type: 'text', href: '/texts', time: '4 hrs' },
      { title: 'After the Anchor', type: 'frame', href: '/frames/2', time: '20 min' },
      { title: 'Speculative Attack', author: 'Pierre Rochard', type: 'text', href: '/texts', time: '25 min' },
      { title: 'LookIntoBitcoin — Cycle analysis', type: 'toolkit', href: '/toolkit', time: '1 hr' },
    ],
  },
];
