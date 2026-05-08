export interface GlossaryEntry {
  id: string;
  term: string;
  body: string;
  category: 'monetary' | 'technical' | 'philosophical';
  links?: { label: string; href: string }[];
}

export const GLOSSARY: GlossaryEntry[] = [
  {
    id: 'g-hardness', term: 'Hardness',
    category: 'monetary',
    body: 'The difficulty of producing new units of a monetary good. Gold is hard because mining more of it is expensive and slow. Fiat is soft because a central bank can create it at very low marginal cost. Bitcoin has a fixed supply schedule enforced by consensus. After all 21 million coins are mined, no more can exist under the current rules.',
    links: [{ label: 'Frame: A History of Hardness', href: '/frames/1' }],
  },
  {
    id: 'g-halving', term: 'Halving',
    category: 'monetary',
    body: 'Every 210,000 blocks, roughly four years, the block reward is cut in half. The first reward was 50 BTC. Today it is 3.125. This is not a discretionary policy decision; it is part of the protocol rules. The halving reduces new issuance on a schedule that no single entity can alter.',
    links: [{ label: 'The Bitcoin Standard', href: '/library' }],
  },
  {
    id: 'g-sound-money', term: 'Sound Money',
    category: 'monetary',
    body: 'Money whose supply cannot be easily manipulated by any single entity — government, bank, or individual. The term comes from the metallic ring of a genuine gold coin versus a counterfeit. Sound money holds its value over time because producing more of it is costly. Bitcoin is the digital incarnation of this principle: the supply cap is absolute, the rules are transparent, and no one can print more.',
    links: [{ label: 'The Bitcoin Standard', href: '/library' }],
  },
  {
    id: 'g-stock-to-flow', term: 'Stock-to-Flow',
    category: 'monetary',
    body: 'The ratio of existing supply (stock) to new annual production (flow). Gold has a stock-to-flow of roughly 60, meaning it would take about 60 years of current mining to double the supply. After the 2024 halving, Bitcoin\'s stock-to-flow exceeds 100. Stock-to-flow is a scarcity metric, not a reliable price model.',
  },
  {
    id: 'g-utxo', term: 'UTXO',
    category: 'technical',
    body: 'Unspent Transaction Output. Bitcoin has no "account balance" — only a set of unspent coins from previous transactions. When you "spend" Bitcoin, you consume one or more UTXOs and create new ones. This design is fundamental: it enables parallel validation, prevents double-spending without a central ledger, and gives users granular control over their coins. Understanding UTXOs is understanding how Bitcoin actually works beneath the surface.',
    links: [{ label: 'Mastering Bitcoin', href: '/library' }],
  },
  {
    id: 'g-node', term: 'Full Node',
    category: 'technical',
    body: 'A computer running Bitcoin Core or compatible software that independently validates every transaction and every block against the consensus rules. Running a node lets you directly verify the ledger instead of relying on someone else\'s copy. Full nodes do not vote by wealth; they enforce the rules their operators choose to run.',
    links: [{ label: 'Bitcoin Core', href: '/toolkit' }],
  },
  {
    id: 'g-mempool', term: 'Mempool',
    category: 'technical',
    body: 'The holding area for unconfirmed Bitcoin transactions. When you broadcast a transaction, it enters the mempool until a miner includes it in a block. Higher-fee transactions are usually prioritized. The mempool is a real-time market for limited block space.',
    links: [{ label: 'Mempool.space', href: '/toolkit' }],
  },
  {
    id: 'g-hash-rate', term: 'Hash Rate',
    category: 'technical',
    body: 'The total computational power securing the Bitcoin network, measured in hashes per second. A higher hash rate generally means more work is being performed to find blocks, which raises the cost of attacking the chain. Hash rate is one proxy for the economic cost of rewriting Bitcoin history.',
  },
  {
    id: 'g-difficulty', term: 'Difficulty Adjustment',
    category: 'technical',
    body: 'Every 2,016 blocks, roughly two weeks, Bitcoin recalibrates the mining difficulty so that blocks continue to arrive approximately every ten minutes regardless of how much hash power joins or leaves the network. This mechanism keeps issuance predictable without a committee setting the schedule.',
  },
  {
    id: 'g-sovereignty', term: 'Sovereignty',
    category: 'philosophical',
    body: 'The capacity to act without requiring permission from an intermediary. In the context of Bitcoin, it means the ability to hold, send, and receive value without a custodian approving each action. Self-custody can increase sovereignty, but it also increases personal responsibility.',
    links: [
      { label: 'The Sovereign Individual', href: '/library' },
      { label: 'Coldcard MK4', href: '/toolkit' },
    ],
  },
  {
    id: 'g-time-pref', term: 'Time Preference',
    category: 'philosophical',
    body: 'The degree to which an individual values present consumption over future consumption. Low time preference means greater willingness to delay gratification, save, and build. Many Bitcoin arguments claim that harder money can encourage lower time preference because savings are less easily diluted.',
    links: [{ label: 'The Bitcoin Standard', href: '/library' }],
  },
  {
    id: 'g-timechain', term: 'Timechain',
    category: 'philosophical',
    body: 'Satoshi\'s original name for what the world now calls "blockchain." A blockchain is a technical structure: blocks linked by hashes. Timechain emphasizes ordering: Bitcoin records transactions in a sequence that becomes increasingly expensive to reorganize as more proof of work accumulates.',
    links: [{ label: 'Bitcoin is Time by Gigi', href: '/texts' }],
  },
  {
    id: 'g-proof-of-work', term: 'Proof of Work',
    category: 'technical',
    body: 'The mechanism by which miners expend real-world energy to earn the right to propose the next block. Proof of work ties block production to an external cost, making attacks expensive in energy and hardware. Proof of stake relies on ownership of the native asset to choose validators. The two models have different security assumptions, tradeoffs, and failure modes.',
  },
  {
    id: 'g-trustless', term: 'Trustless',
    category: 'philosophical',
    body: 'A system that does not require participants to trust each other or a central third party for basic validity. In Bitcoin, "trustless" does not mean no trust exists anywhere. It means important claims can be checked: signatures, blocks, supply, and consensus rules can be independently verified.',
    links: [{ label: 'The whitepaper', href: '/texts' }],
  },
  {
    id: 'g-21m', term: 'Twenty-One Million',
    category: 'monetary',
    body: 'Bitcoin\'s supply cap. Under the current consensus rules, there will never be more than 21,000,000 bitcoin. The limit is enforced by validating nodes. Changing it would require broad voluntary adoption of different rules by users, node operators, miners, and economic actors.',
  },
];
