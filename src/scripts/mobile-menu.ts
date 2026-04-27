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

function bindButtons(): void {
  const root = getRoot();
  if (!root) return;
  const openBtn = document.querySelector<HTMLButtonElement>('[data-menu-open]');
  const closeBtn = root.querySelector<HTMLButtonElement>('[data-menu-close]');
  const items = root.querySelectorAll<HTMLAnchorElement>('[data-menu-item]');

  openBtn?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  items.forEach((a) => {
    a.addEventListener('click', () => setTimeout(close, 120));
  });
}

window.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const root = getRoot();
  if (root && !root.hasAttribute('hidden')) close();
});

document.addEventListener('astro:page-load', bindButtons);
bindButtons();
