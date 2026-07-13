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
    body: 'The difficulty of increasing the supply of a monetary good. Gold is relatively hard because additional production requires time and capital. Fiat supply is policy-dependent. Bitcoin follows an issuance schedule enforced by validating nodes; under the current consensus rules, issuance declines toward a limit of 21 million bitcoin.',
    links: [{ label: 'Frame: A History of Hardness', href: '/frames/1' }],
  },
  {
    id: 'g-halving', term: 'Halving',
    category: 'monetary',
    body: 'Every 210,000 blocks, roughly four years, Bitcoin’s block subsidy is cut in half. It began at 50 BTC and is currently 3.125 BTC. The schedule is a consensus rule, not a recurring policy meeting. Changing it would require participants to adopt different software rules.',
    links: [{ label: 'The Bitcoin Standard', href: '/library' }],
  },
  {
    id: 'g-sound-money', term: 'Sound Money',
    category: 'monetary',
    body: 'A normative term for money expected to preserve its monetary properties because issuance is constrained and the rules are credible. Advocates apply it to Bitcoin because its supply schedule is transparent and difficult to change. That does not guarantee stable purchasing power, universal acceptance, or political permanence.',
    links: [{ label: 'The Bitcoin Standard', href: '/library' }],
  },
  {
    id: 'g-stock-to-flow', term: 'Stock-to-Flow',
    category: 'monetary',
    body: 'The ratio of existing supply to new annual production. A high ratio describes low new issuance relative to the outstanding stock. It can compare scarcity across monetary goods, but it does not measure demand and should not be treated as a reliable price model.',
  },
  {
    id: 'g-utxo', term: 'UTXO',
    category: 'technical',
    body: 'Unspent Transaction Output. Bitcoin has no "account balance" — only a set of unspent coins from previous transactions. When you "spend" Bitcoin, you consume one or more UTXOs and create new ones. This design is fundamental: it enables parallel validation, prevents double-spending without a central ledger, and gives users granular control over their coins. Understanding UTXOs is understanding how Bitcoin actually works beneath the surface.',
    links: [{ label: 'Mastering Bitcoin', href: '/library' }],
  },
  {
    id: 'g-private-key', term: 'Private Key',
    category: 'technical',
    body: 'Secret data used to authorize spending. A wallet manages keys and usually represents their backup as a seed phrase. Whoever can produce a valid signature with the relevant key can spend the associated UTXO; the network does not know whether that person is the intended owner. Key security and recoverability are therefore separate from protocol security.',
    links: [{ label: 'Custody tools', href: '/toolkit' }],
  },
  {
    id: 'g-signature', term: 'Digital Signature',
    category: 'technical',
    body: 'A cryptographic proof that a transaction was authorized by the holder of a required private key without revealing that key. Nodes verify signatures as part of transaction validation. A valid signature proves control of a key, not identity, consent, or freedom from coercion.',
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
    id: 'g-confirmation', term: 'Confirmation',
    category: 'technical',
    body: 'A transaction has one confirmation when it is included in a valid block. Each block built after it adds another. Confirmations do not make history mathematically irreversible; they make reorganizing that history progressively more costly and less likely under ordinary assumptions.',
    links: [{ label: 'Mempool.space', href: '/toolkit#mempool-space' }],
  },
  {
    id: 'g-fee-market', term: 'Fee Market',
    category: 'technical',
    body: 'The competition to have transactions included in limited block space. Users attach fees; miners generally select transactions by effective fee rate and policy. Fees are also expected to become a larger share of miner revenue as the block subsidy declines, making long-term demand for block space an important open question.',
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
    id: 'g-consensus', term: 'Consensus Rules',
    category: 'technical',
    body: 'The validity rules independently applied by Bitcoin nodes: transaction authorization, block structure, issuance, proof of work, and more. Consensus does not mean everyone agrees about policy or software. It means nodes that apply compatible rules can recognize the same valid chain.',
    links: [{ label: 'The Blocksize War', href: '/library#the-blocksize-war' }],
  },
  {
    id: 'g-lightning', term: 'Lightning Network',
    category: 'technical',
    body: 'A payment-channel network built on Bitcoin. Participants can update balances off-chain and later settle to the base layer, enabling faster and smaller payments. Lightning improves payment capacity but adds liquidity, routing, availability, backup, and implementation tradeoffs.',
  },
  {
    id: 'g-multisig', term: 'Multisignature',
    category: 'technical',
    body: 'A spending policy that requires multiple keys—for example, two of three—to authorize a transaction. Multisignature can reduce reliance on one device or person, but it creates coordination, backup, privacy, and inheritance responsibilities. More keys do not automatically mean more security.',
    links: [{ label: 'Custody instruments', href: '/toolkit' }],
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
    id: 'g-censorship-resistance', term: 'Censorship Resistance',
    category: 'philosophical',
    body: 'The degree to which a valid transaction can eventually be broadcast, included, and settled despite attempts to block it. Bitcoin can raise the cost of censorship because mining and relay are distributed, but users still face network access, surveillance, legal, liquidity, and custody constraints.',
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
    body: 'A term used in early Bitcoin code and later popularized to emphasize ordering through proof of work. “Blockchain” names the linked data structure; “timechain” is an interpretive label for how Bitcoin establishes a costly ordering of transactions without a central clock.',
    links: [{ label: 'Bitcoin is Time by Gigi', href: '/texts' }],
  },
  {
    id: 'g-proof-of-work', term: 'Proof of Work',
    category: 'technical',
    body: 'The mechanism that requires miners to perform computational work when proposing blocks. Nodes accept the valid chain with the most accumulated work. Proof of work ties chain construction to energy and specialized hardware; this makes attacks costly but also creates environmental, geographic, and industrial concentration questions.',
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
    body: 'Bitcoin’s approximate supply limit under the current consensus rules. Validating nodes reject blocks that create more subsidy than the schedule permits. Software with a different limit can be written, but changing the economically recognized network would require broad adoption of those new rules and could produce a chain split.',
    links: [{ label: 'Can the limit change?', href: '/questions#q-06' }],
  },
];
