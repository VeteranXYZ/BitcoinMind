import { writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const target = join(__dirname, '..', 'src', 'lib', 'block-height.ts');

const FALLBACK = 946000;

async function fetchHeight() {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5000);
    const res = await fetch('https://mempool.space/api/blocks/tip/height', { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = (await res.text()).trim();
    const n = parseInt(text, 10);
    if (!Number.isFinite(n) || n <= 0) throw new Error('bad payload');
    return n;
  } catch (e) {
    console.warn('[fetch-block-height] live fetch failed:', e.message);
    return null;
  }
}

const live = await fetchHeight();

let current = FALLBACK;
try {
  const existing = readFileSync(target, 'utf8');
  const m = existing.match(/FALLBACK_BLOCK_HEIGHT\s*=\s*(\d+)/);
  if (m) current = parseInt(m[1], 10);
} catch { /* file may not exist yet */ }

const next = live && live > current ? live : current;

const body = `// Generated at build time by scripts-build/fetch-block-height.mjs.
// Updated automatically before each build with the live height from mempool.space.
export const FALLBACK_BLOCK_HEIGHT = ${next};
`;

writeFileSync(target, body, 'utf8');
console.log(`[fetch-block-height] wrote ${next} (${live ? 'live' : 'cached'})`);
