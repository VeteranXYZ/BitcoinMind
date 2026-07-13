export interface Question {
  id: string;
  question: string;
  answer: string;
  date: string;
  links?: { label: string; href: string }[];
}

export const QUESTIONS: Question[] = [
  {
    id: 'q-01',
    question: 'Does proof of work turn energy producers into Bitcoin’s new rulers?',
    date: 'July 2026',
    answer: 'Energy gives miners influence over which valid transactions enter blocks and how much work protects a chain. It does not let them create arbitrary coins or make an invalid block valid; independently validating nodes reject rule-breaking blocks. Mining can use curtailed or stranded power, but it also uses ordinary grid electricity, and its local effects depend on the generation mix, contracts, regulation, and competition for power. The sober conclusion is neither “energy controls Bitcoin” nor “the energy is free.” Proof of work deliberately purchases security with a real-world resource, so its concentration and external costs remain questions to measure.',
    links: [
      { label: 'Objections: Energy Consumption', href: '/objections' },
    ],
  },
  {
    id: 'q-02',
    question: 'Is it too late to buy Bitcoin?',
    date: 'July 2026',
    answer: 'No one can answer that from the price alone. The relevant questions are personal: what claim are you underwriting, what loss can you absorb, how long can you hold without needing the money, and can you custody it safely? Bitcoin has had deep drawdowns, regulatory shocks, software risks, and long periods when confidence was punished. Study before allocating; use no leverage; treat any purchase as a decision that can be wrong. A sound thesis states both why Bitcoin might matter and what evidence would weaken the case.',
    links: [
      { label: 'Primer', href: '/primer' },
    ],
  },
  {
    id: 'q-03',
    question: 'How do I explain Bitcoin to someone who is skeptical?',
    date: 'July 2026',
    answer: 'Start with the person’s actual concern, not a memorized pitch. If the concern is inflation, discuss monetary rules. If it is fraud, separate the Bitcoin network from exchanges and promoters. If it is energy, explain proof of work and acknowledge its cost. Then offer the smallest accurate claim: Bitcoin is a public settlement network whose users can hold and transfer a scarce digital asset without asking a central issuer to update the ledger. Everything beyond that—future adoption, price, political significance—is an argument, not a protocol fact.',
    links: [
      { label: 'The Internet of Money', href: '/library' },
      { label: 'Primer', href: '/primer' },
    ],
  },
  {
    id: 'q-04',
    question: 'What happens when all 21 million Bitcoin are mined?',
    date: 'July 2026',
    answer: 'The subsidy halves every 210,000 blocks and approaches zero around 2140; transaction fees then become miners’ direct revenue. The schedule is known, but the outcome is not. A durable fee market would require enough demand for scarce block space, while security also depends on Bitcoin’s value, mining economics, and attack incentives. The long transition gives the network time to adapt, but it does not prove that future fee revenue will be sufficient. This is one of Bitcoin’s real open economic questions.',
    links: [
      { label: 'Glossary: Halving', href: '/glossary' },
    ],
  },
  {
    id: 'q-05',
    question: 'Why doesn\'t Bitcoin have smart contracts like Ethereum?',
    date: 'July 2026',
    answer: 'Bitcoin transactions are programmable, but Bitcoin Script is deliberately constrained and the base layer changes cautiously. That reduces some classes of complexity while limiting what applications can express directly. Ethereum chose a more general execution environment and therefore a different set of capabilities, costs, and failure modes. Lightning, multisignature policies, timelocks, and other systems extend Bitcoin, but they introduce their own assumptions. “More expressive” and “more secure” are not single-axis rankings; they are design tradeoffs.',
    links: [
      { label: 'Mastering Bitcoin', href: '/library#mastering-bitcoin' },
    ],
  },
  {
    id: 'q-06',
    question: 'Can Bitcoin’s 21 million limit ever change?',
    date: 'July 2026',
    answer: 'The limit is a consensus rule enforced by software run voluntarily across the network. Developers can publish code with a different rule, but they cannot compel nodes, businesses, miners, and holders to adopt it. A changed-supply network could exist if enough participants coordinated around it; dissenting users could keep the old rules, creating a split. The cap is therefore neither a law of nature nor a promise from a company. Its credibility comes from transparent rules, costly coordination, and the interests of participants who chose Bitcoin partly because dilution is difficult.',
    links: [
      { label: 'The Blocksize War', href: '/library#the-blocksize-war' },
      { label: 'Glossary: Twenty-One Million', href: '/glossary#g-21m' },
    ],
  },
  {
    id: 'q-07',
    question: 'Is self-custody always more sovereign?',
    date: 'July 2026',
    answer: 'Self-custody removes a custodian’s ability to freeze, rehypothecate, or lose your coins, but it transfers key loss, theft, recovery, privacy, and inheritance risk to you. A technically elaborate setup can be less secure if the owner cannot operate or recover it. Sovereignty is not maximum complexity; it is control matched by competence. Begin with small amounts, test recovery, document the right information for the right people, and increase complexity only when it removes a specific failure mode.',
    links: [
      { label: 'Custody path', href: '/paths#rh-custody' },
      { label: 'Toolkit', href: '/toolkit' },
    ],
  },
];
