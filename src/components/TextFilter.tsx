import { useMemo, useState } from 'preact/hooks';
import { TEXTS } from '@/data/texts';
import Tag from './Tag';
import type { TextItem } from '@/data/types';

const TAGS = ['All', 'Primary', 'Security', 'Verification', 'Adoption', 'Sovereignty', 'Reference', 'Beginner', 'Intermediate', 'Advanced'];

function getTypeLabel(item: TextItem) {
  const title = item.title.toLowerCase();
  if (title.includes('whitepaper')) return 'Paper';
  if (title.includes('documentation') || title.includes('running a full node')) return 'Documentation';
  if (title.includes('gradually, then suddenly')) return 'Series';
  if (title.includes('questions') || title.includes('faq')) return 'Q&A';
  if (item.tags.includes('Reference')) return 'Reference';
  return 'Essay';
}

function matchesTextFilter(item: TextItem, filter: string) {
  if (filter === 'All') return true;
  if (filter === item.difficulty || item.tags.includes(filter) || getTypeLabel(item) === filter) return true;
  if (filter === 'Primary') return item.group === 'Primary Texts' || item.tags.includes('Whitepaper');
  if (filter === 'Verification') return item.tags.some((tag) => ['Node', 'Verification', 'Technical'].includes(tag));
  if (filter === 'Adoption') return item.tags.some((tag) => ['Adoption', 'Institutional', 'History'].includes(tag));
  return false;
}

function TextCard({ item }: { item: TextItem }) {
  const visibleTags = item.tags.slice(0, 3);
  const typeLabel = getTypeLabel(item);

  return (
    <a class="card" href={item.link} target="_blank" rel="noopener noreferrer">
      <div class="card-layer card-layer--row">
        <span>{item.layer}</span>
        {item.year > 0 && <span>{item.year}</span>}
      </div>
      <div class="card-role">{item.learningRole}</div>
      <div class="card-title">{item.title}</div>
      <div class="card-author">{item.author}</div>
      <div class="card-desc card-desc--top">{item.shortDescription}</div>
      <div class="card-tags">
        <Tag label={typeLabel} />
        {visibleTags.map((t) => <Tag key={t} label={t} />)}
        <Tag label={item.difficulty} />
      </div>
      <div class="card-review">
        <div class="card-ri"><strong>Why it belongs</strong>{item.whyItBelongs}</div>
        <div class="card-ri"><strong>Best for</strong>{item.bestFor}</div>
        <div class="card-ri"><strong>Path position</strong>{item.learningPathPosition}</div>
      </div>
      <div class="card-ft">
        <span class="card-meta">{item.timeCommitment}</span>
        <span class="card-cta">Read →</span>
      </div>
    </a>
  );
}

export default function TextFilter() {
  const [filter, setFilter] = useState('All');
  const [q, setQ] = useState('');

  const filtered = useMemo(
    () => TEXTS.filter((item) => {
      const matchesFilter = matchesTextFilter(item, filter);
      const query = q.toLowerCase();
      const matchesSearch = !query || item.title.toLowerCase().includes(query) || item.author.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    }),
    [filter, q]
  );

  return (
    <>
      <div class="fb" role="group" aria-label="Filter texts">
        <span class="fb-lbl">Filter:</span>
        <input
          class="srch"
          type="search"
          aria-label="Search texts"
          placeholder="Search..."
          value={q}
          onInput={(e) => setQ((e.target as HTMLInputElement).value)}
        />
        {TAGS.map((t) => (
          <button
            key={t}
            type="button"
            class={`fb-btn ${filter === t ? 'on' : ''}`}
            aria-pressed={filter === t}
            onClick={() => setFilter(t)}
          >{t}</button>
        ))}
      </div>
      {filtered.length === 0 && <p class="no-res">No texts match this filter.</p>}
      <div class="grid-auto">
        {filtered.map((item) => <TextCard key={item.id} item={item} />)}
      </div>
    </>
  );
}
