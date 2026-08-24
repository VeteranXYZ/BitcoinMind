export interface Debate {
  id: string;
  title: string;
  objection: string;
  getsRight: string;
  response: string;
  reviewedAt: string;
  sources: { label: string; href: string; perspective: 'critical' | 'technical' | 'context' }[];
  further?: { label: string; href: string }[];
}

export const DEBATES: Debate[] = [
  {
    id: 'd-energy', title: 'Energy Consumption',
    objection: 'Bitcoin consumes more electricity than many countries. In a world facing a climate crisis, a financial network that requires this much energy is irresponsible. The same transactions could be processed with a fraction of the energy using proof-of-stake or traditional banking infrastructure.',
    getsRight: 'Bitcoin does use a large amount of electricity, and that cost should not be waved away. Any serious defense of proof of work has to explain why the security gained is worth the energy spent.',
    response: 'Bitcoin\'s energy use is part of its security model. Proof of work makes attacks expensive by tying block production to a real-world cost. The central question is not whether Bitcoin uses energy, but whether a neutral monetary network with no central issuer is a valuable use of energy. Mining also has a more complex energy profile than a simple country-level comparison suggests: miners often seek low-cost, stranded, curtailed, or otherwise underused power. That does not make every mining operation good, but it makes the evaluation more specific than the headline number.',
    reviewedAt: '2026-07-12',
    sources: [
      { label: 'Cambridge Digital Mining Industry Report', href: 'https://www.jbs.cam.ac.uk/wp-content/uploads/2025/04/2025-04-cambridge-digital-mining-industry-report.pdf', perspective: 'context' },
      { label: 'Cambridge Bitcoin electricity methodology', href: 'https://www.jbs.cam.ac.uk/2023/bitcoin-electricity-consumption/', perspective: 'technical' },
    ],
    further: [
      { label: 'Gradually, Then Suddenly', href: '/texts#gradually-then-suddenly' },
    ],
  },
  {
    id: 'd-volatility', title: 'Volatility',
    objection: 'Bitcoin\'s price swings are too extreme for it to function as money. No rational person would use something that can lose 30% of its value in a week as a medium of exchange or a unit of account. Stability is a prerequisite for a monetary asset.',
    getsRight: 'Volatility matters. A unit that changes price dramatically is difficult to use for salaries, invoices, accounting, or short-term savings.',
    response: 'Bitcoin is still monetizing, so its market price reflects both long-term adoption and short-term speculation. That makes it a poor unit of account today for most people. The stronger claim is narrower: Bitcoin can first develop as a store of value and settlement asset before it becomes a more stable medium of exchange. Whether that happens depends on liquidity, adoption, market depth, and time.',
    reviewedAt: '2026-07-12',
    sources: [
      { label: 'BIS statement on crypto-asset volatility', href: 'https://www.bis.org/publ/bcbs_nl21.htm', perspective: 'critical' },
      { label: 'BIS: Crypto shocks and retail losses', href: 'https://www.bis.org/publ/bisbull69.htm', perspective: 'critical' },
    ],
    further: [
      { label: 'The Bullish Case for Bitcoin', href: '/texts#the-bullish-case-for-bitcoin' },
    ],
  },
  {
    id: 'd-quantum', title: 'Quantum Computing',
    objection: 'Quantum computers will eventually break the elliptic curve cryptography that secures Bitcoin. When that happens, anyone with a quantum computer could steal coins from any address. The entire system would collapse.',
    getsRight: 'Quantum risk is a real cryptographic concern, not a fantasy. Bitcoin depends on signature schemes that would need attention if large, fault-tolerant quantum computers became practical.',
    response: 'The timeline and scope are the important details. Current quantum computers are not close to breaking Bitcoin keys at scale. Bitcoin can also upgrade cryptographic assumptions through broad consensus if the threat becomes concrete. That transition would be difficult, but not conceptually impossible. The same class of quantum breakthrough would affect banking, military systems, certificates, and much of the internet, so Bitcoin would not be uniquely exposed.',
    reviewedAt: '2026-07-12',
    sources: [
      { label: 'NIST Post-Quantum Cryptography program', href: 'https://csrc.nist.gov/projects/post-quantum-cryptography/', perspective: 'technical' },
      { label: 'Bitcoin Optech: Quantum resistance', href: 'https://bitcoinops.org/en/topics/quantum-resistance/', perspective: 'technical' },
    ],
  },
  {
    id: 'd-government', title: 'Government Bans',
    objection: 'Governments can ban Bitcoin. China did it. If the United States or the European Union followed, it would effectively kill adoption. States have the monopoly on violence and the power to make Bitcoin illegal to hold, transact, or mine.',
    getsRight: 'States can make Bitcoin harder to use. They can regulate exchanges, pressure custodians, restrict mining, tax transactions, and punish people under their jurisdiction.',
    response: 'A ban can damage access, liquidity, and user safety in a specific country. It does not automatically stop the global protocol. Bitcoin is a distributed network, and past restrictions have tended to move mining, liquidity, and users rather than erase them. The practical question is jurisdictional: how much friction can a state impose, and how much demand remains when that friction rises?',
    reviewedAt: '2026-07-12',
    sources: [
      { label: 'Library of Congress: Regulation of Cryptocurrency Around the World', href: 'https://tile.loc.gov/storage-services/service/ll/llglrd/2018298387/2018298387.pdf', perspective: 'context' },
      { label: 'Cambridge digital mining tools and geographic data', href: 'https://ccaf.io/', perspective: 'context' },
    ],
  },
  {
    id: 'd-altcoins', title: 'Better Technology',
    objection: 'Bitcoin is slow, expensive, and technologically outdated. Newer cryptocurrencies offer faster transactions, lower fees, smart contracts, and more features. Eventually, one of them will replace Bitcoin the way smartphones replaced flip phones.',
    getsRight: 'Bitcoin is intentionally limited at the base layer. Many newer systems offer more expressive features, faster confirmation targets, or different tradeoffs.',
    response: 'The question is whether those features improve the thing Bitcoin is trying to be. A monetary base layer optimizes for credible scarcity, verification, security, and resistance to capture. Many systems trade some of those properties for throughput, programmability, or governance flexibility. Those may be useful in other contexts, but they are not automatically improvements for a neutral monetary asset.',
    reviewedAt: '2026-07-12',
    sources: [
      { label: 'Bitcoin whitepaper', href: 'https://bitcoin.org/bitcoin.pdf', perspective: 'technical' },
      { label: 'Ethereum developer documentation', href: 'https://ethereum.org/developers/docs/', perspective: 'context' },
    ],
    further: [
      { label: 'Gradually, Then Suddenly', href: '/texts#gradually-then-suddenly' },
      { label: 'Bitcoin is Not Backed by Nothing', href: '/texts#bitcoin-is-not-backed-by-nothing' },
    ],
  },
  {
    id: 'd-backed', title: 'Backed by Nothing',
    objection: 'Bitcoin is not backed by anything. There is no government, no army, no gold reserve behind it. It is just code and consensus — digital nothingness. At least the dollar is backed by the full faith and credit of the United States.',
    getsRight: 'Bitcoin has no issuer, no redemption claim, and no cash flow. It is not backed in the same way a bond, bank deposit, or commodity warehouse receipt is backed.',
    response: 'Bitcoin\'s claim is different: it is valuable if people value a scarce, portable, verifiable monetary asset that no issuer can inflate. Its support comes from the network of users, miners, developers, exchanges, merchants, and node operators who continue to recognize and enforce the same rules. That is not the same as government backing. It is a different model of monetary credibility.',
    reviewedAt: '2026-07-12',
    sources: [
      { label: 'Federal Reserve: Money in the digital age', href: 'https://www.federalreserve.gov/econres/notes/feds-notes/a-lawyers-perspective-on-us-payment-system-evolution-and-money-in-the-digital-age-20220204.html', perspective: 'context' },
      { label: 'BIS: The crypto ecosystem — key elements and risks', href: 'https://www.bis.org/publ/othp72.htm', perspective: 'critical' },
    ],
    further: [
      { label: 'Bitcoin is Not Backed by Nothing', href: '/texts#bitcoin-is-not-backed-by-nothing' },
      { label: 'After the Anchor', href: '/frames/2' },
    ],
  },
  {
    id: 'd-scale', title: 'Scale and Transaction Fees',
    objection: 'Bitcoin’s base layer processes too few transactions for a global payment system, while fees can become expensive when block space is scarce. A network that cannot cheaply settle everyone’s everyday payments cannot be serious money.',
    getsRight: 'Bitcoin deliberately limits base-layer capacity, and fee spikes can price out small or urgent transactions. Payment layers introduce additional liquidity, availability, routing, and custody tradeoffs rather than making scarcity disappear.',
    response: 'The narrower Bitcoin claim is that a globally replicated base layer should optimize for verifiability and final settlement, while higher-volume payments can use channels, batching, or custodial services with different trust models. Whether that layered design serves enough people without recreating concentrated intermediaries is an empirical and institutional question. “More transactions” is not free, but neither is limited access to block space.',
    reviewedAt: '2026-07-12',
    sources: [
      { label: 'Bitcoin developer guide: block chain', href: 'https://developer.bitcoin.org/devguide/block_chain.html', perspective: 'technical' },
      { label: 'Lightning Network paper', href: 'https://lightning.network/lightning-network-paper.pdf', perspective: 'technical' },
    ],
  },
  {
    id: 'd-custody', title: 'Irreversible Loss and Consumer Protection',
    objection: 'Bitcoin shifts key management onto ordinary people. Keys can be lost, backups stolen, payments misdirected, and fraud irreversible. Traditional finance provides account recovery, dispute resolution, and consumer protection for good reasons.',
    getsRight: 'Final settlement removes some forms of institutional discretion but also removes familiar recovery mechanisms. Self-custody can be dangerous when confidence exceeds competence, and custodial alternatives reintroduce counterparty risk.',
    response: 'Bitcoin does not abolish the need for institutions; it makes custody and verification choices more explicit. Individuals can self-custody, share control through multisignature policies, or use regulated custodians. Each option moves risk rather than eliminating it. The useful standard is not ideological purity but whether the holder understands the failure modes, can recover, and has chosen an appropriate trust boundary.',
    reviewedAt: '2026-07-12',
    sources: [
      { label: 'Bitcoin.org: Securing your wallet', href: 'https://bitcoin.org/en/secure-your-wallet', perspective: 'technical' },
      { label: 'BIS: Crypto ecosystem risks', href: 'https://www.bis.org/publ/othp72.htm', perspective: 'critical' },
    ],
    further: [
      { label: 'The Custody Path', href: '/paths#rh-custody' },
      { label: 'Is self-custody always more sovereign?', href: '/questions#q-07' },
    ],
  },
  {
    id: 'd-governance', title: 'Governance and Concentration',
    objection: 'Bitcoin is described as decentralized, yet mining pools, core developers, exchanges, custodians, and wealthy holders are concentrated. Informal power still exists; it is simply less accountable and harder to see.',
    getsRight: 'Bitcoin has real centers of influence. Decentralization is not a binary property, and protocol rules do not prevent market concentration, persuasive authority, infrastructure dependencies, or political pressure.',
    response: 'Bitcoin separates powers that other monetary systems often combine. Developers propose software, miners order valid transactions, nodes enforce chosen rules, and markets assign value; none has complete control. That separation can make capture harder, but it does not guarantee fair representation or permanent decentralization. The right practice is to track concentration by function and ask what exit options remain when one group overreaches.',
    reviewedAt: '2026-07-12',
    sources: [
      { label: 'Bitcoin Core development process', href: 'https://bitcoincore.org/en/contribute/', perspective: 'technical' },
      { label: 'Cambridge digital mining research', href: 'https://ccaf.io/cbnsi/cbeci', perspective: 'context' },
    ],
    further: [
      { label: 'The Blocksize War', href: '/library#the-blocksize-war' },
    ],
  },
];
