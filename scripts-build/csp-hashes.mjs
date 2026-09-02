// Collects the sha256 of every inline <script> in the built site so the
// Worker can name them explicitly in script-src.
//
// The policy still lists 'unsafe-inline' as a fallback for CSP1-era
// browsers; any browser that understands hashes ignores it, which is the
// point — an injected inline script no longer executes just because the
// site happens to need a handful of its own.
//
// Runs as part of `npm run build`. The audit re-derives the hashes from
// dist and fails if this file is stale, so the two cannot drift.
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const DIST = join(ROOT, 'dist');
const TARGET = join(ROOT, 'worker', 'script-hashes.json');

// `type="application/ld+json"` blocks are data, not script: the HTML parser
// never prepares them for execution, so script-src never applies to them.
const INLINE_SCRIPT = /<script\b(?![^>]*\ssrc=)([^>]*)>([\s\S]*?)<\/script>/g;
const NON_EXECUTABLE_TYPE = /type=(['"])(?!module\1|text\/javascript\1|application\/javascript\1)[^'"]*\1/;

async function htmlFiles(directory) {
  const found = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) found.push(...await htmlFiles(path));
    else if (entry.name.endsWith('.html')) found.push(path);
  }
  return found;
}

export async function collectScriptHashes(distDir = DIST) {
  const hashes = new Set();
  for (const file of await htmlFiles(distDir)) {
    const html = await readFile(file, 'utf8');
    for (const [, attrs, body] of html.matchAll(INLINE_SCRIPT)) {
      if (NON_EXECUTABLE_TYPE.test(attrs)) continue;
      hashes.add(`sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}`);
    }
  }
  return [...hashes].sort();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const hashes = await collectScriptHashes();
  await writeFile(TARGET, `${JSON.stringify(hashes, null, 2)}\n`, 'utf8');
  console.log(`[csp-hashes] wrote ${hashes.length} inline script hashes to ${TARGET}`);
}
