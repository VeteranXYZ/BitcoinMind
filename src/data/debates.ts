export interface Debate {
  id: string;
  title: string;
  objection: string;
  response: string;
  further?: { label: string; href: string }[];
}

export const DEBATES: Debate[] = [
  {
    id: 'd-energy', title: 'Energy Consumption',
    objection: 'Bitcoin consumes more electricity than many countries. In a world facing a climate crisis, a financial network that requires this much energy is irresponsible. The same transactions could be processed with a fraction of the energy using proof-of-stake or traditional banking infrastructure.',
    response: 'Bitcoin\'s energy consumption is not a byproduct — it is the security model. Proof of work converts energy into an unforgeable wall of computational cost that protects the network from attack. No energy, no security. The question is not "does Bitcoin use energy?" but "is this use of energy valuable?" Bitcoin miners increasingly seek stranded, curtailed, and renewable energy sources that would otherwise be wasted. More importantly: comparing Bitcoin\'s energy to Visa ignores that Visa relies on the entire apparatus of the banking system — buildings, servers, compliance departments, militaries that enforce the dollar — none of which appears in Visa\'s energy budget.',
    further: [
      { label: 'Gradually, Then Suddenly', href: '/texts' },
    ],
  },
  {
    id: 'd-volatility', title: 'Volatility',
    objection: 'Bitcoin\'s price swings are too extreme for it to function as money. No rational person would use something that can lose 30% of its value in a week as a medium of exchange or a unit of account. Stability is a prerequisite for a monetary asset.',
    response: 'Volatility is the cost of monetization. Every new monetary asset in history — gold, silver, government bonds — went through violent price discovery before stabilizing. Bitcoin is simultaneously being adopted as a store of value by individuals, corporations, and nation-states, while being traded speculatively by millions. This produces volatility. The question is not whether Bitcoin is volatile today, but whether its volatility is decreasing over time as adoption grows — and the data says yes. Each cycle, the drawdowns get smaller and the recoveries faster.',
    further: [
      { label: 'The Bullish Case for Bitcoin', href: '/texts' },
    ],
  },
  {
    id: 'd-quantum', title: 'Quantum Computing',
    objection: 'Quantum computers will eventually break the elliptic curve cryptography that secures Bitcoin. When that happens, anyone with a quantum computer could steal coins from any address. The entire system would collapse.',
    response: 'This threat is real but misunderstood in both timeline and severity. Current quantum computers are nowhere near the scale needed to break Bitcoin\'s cryptography — estimates range from decades to never, depending on which physicist you ask. More importantly, Bitcoin\'s cryptographic algorithms can be upgraded. Post-quantum signature schemes already exist. The Bitcoin community has been discussing quantum-resistant upgrades for years. A quantum computer powerful enough to break ECDSA would also break every bank, every military communication system, and every SSL certificate on the internet. Bitcoin would be the least of our problems — and the most prepared.',
  },
  {
    id: 'd-government', title: 'Government Bans',
    objection: 'Governments can ban Bitcoin. China did it. If the United States or the European Union followed, it would effectively kill adoption. States have the monopoly on violence and the power to make Bitcoin illegal to hold, transact, or mine.',
    response: 'China banned Bitcoin. Bitcoin didn\'t notice. The hash rate recovered within months. The network kept producing blocks every ten minutes. Governments can make Bitcoin inconvenient to use — they can ban exchanges, make mining illegal, impose capital controls. What they cannot do is stop the protocol. Bitcoin is information. Banning it is as effective as banning an idea. The more governments that try, the more they prove the thesis: that an asset outside state control is necessary precisely because states want to control it.',
  },
  {
    id: 'd-altcoins', title: 'Better Technology',
    objection: 'Bitcoin is slow, expensive, and technologically outdated. Newer cryptocurrencies offer faster transactions, lower fees, smart contracts, and more features. Eventually, one of them will replace Bitcoin the way smartphones replaced flip phones.',
    response: 'This argument confuses technology with money. Money is not a product — it is a network. The value of a monetary network comes from its security, its decentralization, and its credibility as a store of value. Bitcoin is the most secure, most decentralized, most battle-tested cryptocurrency in existence. It has survived every attack, every fork, every competitor. "Better technology" has been the claim of every altcoin since 2011. None of them have captured Bitcoin\'s network effect, because network effects compound and monetary premiums are winner-take-most.',
    further: [
      { label: 'Gradually, Then Suddenly', href: '/texts' },
      { label: 'Bitcoin is Not Backed by Nothing', href: '/texts' },
    ],
  },
  {
    id: 'd-backed', title: 'Backed by Nothing',
    objection: 'Bitcoin is not backed by anything. There is no government, no army, no gold reserve behind it. It is just code and consensus — digital nothingness. At least the dollar is backed by the full faith and credit of the United States.',
    response: 'The dollar is backed by the promise of a government that has debased its currency by over 96% since 1913. "Full faith and credit" is a euphemism for "trust us." Bitcoin is backed by mathematics, energy, and the consensus of tens of thousands of independent nodes. Its supply cannot be inflated. Its rules cannot be changed by executive order. The question is not what backs Bitcoin — it is what backs the dollar, and whether a promise from a debtor is really more reliable than a protocol that cannot lie.',
    further: [
      { label: 'Bitcoin is Not Backed by Nothing', href: '/texts' },
      { label: 'After the Anchor', href: '/frames/2' },
    ],
  },
];
