// Global Esc handler is attached once. Per-element handlers re-attach after each swap
// since the menu DOM is replaced.
let prevOverflow = '';

function getRoot(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-mobile-menu]');
}

function close(): void {
  const root = getRoot();
  if (!root) return;
  document.body.style.overflow = prevOverflow;
  root.setAttribute('hidden', '');
}

function open(): void {
  const root = getRoot();
  const closeBtn = root?.querySelector<HTMLButtonElement>('[data-menu-close]');
  if (!root || !closeBtn) return;
  prevOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  root.removeAttribute('hidden');
  requestAnimationFrame(() => closeBtn.focus());
}

// Guard against double-binding when the same DOM node persists across swaps
// (e.g. with transition:persist on an element). Without this, ClientRouter would
// stack listeners on every navigation.
const BOUND = Symbol.for('bm.menu.bound');

function bindButtons(): void {
  const root = getRoot();
  if (!root) return;
  const openBtn = document.querySelector<HTMLButtonElement & { [BOUND]?: boolean }>('[data-menu-open]');
  const closeBtn = root.querySelector<HTMLButtonElement & { [BOUND]?: boolean }>('[data-menu-close]');
  const items = root.querySelectorAll<HTMLAnchorElement & { [BOUND]?: boolean }>('[data-menu-item]');

  if (openBtn && !openBtn[BOUND]) {
    openBtn.addEventListener('click', open);
    openBtn[BOUND] = true;
  }
  if (closeBtn && !closeBtn[BOUND]) {
    closeBtn.addEventListener('click', close);
    closeBtn[BOUND] = true;
  }
  items.forEach((a) => {
    if (a[BOUND]) return;
    a.addEventListener('click', () => setTimeout(close, 120));
    a[BOUND] = true;
  });
}

window.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const root = getRoot();
  if (root && !root.hasAttribute('hidden')) close();
});

document.addEventListener('astro:page-load', bindButtons);
bindButtons();
