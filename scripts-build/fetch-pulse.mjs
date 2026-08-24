import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const target = join(__dirname, '..', 'public', 'pulse.json');
const blockHeightSource = join(__dirname, '..', 'src', 'lib', 'block-height.ts');
const MEMPOOL_API = 'https://mempool.space/api';

const FALLBACK = {
  hashRate: null,
  mempoolCount: null,
  nodeCount: null,
  fetchedAt: null,
  source: 'fallback',
};

function readFallbackHeight() {
  try {
    const body = readFileSync(blockHeightSource, 'utf8');
    const match = body.match(/FALLBACK_BLOCK_HEIGHT\s*=\s*(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  } catch {
    return 0;
  }
}

function readExisting() {
  try {
    return { ...FALLBACK, height: readFallbackHeight(), ...JSON.parse(readFileSync(target, 'utf8')) };
  } catch {
    return { ...FALLBACK, height: readFallbackHeight() };
  }
}

async function fetchJson(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 6000);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchText(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 6000);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

const existing = readExisting();
const next = { ...existing, source: 'cached' };
let refreshedFields = 0;

try {
  const text = (await fetchText(`${MEMPOOL_API}/blocks/tip/height`)).trim();
  const height = parseInt(text, 10);
  if (Number.isFinite(height) && height > 0) {
    next.height = Math.max(height, next.height ?? 0);
    refreshedFields += 1;
  }
} catch (e) {
  console.warn('[fetch-pulse] height fetch failed:', e.message);
}

try {
  const data = await fetchJson(`${MEMPOOL_API}/v1/mining/hashrate/1m`);
  if (Number.isFinite(data?.currentHashrate) && data.currentHashrate > 0) {
    next.hashRate = data.currentHashrate;
    refreshedFields += 1;
  }
} catch (e) {
  console.warn('[fetch-pulse] hash rate fetch failed:', e.message);
}

try {
  const data = await fetchJson(`${MEMPOOL_API}/mempool`);
  if (Number.isFinite(data?.count) && data.count >= 0) {
    next.mempoolCount = data.count;
    refreshedFields += 1;
  }
} catch (e) {
  console.warn('[fetch-pulse] mempool fetch failed:', e.message);
}

try {
  const data = await fetchJson('https://bitnodes.io/api/v1/snapshots/latest/');
  if (Number.isFinite(data?.total_nodes) && data.total_nodes > 0) {
    next.nodeCount = data.total_nodes;
    refreshedFields += 1;
  }
} catch (e) {
  console.warn('[fetch-pulse] node count fetch failed:', e.message);
}

if (refreshedFields > 0) {
  next.fetchedAt = new Date().toISOString();
  next.source = refreshedFields === 4 ? 'snapshot' : 'partial-snapshot';
}

writeFileSync(target, JSON.stringify(next, null, 2) + '\n', 'utf8');
if (Number.isFinite(next.height) && next.height > 0) {
  const body = `// Fallback block height used when the generated pulse snapshot has no valid
// height. Refresh manually with \`npm run refresh-data\` when you want this
// constant pulled forward — it is NOT auto-updated on each build.
export const FALLBACK_BLOCK_HEIGHT = ${Math.max(next.height, readFallbackHeight())};
`;
  writeFileSync(blockHeightSource, body, 'utf8');
}
console.log(`[fetch-pulse] wrote ${target}`);
