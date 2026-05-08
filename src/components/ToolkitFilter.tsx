import { useMemo, useState } from 'preact/hooks';
import { TOOLKIT } from '@/data/toolkit';
import Tag from './Tag';
import type { ToolkitItem } from '@/data/types';

const FILTERS = ['All', 'Observation', 'Verification', 'Custody', 'Protocol', 'Research', 'Free', 'Beginner', 'Intermediate', 'Advanced'];
const GROUPS = [
  {
    name: 'Core Toolkit',
    title: 'Core Toolkit',
    desc: 'Observe the network, verify it directly, and understand the software layer around Bitcoin.',
  },
  {
    name: 'Custody Instruments',
    title: 'Custody Instruments',
    desc: 'Wallets and signing devices for learning self-custody with increasing care.',
  },
  {
    name: 'Research and Context',
    title: 'Research and Context',
    desc: 'Use long-term data and reference archives as context for study, not as a substitute for judgment.',
  },
];

function ToolkitCard({ item }: { item: ToolkitItem }) {
  return (
    <a class="card" href={item.link} target="_blank" rel="noopener noreferrer">
      <div class="card-layer">{item.layer}</div>
      <div class="card-role">{item.learningRole}</div>
      <div class="card-title">{item.title}</div>
      <div class="card-desc card-desc--top">{item.shortDescription}</div>
      <div class="card-tags">
        {item.tags.map((t) => <Tag key={t} label={t} />)}
        <Tag label={item.difficulty} />
        <Tag label={item.cost} />
      </div>
      <div class="card-review">
        <div class="card-ri"><strong>Why it belongs</strong>{item.whyItBelongs}</div>
        <div class="card-ri"><strong>Best for</strong>{item.bestFor}</div>
        <div class="card-ri"><strong>Path position</strong>{item.learningPathPosition}</div>
      </div>
      <div class="card-ft">
        <span class="card-meta">{item.cost}</span>
        <span class="card-cta">Visit →</span>
      </div>
    </a>
  );
}

export default function ToolkitFilter() {
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(
    () => TOOLKIT.filter((item) => {
      if (filter === 'All') return true;
      if (filter === 'Custody') return item.pathStage === 'Custody';
      if (filter === 'Research') return item.group === 'Research and Context';
      if (filter === 'Free') return item.cost === 'Free';
      return item.pathStage === filter || item.difficulty === filter || item.tags.includes(filter);
    }),
    [filter]
  );

  return (
    <>
      <div class="fb" role="group" aria-label="Filter toolkit">
        <span class="fb-lbl">Filter:</span>
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            class={`fb-btn ${filter === f ? 'on' : ''}`}
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >{f}</button>
        ))}
      </div>
      {GROUPS.map((group, index) => {
        const groupItems = filtered.filter((item) => item.group === group.name);
        if (groupItems.length === 0) return null;
        return (
          <>
            <div class={`toolkit-sec-hd ${index > 0 ? 'toolkit-sec-hd--lower' : ''}`}>{group.title}</div>
            <p class="toolkit-sec-desc">{group.desc}</p>
            <div class="grid-auto">{groupItems.map((item) => <ToolkitCard key={item.id} item={item} />)}</div>
          </>
        );
      })}
      {filtered.length === 0 && <p class="no-res">No toolkit items match this filter.</p>}
    </>
  );
}
