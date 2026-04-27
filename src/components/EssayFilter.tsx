import { useMemo, useState } from 'preact/hooks';
import { ESSAYS } from '@/data/essays';
import type { Essay } from '@/data/types';

const TAGS = ['All', 'Philosophy', 'Economics', 'Technical', 'History', 'Essential'];

function Tag({ label }: { label: string }) {
  const cls = label.toLowerCase().replace(/\s+/g, '-');
  return <span class={`tag tag--${cls}`}>{label}</span>;
}

function EssayCard({ essay }: { essay: Essay }) {
  return (
    <a class="card" href={essay.link} target="_blank" rel="noopener noreferrer">
      <div class="card-layer card-layer--row">
        <span>{essay.author}</span>
        <span>{essay.year}</span>
      </div>
      <div class="card-title">{essay.title}</div>
      <div class="card-desc card-desc--top">{essay.desc}</div>
      <div class="card-tags">
        {essay.tags.map((t) => <Tag key={t} label={t} />)}
      </div>
      <div class="card-review">
        {essay.review.map((r, i) => <div key={i} class="card-ri">{r}</div>)}
      </div>
      <div class="card-ft">
        <span class="card-meta">{essay.rt}</span>
        <span class="card-cta">Read →</span>
      </div>
    </a>
  );
}

export default function EssayFilter() {
  const [filter, setFilter] = useState('All');
  const [q, setQ] = useState('');

  const filtered = useMemo(
    () => ESSAYS.filter((e) => {
      const t = filter === 'All' || e.tags.includes(filter);
      const s = !q || e.title.toLowerCase().includes(q.toLowerCase()) || e.author.toLowerCase().includes(q.toLowerCase());
      return t && s;
    }),
    [filter, q]
  );

  return (
    <>
      <div class="fb">
        <span class="fb-lbl">Filter:</span>
        <input
          class="srch"
          placeholder="Search..."
          value={q}
          onInput={(e) => setQ((e.target as HTMLInputElement).value)}
        />
        {TAGS.map((t) => (
          <button key={t} class={`fb-btn ${filter === t ? 'on' : ''}`} onClick={() => setFilter(t)}>{t}</button>
        ))}
      </div>
      {filtered.length === 0 && <p class="no-res">No essays match this filter.</p>}
      <div class="grid-auto">
        {filtered.map((e) => <EssayCard key={e.id} essay={e} />)}
      </div>
    </>
  );
}
