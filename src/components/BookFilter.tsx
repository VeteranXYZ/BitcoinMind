import { useMemo, useState } from 'preact/hooks';
import { BOOKS } from '@/data/books';
import Tag from './Tag';
import type { Book } from '@/data/types';

const TAGS = ['All', 'Philosophy', 'Economics', 'Technical', 'History', 'Essential', 'Beginner', 'Intermediate', 'Advanced'];
const LAYER_NAMES: Record<number, string> = { 1: 'Start Here', 2: 'Go Deeper', 3: 'For Thinkers' };
const LAYER_DESC: Record<number, string> = {
  1: 'Begin here regardless of background. These books establish the core conceptual framework.',
  2: 'For readers who have finished Layer 1 and want depth — technical, economic, or historical.',
  3: 'For those who think about Bitcoin as a civilizational technology, not just a financial one.',
};

function BookCard({ book }: { book: Book }) {
  return (
    <a class="card" href={book.link} target="_blank" rel="noopener noreferrer">
      <div class="card-layer">Layer {book.layer} — {book.ll}</div>
      <div class="card-title">{book.title}</div>
      <div class="card-author">{book.author}</div>
      <div class="card-desc">{book.desc}</div>
      <div class="card-tags">
        {book.tags.map((t) => <Tag key={t} label={t} />)}
        <Tag label={book.diff} />
      </div>
      <div class="card-review">
        {book.review.map((r, i) => <div key={i} class="card-ri">{r}</div>)}
      </div>
      <div class="card-ft">
        <span class="card-meta">{book.diff}</span>
        <span class="card-cta">Read →</span>
      </div>
    </a>
  );
}

export default function BookFilter() {
  const [filter, setFilter] = useState('All');
  const [q, setQ] = useState('');

  const filtered = useMemo(
    () => BOOKS.filter((b) => {
      const t = filter === 'All' || b.tags.includes(filter) || b.diff === filter;
      const s = !q || b.title.toLowerCase().includes(q.toLowerCase()) || b.author.toLowerCase().includes(q.toLowerCase());
      return t && s;
    }),
    [filter, q]
  );

  const showLayers = filter === 'All' && !q;

  return (
    <>
      <div class="fb" role="group" aria-label="Filter books">
        <span class="fb-lbl">Filter:</span>
        <input
          class="srch"
          type="search"
          aria-label="Search books"
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
        [1, 2, 3].map((l) => (
          <div key={l} class="layer">
            <div class="layer-hd">
              <span class="layer-n">Layer {l}</span>
              <span class="layer-name">{LAYER_NAMES[l]}</span>
            </div>
            <p class="layer-desc">{LAYER_DESC[l]}</p>
            <div class="grid-auto">
              {BOOKS.filter((b) => b.layer === l).map((b) => <BookCard key={b.id} book={b} />)}
            </div>
          </div>
        ))
      ) : (
        <>
          {filtered.length === 0 && <p class="no-res">No books match this filter.</p>}
          <div class="grid-auto">
            {filtered.map((b) => <BookCard key={b.id} book={b} />)}
          </div>
        </>
      )}
    </>
  );
}
