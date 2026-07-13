interface SavedStudyItem {
  id: string;
  title: string;
  href: string;
  kind: string;
  savedAt: string;
}

interface StudyState {
  version: 1;
  saved: SavedStudyItem[];
  progress: Record<string, number[]>;
}

const STORAGE_KEY = 'bitcoinmind.study.v1';
const EMPTY_STATE: StudyState = { version: 1, saved: [], progress: {} };

function validState(value: unknown): value is StudyState {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<StudyState>;
  if (candidate.version !== 1 || !Array.isArray(candidate.saved) || candidate.saved.length > 1_000) return false;
  const savedIsValid = candidate.saved.every((item) => {
    if (!item || typeof item !== 'object') return false;
    const entry = item as Partial<SavedStudyItem>;
    return typeof entry.id === 'string' && entry.id.length > 0 && entry.id.length <= 200
      && typeof entry.title === 'string' && entry.title.length > 0 && entry.title.length <= 500
      && typeof entry.href === 'string' && entry.href.startsWith('/') && entry.href.length <= 500
      && typeof entry.kind === 'string' && entry.kind.length > 0 && entry.kind.length <= 100
      && typeof entry.savedAt === 'string' && Number.isFinite(Date.parse(entry.savedAt));
  });
  if (!savedIsValid || !candidate.progress || typeof candidate.progress !== 'object' || Array.isArray(candidate.progress)) return false;
  return Object.entries(candidate.progress).every(([pathId, steps]) =>
    pathId.length > 0 && pathId.length <= 200
    && Array.isArray(steps) && steps.length <= 1_000
    && steps.every((step) => Number.isInteger(step) && step >= 0),
  );
}

function readState(): StudyState {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    return validState(parsed) ? parsed : structuredClone(EMPTY_STATE);
  } catch {
    return structuredClone(EMPTY_STATE);
  }
}

function writeState(state: StudyState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('bitcoinmind:study-change'));
    return true;
  } catch {
    setStatus('This browser could not save the study data. Storage may be unavailable or full.');
    return false;
  }
}

function setStatus(message: string): void {
  document.querySelectorAll<HTMLElement>('[data-study-status]').forEach((node) => { node.textContent = message; });
}

function syncSaveButtons(state: StudyState): void {
  document.querySelectorAll<HTMLButtonElement>('[data-study-save]').forEach((button) => {
    const id = button.dataset.studyId ?? '';
    const saved = state.saved.some((item) => item.id === id);
    button.setAttribute('aria-pressed', String(saved));
    button.textContent = saved ? 'Saved' : 'Save';
  });
}

function syncProgressButtons(state: StudyState): void {
  document.querySelectorAll<HTMLButtonElement>('[data-study-progress]').forEach((button) => {
    const pathId = button.dataset.pathId ?? '';
    const stepIndex = Number(button.dataset.stepIndex);
    const done = (state.progress[pathId] ?? []).includes(stepIndex);
    button.setAttribute('aria-pressed', String(done));
    button.textContent = done ? 'Done ✓' : 'Done';
  });
}

function renderLedger(state: StudyState): void {
  document.querySelectorAll<HTMLElement>('[data-study-ledger]').forEach((ledger) => {
    const queue = ledger.querySelector<HTMLUListElement>('[data-study-queue]');
    const empty = ledger.querySelector<HTMLElement>('[data-study-empty]');
    if (queue) {
      queue.replaceChildren(...state.saved.map((item) => {
        const row = document.createElement('li');
        row.className = 'study-queue-item';
        const link = document.createElement('a');
        link.href = item.href;
        link.textContent = item.title;
        const meta = document.createElement('span');
        meta.textContent = item.kind;
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.textContent = 'Remove';
        remove.dataset.studyRemove = item.id;
        row.append(link, meta, remove);
        return row;
      }));
    }
    if (empty) empty.hidden = state.saved.length > 0;

    const resume = ledger.querySelector<HTMLElement>('[data-study-resume]');
    const resumeLink = ledger.querySelector<HTMLAnchorElement>('[data-study-resume-link]');
    const pathEntries = Array.from(document.querySelectorAll<HTMLElement>('[data-study-path]'));
    const nextPath = pathEntries.map((path) => {
      const id = path.dataset.pathId ?? '';
      const title = path.dataset.pathTitle ?? id;
      const count = path.querySelectorAll('[data-study-progress]').length;
      const done = state.progress[id] ?? [];
      const next = Array.from({ length: count }, (_, index) => index).find((index) => !done.includes(index));
      return next === undefined || done.length === 0 ? null : { id, title, next, count };
    }).find(Boolean);
    if (resume && resumeLink) {
      resume.hidden = !nextPath;
      if (nextPath) {
        resumeLink.href = `#${nextPath.id}`;
        resumeLink.textContent = `${nextPath.title} · step ${nextPath.next + 1} of ${nextPath.count}`;
      }
    }
  });
}

function refresh(): void {
  const state = readState();
  syncSaveButtons(state);
  syncProgressButtons(state);
  renderLedger(state);
}

document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const save = target?.closest<HTMLButtonElement>('[data-study-save]');
  if (save) {
    const id = save.dataset.studyId ?? '';
    if (!id) return;
    const state = readState();
    const existing = state.saved.findIndex((item) => item.id === id);
    if (existing >= 0) state.saved.splice(existing, 1);
    else state.saved.push({
      id,
      title: save.dataset.studyTitle ?? id,
      href: save.dataset.studyHref ?? '/paths',
      kind: save.dataset.studyKind ?? 'Resource',
      savedAt: new Date().toISOString(),
    });
    if (writeState(state)) setStatus(existing >= 0 ? 'Removed from the local study list.' : 'Saved in this browser.');
    return;
  }

  const progress = target?.closest<HTMLButtonElement>('[data-study-progress]');
  if (progress) {
    const pathId = progress.dataset.pathId ?? '';
    const stepIndex = Number(progress.dataset.stepIndex);
    if (!pathId || !Number.isInteger(stepIndex)) return;
    const state = readState();
    const completed = new Set(state.progress[pathId] ?? []);
    completed.has(stepIndex) ? completed.delete(stepIndex) : completed.add(stepIndex);
    state.progress[pathId] = Array.from(completed).sort((a, b) => a - b);
    if (writeState(state)) setStatus(completed.has(stepIndex) ? 'Path step completed locally.' : 'Path step reopened.');
    return;
  }

  const remove = target?.closest<HTMLButtonElement>('[data-study-remove]');
  if (remove) {
    const state = readState();
    state.saved = state.saved.filter((item) => item.id !== remove.dataset.studyRemove);
    if (writeState(state)) setStatus('Removed from the local study list.');
    return;
  }

  if (target?.closest('[data-study-export]')) {
    const blob = new Blob([JSON.stringify(readState(), null, 2)], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = 'bitcoinmind-study.json';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(href), 0);
    setStatus('Local study data exported.');
    return;
  }

  if (target?.closest('[data-study-clear]')) {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('bitcoinmind:study-change'));
    setStatus('Local study data cleared.');
  }
});

document.addEventListener('change', async (event) => {
  const input = event.target instanceof HTMLInputElement && event.target.matches('[data-study-import]') ? event.target : null;
  const file = input?.files?.[0];
  if (!input || !file) return;
  try {
    if (file.size > 1_000_000) throw new Error('Study file is too large');
    const parsed = JSON.parse(await file.text());
    if (!validState(parsed)) throw new Error('Unsupported study file');
    if (writeState(parsed)) setStatus('Local study data imported.');
  } catch {
    setStatus('This file is not a valid BitcoinMind study export.');
  } finally {
    input.value = '';
  }
});

window.addEventListener('bitcoinmind:study-change', refresh);
refresh();
