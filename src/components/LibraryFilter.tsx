import { useMemo, useState } from 'preact/hooks';
import { LIBRARY } from '@/data/library';
import Tag from './Tag';
import type { LibraryItem } from '@/data/types';

const TAGS = ['All', 'Money', 'Economics', 'Foundations', 'Technical', 'Protocol', 'History', 'Sovereignty', 'Beginner', 'Intermediate', 'Advanced'];
const LAYER_DESC: Record<number, string> = {
  1: 'Money, Bitcoin, and the first mental model.',
  2: 'Technical, historical, and monetary structure.',
  3: 'Bitcoin as a shift in power, custody, and institutional trust.',
};

function LibraryCard({ item }: { item: LibraryItem }) {
  return (
    <a class="card" href={item.link} target="_blank" rel="noopener noreferrer">
      <div class="card-layer">{item.layerLabel}</div>
      <div class="card-role">{item.learningRole}</div>
      <div class="card-title">{item.title}</div>
      <div class="card-author">{item.author}</div>
      <div class="card-desc">{item.shortDescription}</div>
      <div class="card-tags">
        {item.tags.map((t) => <Tag key={t} label={t} />)}
        <Tag label={item.difficulty} />
      </div>
      <div class="card-review">
        <div class="card-ri"><strong>Why it belongs</strong>{item.whyItBelongs}</div>
        <div class="card-ri"><strong>Best for</strong>{item.bestFor}</div>
        <div class="card-ri"><strong>Path position</strong>{item.learningPathPosition}</div>
      </div>
      <div class="card-ft">
        <span class="card-meta">{item.difficulty}</span>
        <span class="card-cta">Read →</span>
      </div>
    </a>
  );
}

export default function LibraryFilter() {
  const [filter, setFilter] = useState('All');
  const [q, setQ] = useState('');

  const filtered = useMemo(
    () => LIBRARY.filter((item) => {
      const matchesFilter = filter === 'All' || item.tags.includes(filter) || item.difficulty === filter;
      const query = q.toLowerCase();
      const matchesSearch = !query || item.title.toLowerCase().includes(query) || item.author.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    }),
    [filter, q]
  );

  const showLayers = filter === 'All' && !q;

  return (
    <>
      <div class="fb" role="group" aria-label="Filter library">
        <span class="fb-lbl">Filter:</span>
        <input
          class="srch"
          type="search"
          aria-label="Search library"
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
      {showLayers ? (
        [1, 2, 3].map((layer) => {
          const layerItems = LIBRARY.filter((item) => item.layer === layer);
          return (
            <div key={layer} class="layer">
              <div class="layer-hd">
                <span class="layer-n">Layer {layer}</span>
                <span class="layer-name">{layerItems[0]?.layerLabel.replace(/^Layer \d+ - /, '')}</span>
              </div>
              <p class="layer-desc">{LAYER_DESC[layer]}</p>
              <div class="grid-auto">
                {layerItems.map((item) => <LibraryCard key={item.id} item={item} />)}
              </div>
            </div>
          );
        })
      ) : (
        <>
          {filtered.length === 0 && <p class="no-res">No library items match this filter.</p>}
          <div class="grid-auto">
            {filtered.map((item) => <LibraryCard key={item.id} item={item} />)}
          </div>
        </>
      )}
    </>
  );
}
