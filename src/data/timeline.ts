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
    id: 'tl-01', year: 2008, month: 'Oct',
    title: 'The Whitepaper',
    body: 'Satoshi Nakamoto publishes "Bitcoin: A Peer-to-Peer Electronic Cash System" to the cryptography mailing list. Nine pages. No venture capital. No company. Just an idea and a proof.',
    links: [
      { label: 'Read the whitepaper', href: '/texts' },
    ],
    tags: ['Technical', 'Essential'],
  },
  {
    id: 'tl-02', year: 2009, month: 'Jan',
    title: 'Genesis Block',
    body: 'Block 0 is mined. Embedded in the coinbase: "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks." The timestamp is the message.',
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
    body: 'Laszlo Hanyecz pays 10,000 BTC for two Papa John\'s pizzas. The first known commercial Bitcoin transaction. At today\'s price, each pizza cost more than most people will earn in a lifetime.',
    tags: ['History'],
  },
  {
    id: 'tl-05', year: 2010, month: 'Dec',
    title: 'Satoshi Disappears',
    body: 'Satoshi Nakamoto makes his last public post on the Bitcoin forum, then gradually ceases all communication over the following months. The creator vanishes. The network continues. This is the point — the system doesn\'t need its creator.',
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
    body: 'Block reward drops from 50 to 25 BTC. The supply schedule executes exactly as written. No board meeting. No vote. Just math.',
    links: [
      { label: 'Understanding hardness', href: '/frames/1' },
    ],
    tags: ['Economics'],
  },
  {
    id: 'tl-08', year: 2013, month: 'Mar',
    title: 'Cyprus Banking Crisis',
    body: 'Cypriot banks freeze deposits. The government takes a percentage of savings above €100,000. Bitcoin is discussed as a "safe haven" for the first time in mainstream media. Price rises from $30 to $260.',
    tags: ['Economics', 'History'],
  },
  {
    id: 'tl-09', year: 2014, month: 'Feb',
    title: 'Mt. Gox Collapse',
    body: 'The largest Bitcoin exchange loses 850,000 BTC. Critics declare Bitcoin dead. The network keeps producing blocks. The protocol doesn\'t care about exchanges.',
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
    body: 'Bitcoin splits. Bitcoin Cash forks away, claiming to be "the real Bitcoin." The market and the network decide otherwise. The war establishes that Bitcoin\'s rules are set by nodes, not miners or corporations.',
    hiei: 'This was the moment I understood that Bitcoin\'s governance is its most underappreciated feature.',
    links: [
      { label: 'Why this one', href: '/primer' },
    ],
    tags: ['Technical', 'Philosophy'],
  },
  {
    id: 'tl-12', year: 2020, month: 'May',
    title: 'Third Halving',
    body: 'Block reward drops from 12.5 to 6.25 BTC. The world is in lockdown. Central banks print trillions. Bitcoin\'s supply schedule doesn\'t change.',
    links: [
      { label: 'Dollar drift vs Bitcoin', href: '/frames/2' },
    ],
    tags: ['Economics'],
  },
  {
    id: 'tl-13', year: 2020, month: 'Aug',
    title: 'MicroStrategy Buys Bitcoin',
    body: 'Michael Saylor converts $250 million of corporate treasury to Bitcoin. The first major public company to treat Bitcoin as a reserve asset. A signal — not that Bitcoin needs institutions, but that institutions are starting to need Bitcoin.',
    tags: ['Economics'],
  },
  {
    id: 'tl-14', year: 2021, month: 'Sep',
    title: 'El Salvador',
    body: 'El Salvador makes Bitcoin legal tender — the first nation-state to do so. Whether it succeeds or fails is secondary. The Overton window has moved.',
    tags: ['Economics', 'History'],
  },
  {
    id: 'tl-15', year: 2024, month: 'Jan',
    title: 'Spot ETF Approved',
    body: 'The U.S. SEC approves spot Bitcoin ETFs. Within weeks, billions flow in. The irony: an asset designed to eliminate intermediaries is now packaged inside one. The network doesn\'t notice.',
    tags: ['Economics'],
  },
  {
    id: 'tl-16', year: 2024, month: 'Apr',
    title: 'Fourth Halving',
    body: 'Block reward drops from 6.25 to 3.125 BTC. Over 93% of all Bitcoin that will ever exist has been mined. The remaining 7% will be distributed over the next 120 years.',
    tags: ['Economics'],
  },
];
