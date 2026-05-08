import { useMemo, useState } from 'preact/hooks';
import { TOOLKIT } from '@/data/toolkit';
import Tag from './Tag';
import type { ToolkitItem } from '@/data/types';

const FILTERS = ['All', 'Observe', 'Verify', 'Control', 'Custody', 'Research', 'Free', 'Beginner', 'Intermediate', 'Advanced'];
const EARLY_LAYERS = ['Observe', 'Verify', 'Control', 'Beginner Custody', 'Advanced Custody'];

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
      if (filter === 'Custody') return item.layer.includes('Custody');
      if (filter === 'Research') return item.layer.includes('Research') || item.layer.includes('Analytics') || item.layer === 'Market Context';
      if (filter === 'Free') return item.cost === 'Free';
      return item.layer === filter || item.difficulty === filter || item.tags.includes(filter);
    }),
    [filter]
  );

  const practiceItems = filtered.filter((item) => EARLY_LAYERS.includes(item.layer));
  const researchItems = filtered.filter((item) => !EARLY_LAYERS.includes(item.layer));

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
      {practiceItems.length > 0 && (
        <>
          <div class="toolkit-sec-hd">Verification and Custody</div>
          <p class="toolkit-sec-desc">Observe the network, verify it directly, then learn deliberate custody.</p>
          <div class="grid-auto">{practiceItems.map((item) => <ToolkitCard key={item.id} item={item} />)}</div>
        </>
      )}
      {researchItems.length > 0 && (
        <>
          <div class="toolkit-sec-hd toolkit-sec-hd--lower">Research and Context</div>
          <p class="toolkit-sec-desc">Use long-term data as context for study, not as a substitute for judgment.</p>
          <div class="grid-auto">{researchItems.map((item) => <ToolkitCard key={item.id} item={item} />)}</div>
        </>
      )}
      {filtered.length === 0 && <p class="no-res">No toolkit items match this filter.</p>}
    </>
  );
}
