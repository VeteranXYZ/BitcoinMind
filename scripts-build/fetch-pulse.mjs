import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const target = join(__dirname, '..', 'public', 'pulse.json');
const blockHeightSource = join(__dirname, '..', 'src', 'lib', 'block-height.ts');

const FALLBACK = {
  height: 948364,
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
    return match ? parseInt(match[1], 10) : FALLBACK.height;
  } catch {
    return FALLBACK.height;
  }
}

function readExisting() {
  try {
    return { ...FALLBACK, ...JSON.parse(readFileSync(target, 'utf8')) };
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

try {
  const text = (await fetchText('https://mempool.space/api/blocks/tip/height')).trim();
  const height = parseInt(text, 10);
  if (Number.isFinite(height) && height > 0) next.height = Math.max(height, next.height ?? 0);
} catch (e) {
  console.warn('[fetch-pulse] height fetch failed:', e.message);
}

try {
  const data = await fetchJson('https://mempool.space/api/v1/mining/hashrate/1m');
  if (Number.isFinite(data?.currentHashrate) && data.currentHashrate > 0) next.hashRate = data.currentHashrate;
} catch (e) {
  console.warn('[fetch-pulse] hash rate fetch failed:', e.message);
}

try {
  const data = await fetchJson('https://mempool.space/api/mempool');
  if (Number.isFinite(data?.count) && data.count >= 0) next.mempoolCount = data.count;
} catch (e) {
  console.warn('[fetch-pulse] mempool fetch failed:', e.message);
}

try {
  const data = await fetchJson('https://bitnodes.io/api/v1/snapshots/latest/');
  if (Number.isFinite(data?.total_nodes) && data.total_nodes > 0) next.nodeCount = data.total_nodes;
} catch (e) {
  console.warn('[fetch-pulse] node count fetch failed:', e.message);
}

next.fetchedAt = new Date().toISOString();
next.source = 'snapshot';

writeFileSync(target, JSON.stringify(next, null, 2) + '\n', 'utf8');
console.log(`[fetch-pulse] wrote ${target}`);
