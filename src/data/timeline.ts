export interface TimelineEvent {
  id: string;
  year: number;
  month?: string;
  title: string;
  body: string;
  /** Optional Hiei personal annotation */
  hiei?: string;
  /** Cross-links to other sections */
  links?: { label: string; href: string }[];
  tags?: string[];
}

export const TIMELINE: TimelineEvent[] = [
  {
    id: 'tl-hashcash', year: 1997,
    title: 'Hashcash',
    body: 'Adam Back proposes Hashcash, a proof-of-work system designed to make email abuse costly. It does not create digital money, but it supplies a key building block later cited in the Bitcoin whitepaper.',
    links: [{ label: 'Read the Hashcash paper', href: 'https://nakamotoinstitute.org/library/hashcash/' }],
    tags: ['Prehistory', 'Technical'],
  },
  {
    id: 'tl-b-money', year: 1998,
    title: 'b-money',
    body: 'Wei Dai describes a pseudonymous electronic cash proposal in which participants maintain a shared record and use computational work and cryptography to coordinate value. The proposal was never fully implemented, but it clarified the shape of the problem.',
    links: [{ label: 'Read b-money', href: 'https://nakamotoinstitute.org/library/b-money/' }],
    tags: ['Prehistory', 'Technical'],
  },
  {
    id: 'tl-rpow', year: 2004,
    title: 'Reusable Proofs of Work',
    body: 'Hal Finney releases RPOW, a working system for transferring reusable proof-of-work tokens. Its trusted hardware model differs from Bitcoin, but it demonstrates another serious attempt to make scarce digital objects transferable.',
    links: [{ label: 'Read the RPOW announcement', href: 'https://nakamotoinstitute.org/library/rpow/' }],
    tags: ['Prehistory', 'Technical'],
  },
  {
    id: 'tl-01', year: 2008, month: 'Oct',
    title: 'The Whitepaper',
    body: 'Satoshi Nakamoto publishes “Bitcoin: A Peer-to-Peer Electronic Cash System” to the cryptography mailing list. The paper combines established ideas—digital signatures, peer-to-peer networking, proof of work, and hash-linked records—into a system intended to prevent double-spending without a central operator.',
    links: [
      { label: 'Read the whitepaper', href: '/texts' },
    ],
    tags: ['Technical', 'Essential'],
  },
  {
    id: 'tl-02', year: 2009, month: 'Jan',
    title: 'Genesis Block',
    body: 'The genesis block is mined. Its coinbase data includes a newspaper headline dated 3 January 2009 about a possible second bank bailout. The text timestamps the launch and invites monetary interpretation without specifying a single official meaning.',
    tags: ['Technical'],
  },
  {
    id: 'tl-03', year: 2009, month: 'Jan',
    title: 'First Transaction',
    body: 'Satoshi sends 10 BTC to Hal Finney in block 170 — the first peer-to-peer Bitcoin transaction. Finney tweets: "Running bitcoin." He would later be diagnosed with ALS and pass away in 2014.',
    tags: ['History'],
  },
  {
    id: 'tl-04', year: 2010, month: 'May',
    title: 'The Pizza',
    body: 'Laszlo Hanyecz pays 10,000 BTC for two Papa John\'s pizzas. The first known commercial Bitcoin transaction. The transaction became a permanent reminder that monetary value is easier to see in hindsight than in the moment.',
    tags: ['History'],
  },
  {
    id: 'tl-05', year: 2010, month: 'Dec',
    title: 'Satoshi Disappears',
    body: 'Satoshi Nakamoto makes a final public forum post and gradually stops communicating over the following months. Development and operation continue without a public founder, reducing one obvious center of authority while leaving ordinary questions of maintenance and coordination.',
    tags: ['Philosophy'],
  },
  {
    id: 'tl-06', year: 2011, month: 'Apr',
    title: 'Hiei\'s First Contact',
    body: 'A blog post in Chinese. Bitcoin at $1. "It feels devil-like — for anyone who comes into contact with it, this thing could be either a temptation or a plunge into the depths of hell." The post ends: I will stay on the sidelines for now.',
    hiei: 'I was right about the nature of it. I was wrong about what to do.',
    links: [
      { label: 'Read the original post', href: '/notes' },
    ],
    tags: ['Philosophy'],
  },
  {
    id: 'tl-07', year: 2012, month: 'Nov',
    title: 'First Halving',
    body: 'The block subsidy falls from 50 to 25 BTC at height 210,000. The event demonstrates that issuance follows rules enforced by network software rather than a scheduled policy decision.',
    links: [
      { label: 'Understanding hardness', href: '/frames/1' },
    ],
    tags: ['Economics'],
  },
  {
    id: 'tl-08', year: 2013, month: 'Mar',
    title: 'Cyprus Banking Crisis',
    body: 'Cyprus imposes capital controls during a banking crisis, while uninsured deposits at major banks face losses under a rescue agreement. The episode becomes an early case study in Bitcoin’s appeal when access to bank money is politically constrained.',
    tags: ['Economics', 'History'],
  },
  {
    id: 'tl-09', year: 2014, month: 'Feb',
    title: 'Mt. Gox Collapse',
    body: 'Mt. Gox suspends withdrawals and enters bankruptcy after reporting that hundreds of thousands of bitcoin were missing. The network continues operating, but users learn that protocol integrity does not protect assets entrusted to an insolvent or compromised custodian.',
    tags: ['History'],
  },
  {
    id: 'tl-10', year: 2016, month: 'Jul',
    title: 'Second Halving',
    body: 'Block reward drops from 25 to 12.5 BTC. The supply schedule continues to execute. Predictability is the feature.',
    tags: ['Economics'],
  },
  {
    id: 'tl-11', year: 2017, month: 'Aug',
    title: 'The Block Size War',
    body: 'Years of conflict over block capacity culminate in Segregated Witness activation and the creation of Bitcoin Cash under incompatible rules. The episode shows that miners, companies, developers, node operators, and markets all exert influence, but no single group can unilaterally redefine the network everyone else recognizes.',
    hiei: 'This was the moment I began treating governance as part of the protocol, not a layer outside it.',
    links: [
      { label: 'Why this one', href: '/primer' },
    ],
    tags: ['Technical', 'Philosophy'],
  },
  {
    id: 'tl-12', year: 2020, month: 'May',
    title: 'Third Halving',
    body: 'The block subsidy falls from 12.5 to 6.25 BTC during the first year of the COVID-19 pandemic and extraordinary global monetary and fiscal intervention. The contrast between rule-based issuance and discretionary policy becomes central to Bitcoin’s public narrative.',
    links: [
      { label: 'Dollar drift vs Bitcoin', href: '/frames/2' },
    ],
    tags: ['Economics'],
  },
  {
    id: 'tl-13', year: 2020, month: 'Aug',
    title: 'MicroStrategy Buys Bitcoin',
    body: 'MicroStrategy allocates $250 million of corporate treasury reserves to bitcoin. The decision creates a visible public-company model for balance-sheet exposure, while also introducing leverage, concentration, accounting, and governance questions.',
    tags: ['Economics'],
  },
  {
    id: 'tl-14', year: 2021, month: 'Sep',
    title: 'El Salvador',
    body: 'El Salvador becomes the first country to make bitcoin legal tender. The policy turns a voluntary monetary network into a state program, making adoption, merchant obligations, public spending, custody, and democratic accountability part of the same experiment.',
    tags: ['Economics', 'History'],
  },
  {
    id: 'tl-15', year: 2024, month: 'Jan',
    title: 'U.S. Spot Bitcoin ETPs Approved',
    body: 'The U.S. SEC approves exchange rule changes allowing spot bitcoin exchange-traded products. The wrapper expands brokerage access while replacing direct ownership with claims mediated by sponsors, custodians, market makers, and securities law.',
    links: [{ label: 'Read the SEC statement', href: 'https://www.sec.gov/newsroom/speeches-statements/gensler-statement-spot-bitcoin-011023' }],
    tags: ['Economics'],
  },
  {
    id: 'tl-16', year: 2024, month: 'Apr',
    title: 'Fourth Halving',
    body: 'Block reward drops from 6.25 to 3.125 BTC. Over 93% of all Bitcoin that will ever exist has been mined. The remaining 7% will be distributed over the next 120 years.',
    tags: ['Economics'],
  },
  {
    id: 'tl-17', year: 2025, month: 'Mar',
    title: 'U.S. Strategic Bitcoin Reserve',
    body: 'A U.S. executive order establishes a Strategic Bitcoin Reserve capitalized initially with government-held bitcoin obtained through forfeiture. The policy marks a shift from regulating private exposure to treating bitcoin as an asset of state treasury administration; its long-term legal and political durability remains unsettled.',
    links: [{ label: 'Read the executive order', href: 'https://www.whitehouse.gov/presidential-actions/2025/03/establishment-of-the-strategic-bitcoin-reserve-and-united-states-digital-asset-stockpile/' }],
    tags: ['Policy', 'History'],
  },
];
