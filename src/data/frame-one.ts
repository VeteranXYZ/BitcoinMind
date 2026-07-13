export type Hardness = 'high' | 'low' | 'half' | 'absolute';
export type FrameLinkTarget = 'library' | 'texts' | 'toolkit';

export interface FrameNode {
  n: string;
  year: string;
  title: string;
  epigraph: string;
  hardness: Hardness;
  body: string[];
  coda?: string;
  links?: { label: string; target: FrameLinkTarget }[];
}

export interface Frame {
  number: string;
  title: string;
  subtitle: string;
  question: string;
  reviewedAt: string;
  sources: { label: string; href: string }[];
  nodes: FrameNode[];
}

export const FRAME_ONE: Frame = {
  number: '№1',
  title: 'A History of Hardness',
  subtitle: 'Five thousand years of money, told through the question every era had to answer:',
  question: '"What stops you from making more?"',
  reviewedAt: '2026-07-12',
  sources: [
    { label: 'Smithsonian — The Stone Money of Yap', href: 'https://www.smithsonianmag.com/history/the-stone-money-of-yap-98029050/' },
    { label: 'Federal Reserve History — Gold Reserve Act of 1934', href: 'https://www.federalreservehistory.org/essays/gold-reserve-act' },
    { label: 'American Presidency Project — Address of August 15, 1971', href: 'https://www.presidency.ucsb.edu/documents/address-the-nation-outlining-new-economic-policy-the-challenge-peace' },
    { label: 'Bitcoin whitepaper', href: 'https://bitcoin.org/bitcoin.pdf' },
    { label: 'Bitcoin genesis block', href: 'https://mempool.space/block/000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f' },
  ],
  nodes: [
    {
      n: '01', year: '3000 BCE', title: 'Yap', epigraph: 'Stone too heavy to steal', hardness: 'high',
      body: [
        'On the island of Yap in Micronesia, money was a stone wheel — sometimes the size of a man, sometimes larger than a house. The wheels never moved. When ownership changed, everyone simply remembered. Hardness was solved by something stranger than scarcity: the money was so impractical to make, and so public to own, that nature and community together made fraud nearly impossible.',
      ],
      links: [{ label: 'Shelling Out', target: 'texts' }],
    },
    {
      n: '02', year: '600 BCE', title: 'The Coin', epigraph: 'Hardness made portable', hardness: 'high',
      body: [
        'Lydian smiths struck small ovals of electrum, each stamped to certify weight and purity. Money you could carry, divide, and verify by hand. For the next two thousand five hundred years, civilization ran on metal — and on the unspoken assumption that the people who minted it were not lying.',
      ],
      links: [{ label: 'The Bitcoin Standard', target: 'library' }],
    },
    {
      n: '03', year: '215 CE', title: 'Debasement', epigraph: 'The first lie', hardness: 'low',
      body: [
        'The Roman denarius, once 4.5 grams of pure silver, was quietly diluted with copper across two centuries until it was almost none. The mint was unchanged. The inscription was unchanged. Only the substance had been removed.',
        'Hardness, it turned out, was not in the symbol. It was in the thing itself.',
      ],
      links: [{ label: 'The Bitcoin Standard', target: 'library' }],
    },
    {
      n: '04', year: '1933 CE', title: 'Confiscation', epigraph: 'The owner is the rule', hardness: 'low',
      body: [
        'By executive order, every American was required to surrender their gold to the United States government within thirty days, in exchange for paper dollars at $20.67 an ounce. Weeks later, the government revalued gold to $35. A 41% transfer of wealth, executed without a vote, by a stroke of a pen.',
        'The lesson of Rome had been about substance. The lesson of 1933 was simpler: whoever holds the money makes the rules.',
      ],
      links: [{ label: 'Check Your Financial Privilege', target: 'library' }],
    },
    {
      n: '05', year: '1971 CE', title: 'Nixon', epigraph: 'The last anchor cut', hardness: 'low',
      body: [
        "On August 15, the United States severed the dollar's tether to gold — the last formal link between any major currency and a finite substance. The architects of what followed were not villains. The system they built financed Apollo, Medicare, and the longest run of peace among great powers in modern history.",
        'But it required something monetary history had never required before: the question of how much money exists became a decision, made by a small group of people, behind closed doors.',
      ],
      links: [
        { label: 'The Bitcoin Standard', target: 'library' },
        { label: 'Check Your Financial Privilege', target: 'library' },
      ],
    },
    {
      n: '06', year: '2008 CE', title: 'The White Paper', epigraph: 'Hardness without trust', hardness: 'half',
      body: [
        'Nine pages, posted to a cryptography mailing list, by an author no one had heard of and would never meet. The proposal: enforce hardness not by metal, not by law, not by the trustworthiness of any institution — but by code, math, and a network of computers each watching every other.',
      ],
      links: [{ label: 'Bitcoin: A Peer-to-Peer Electronic Cash System', target: 'texts' }],
    },
    {
      n: '07', year: '2009 CE', title: 'Genesis', epigraph: 'A money no one runs', hardness: 'absolute',
      body: [
        'January 3, 18:15 UTC. The first block. Embedded in its data: a quote from that morning’s Times — “Chancellor on brink of second bailout for banks.”',
        'The supply schedule was set in the same instant: twenty-one million, ever, distributed by halvings, ending in 2140. No treaty enforced it. No promise underwrote it. Only the network — and any node, anywhere, refusing to run code that broke it.',
      ],
      coda: 'Hardness, finally, made independent of every party that ever broke it before.',
      links: [
        { label: 'The Bullish Case for Bitcoin', target: 'texts' },
        { label: 'Gradually, Then Suddenly', target: 'texts' },
      ],
    },
  ],
};

export interface FrameSummary {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  kind: 'narrative' | 'interactive';
  nodes: number | null;
}

export const FRAMES_LIST: FrameSummary[] = [
  {
    id: 'frames-1',
    number: '№1',
    title: 'A History of Hardness',
    subtitle: 'Five thousand years of money, told through the question every era had to answer: "What stops you from making more?"',
    kind: 'narrative',
    nodes: 7,
  },
  {
    id: 'frames-2',
    number: '№2',
    title: 'After the Anchor',
    subtitle: 'What happens to money when the anchor is cut. An interactive view of fifty-five years of dollar drift, beside sixteen years of bitcoin.',
    kind: 'interactive',
    nodes: null,
  },
];
