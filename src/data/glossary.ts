export interface GlossaryEntry {
  id: string;
  term: string;
  /** Chinese translation */
  zh?: string;
  body: string;
  category: 'monetary' | 'technical' | 'philosophical';
  links?: { label: string; href: string }[];
}

export const GLOSSARY: GlossaryEntry[] = [
  {
    id: 'g-hardness', term: 'Hardness', zh: '硬度',
    category: 'monetary',
    body: 'The difficulty of producing new units of a monetary good. Gold is hard because mining more of it is expensive and slow. Fiat is soft because a central bank can create it at zero marginal cost. Bitcoin is the hardest money ever created — the supply schedule is fixed by code and enforced by consensus. After all 21 million coins are mined, no more can ever exist. Hardness is not a feature. It is the feature.',
    links: [{ label: 'Frame: A History of Hardness', href: '/frames/1' }],
  },
  {
    id: 'g-halving', term: 'Halving', zh: '减半',
    category: 'monetary',
    body: 'Every 210,000 blocks — roughly four years — the block reward is cut in half. The first reward was 50 BTC. Today it is 3.125. This is not a policy decision that can be reversed. It is code that executes. The halving is a forced reset of time preference: it makes Bitcoin scarcer on a schedule that no entity can alter. Central banks adjust interest rates. Bitcoin adjusts supply. The difference is that one requires trust and the other does not.',
    links: [{ label: 'The Bitcoin Standard', href: '/books' }],
  },
  {
    id: 'g-sound-money', term: 'Sound Money', zh: '健全货币',
    category: 'monetary',
    body: 'Money whose supply cannot be easily manipulated by any single entity — government, bank, or individual. The term comes from the metallic ring of a genuine gold coin versus a counterfeit. Sound money holds its value over time because producing more of it is costly. Bitcoin is the digital incarnation of this principle: the supply cap is absolute, the rules are transparent, and no one can print more.',
    links: [{ label: 'The Bitcoin Standard', href: '/books' }],
  },
  {
    id: 'g-stock-to-flow', term: 'Stock-to-Flow', zh: '存量-流量比',
    category: 'monetary',
    body: 'The ratio of existing supply (stock) to new annual production (flow). Gold has a stock-to-flow of roughly 60 — it would take 60 years of current mining to double the supply. After the 2024 halving, Bitcoin\'s stock-to-flow exceeds 100. A higher ratio means greater scarcity. Stock-to-flow is not a price model. It is a scarcity metric. The price follows scarcity over time, not the other way around.',
  },
  {
    id: 'g-utxo', term: 'UTXO',
    category: 'technical',
    body: 'Unspent Transaction Output. Bitcoin has no "account balance" — only a set of unspent coins from previous transactions. When you "spend" Bitcoin, you consume one or more UTXOs and create new ones. This design is fundamental: it enables parallel validation, prevents double-spending without a central ledger, and gives users granular control over their coins. Understanding UTXOs is understanding how Bitcoin actually works beneath the surface.',
    links: [{ label: 'Mastering Bitcoin', href: '/books' }],
  },
  {
    id: 'g-node', term: 'Full Node', zh: '全节点',
    category: 'technical',
    body: 'A computer running Bitcoin Core (or compatible software) that independently validates every transaction and every block against the consensus rules. Running a node means you verify your own truth — you don\'t trust anyone else\'s version of the ledger. Every full node is a vote for the rules. The more nodes, the harder it is for anyone to change Bitcoin. This is decentralization in practice, not theory.',
    links: [{ label: 'Bitcoin Core', href: '/tools' }],
  },
  {
    id: 'g-mempool', term: 'Mempool',
    category: 'technical',
    body: 'The waiting room. When you broadcast a Bitcoin transaction, it enters the mempool — a holding area of unconfirmed transactions that miners choose from when assembling the next block. Higher-fee transactions get picked first. The mempool is a real-time market for block space: you are bidding for inclusion in the next page of an immutable ledger.',
    links: [{ label: 'Mempool.space', href: '/tools' }],
  },
  {
    id: 'g-hash-rate', term: 'Hash Rate', zh: '哈希率',
    category: 'technical',
    body: 'The total computational power securing the Bitcoin network, measured in hashes per second. A higher hash rate means more energy is being spent to find the next block — and more energy means more security. The hash rate is a proxy for Bitcoin\'s thermodynamic shield: the cost of attacking the network grows with the energy protecting it. As of 2026, the Bitcoin network consumes more energy than some countries. That is not a bug.',
  },
  {
    id: 'g-difficulty', term: 'Difficulty Adjustment', zh: '难度调整',
    category: 'technical',
    body: 'Every 2,016 blocks (roughly two weeks), Bitcoin recalibrates the mining difficulty so that blocks continue to arrive approximately every ten minutes — regardless of how much hash power joins or leaves the network. This self-regulating mechanism is one of Satoshi\'s most elegant innovations. No committee. No meeting. No vote. The protocol adapts.',
  },
  {
    id: 'g-sovereignty', term: 'Sovereignty', zh: '主权',
    category: 'philosophical',
    body: 'The capacity to act without requiring permission from an intermediary. In the context of Bitcoin: the ability to hold, send, and receive value without any third party\'s approval. Self-custody is sovereignty in practice — your keys, your coins, your rules. The Sovereign Individual predicted that cryptography would transfer power from states to individuals. Bitcoin is that transfer in motion.',
    links: [
      { label: 'The Sovereign Individual', href: '/books' },
      { label: 'Coldcard MK4', href: '/tools' },
    ],
  },
  {
    id: 'g-time-pref', term: 'Time Preference', zh: '时间偏好',
    category: 'philosophical',
    body: 'The degree to which an individual values present consumption over future consumption. Low time preference means you are willing to delay gratification — to save, to invest, to build. Sound money encourages low time preference because your savings hold value over time. Inflationary money punishes savers and rewards borrowers, driving time preference higher. Bitcoin is designed to push time preference lower, one halving at a time.',
    links: [{ label: 'The Bitcoin Standard', href: '/books' }],
  },
  {
    id: 'g-timechain', term: 'Timechain',
    category: 'philosophical',
    body: 'Satoshi\'s original name for what the world now calls "blockchain." The word matters. A blockchain is a technical structure — blocks linked by hashes. A timechain is a philosophical one — an unforgeable record of the order in which events occurred. Bitcoin doesn\'t just store transactions. It orders them in time. And because no one controls the clock, no one can rewrite history.',
    links: [{ label: 'Bitcoin is Time by Gigi', href: '/essays' }],
  },
  {
    id: 'g-proof-of-work', term: 'Proof of Work', zh: '工作量证明',
    category: 'technical',
    body: 'The mechanism by which miners expend real-world energy to earn the right to propose the next block. Proof of work is not wasteful — it is the conversion of energy into security. Without it, there is no objective way to determine which version of the ledger is correct. Proof of stake asks "who has the most coins?" Proof of work asks "who spent the most energy?" One is a plutocracy. The other is physics.',
  },
  {
    id: 'g-trustless', term: 'Trustless', zh: '无需信任',
    category: 'philosophical',
    body: 'A system that does not require participants to trust each other or any third party. In Bitcoin, "trustless" does not mean "no trust exists." It means trust is replaced by verification. You don\'t trust the miner — you verify the block. You don\'t trust the sender — you verify the signature. You don\'t trust the network — you run a node. Trust is a vulnerability. Verification is a guarantee.',
    links: [{ label: 'The whitepaper', href: '/essays' }],
  },
  {
    id: 'g-21m', term: 'Twenty-One Million',
    category: 'monetary',
    body: 'The hard cap. There will never be more than 21,000,000 bitcoin. This number is not a suggestion, a target, or a policy. It is enforced by every node on the network. To change it would require convincing a majority of node operators to voluntarily debase their own holdings. This is the monetary policy that cannot be lobbied, bribed, or inflated away. It is, in the strictest sense, incorruptible.',
  },
];
