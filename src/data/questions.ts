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
    question: 'If Bitcoin succeeds, does the power grid become the new power structure?',
    date: 'May 2026',
    answer: 'This is the right question asked slightly wrong. If Bitcoin succeeds, energy production becomes more decentralized, not more centralized. Bitcoin miners are energy buyers of last resort — they seek the cheapest energy, which is almost always stranded, curtailed, or otherwise wasted. A methane flare in Texas. A hydroelectric dam in Paraguay producing more than the grid can absorb. Geothermal in Iceland. Bitcoin doesn\'t concentrate energy — it monetizes energy that would otherwise be lost. The power grid doesn\'t become the power structure. Bitcoin makes more of the power grid economically viable.',
    links: [
      { label: 'Debates: Energy Consumption', href: '/debates' },
    ],
  },
  {
    id: 'q-02',
    question: 'I have $500. Is it too late to buy Bitcoin?',
    date: 'May 2026',
    answer: 'This question contains an assumption: that Bitcoin is an investment you "get in" on. That framing is wrong. Bitcoin is a savings technology. You don\'t "get in" — you start saving in a harder currency. And the answer to "is it too late to start saving in hard money?" is always no. $500 in Bitcoin is not about the price going up next month. It is about opting out of a system that debases your purchasing power by design. The best time to start was 2009. The second best time is whenever you understand why.',
    links: [
      { label: 'Start Here', href: '/start' },
    ],
  },
  {
    id: 'q-03',
    question: 'How do I explain Bitcoin to my parents?',
    date: 'May 2026',
    answer: 'Don\'t start with technology. Start with money. Ask them: "When you were young, how much did a house cost? How much does it cost now?" That gap is not because houses got better. It is because the money got worse. The dollar buys less every year because the government prints more of it. Bitcoin is money that no one can print more of. There will only ever be 21 million. That\'s it. That\'s the whole pitch. If they want more, give them The Internet of Money by Andreas Antonopoulos — it was written for exactly this conversation.',
    links: [
      { label: 'The Internet of Money', href: '/books' },
      { label: 'Start Here', href: '/start' },
    ],
  },
  {
    id: 'q-04',
    question: 'What happens when all 21 million Bitcoin are mined?',
    date: 'May 2026',
    answer: 'The last Bitcoin will be mined around the year 2140. After that, miners will be compensated entirely by transaction fees. This is by design — the transition from block rewards to fees is gradual, happening over more than a century. The concern that "miners will quit" assumes fees won\'t be sufficient. But if Bitcoin succeeds as a global settlement layer, block space will be valuable enough that fees alone provide strong security incentives. Bitcoin\'s security budget is a function of demand for block space, not block rewards.',
    links: [
      { label: 'Glossary: Halving', href: '/glossary' },
    ],
  },
  {
    id: 'q-05',
    question: 'Why doesn\'t Bitcoin have smart contracts like Ethereum?',
    date: 'May 2026',
    answer: 'Bitcoin does have a scripting language — it is intentionally limited. This is not a weakness. It is a design choice. Bitcoin optimizes for one thing: being the most secure, most decentralized, most reliable monetary network in existence. Every feature you add is an attack surface you create. Ethereum chose expressiveness. Bitcoin chose security. You can build complex financial instruments on layers above Bitcoin (Lightning, sidechains) without compromising the base layer. The foundation of a skyscraper does not need to be flexible. It needs to be unbreakable.',
  },
];
