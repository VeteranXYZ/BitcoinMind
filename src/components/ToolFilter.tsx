import { useMemo, useState } from 'preact/hooks';
import { TOOLS } from '@/data/tools';
import Tag from './Tag';
import type { Tool } from '@/data/types';

const FILTERS = ['All', 'Sovereignty', 'Intelligence', 'Free', 'Beginner', 'Advanced'];

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <a class="card" href={tool.link} target="_blank" rel="noopener noreferrer">
      <div class="card-layer">{tool.cat}</div>
      <div class="card-title">{tool.name}</div>
      <div class="card-desc card-desc--top">{tool.desc}</div>
      <div class="card-tags">
        {tool.tags.map((t) => <Tag key={t} label={t} />)}
        <Tag label={tool.cost} />
      </div>
      <div class="card-ft">
        <span class="card-meta">{tool.cost}</span>
        <span class="card-cta">Visit →</span>
      </div>
    </a>
  );
}

export default function ToolFilter() {
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(
    () => TOOLS.filter((t) => {
      if (filter === 'All') return true;
      if (filter === 'Sovereignty' || filter === 'Intelligence') return t.cat === filter;
      if (filter === 'Free') return t.cost === 'Free';
      return t.tags.includes(filter);
    }),
    [filter]
  );

  const sov = filtered.filter((t) => t.cat === 'Sovereignty');
  const intel = filtered.filter((t) => t.cat === 'Intelligence');

  return (
    <>
      <div class="fb" role="group" aria-label="Filter tools">
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
      {sov.length > 0 && (
        <>
          <div class="tool-sec-hd">Sovereignty Tools</div>
          <p class="tool-sec-desc">True ownership means no counterparty risk. These tools get you there.</p>
          <div class="grid-auto">{sov.map((t) => <ToolCard key={t.id} tool={t} />)}</div>
        </>
      )}
      {intel.length > 0 && (
        <>
          <div class="tool-sec-hd tool-sec-hd--lower">Intelligence Tools</div>
          <p class="tool-sec-desc">On-chain data removes the need to speculate. Use signals that can't be faked.</p>
          <div class="grid-auto">{intel.map((t) => <ToolCard key={t.id} tool={t} />)}</div>
        </>
      )}
      {filtered.length === 0 && <p class="no-res">No tools match this filter.</p>}
    </>
  );
}
