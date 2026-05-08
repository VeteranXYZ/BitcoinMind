// Mobile menu controller.
//
let prevOverflow = '';
let menuOpen = false;
let menuOpener: HTMLElement | null = null;

function getRoot(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-mobile-menu]');
}

function getOpenButton(): HTMLButtonElement | null {
  return document.querySelector<HTMLButtonElement>('[data-menu-open]');
}

function getFocusable(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )).filter((el) => !el.hasAttribute('hidden') && el.offsetParent !== null);
}

function setBackgroundInert(inert: boolean): void {
  document.querySelectorAll<HTMLElement>('main, footer').forEach((el) => {
    el.inert = inert;
  });
}

function setExpanded(expanded: boolean): void {
  getOpenButton()?.setAttribute('aria-expanded', expanded ? 'true' : 'false');
}

function hideVisual(): void {
  const root = getRoot();
  if (!root) return;
  document.body.style.overflow = prevOverflow;
  setBackgroundInert(false);
  setExpanded(false);
  root.setAttribute('hidden', '');
}

function open(): void {
  if (menuOpen) return;
  const root = getRoot();
  const closeBtn = root?.querySelector<HTMLButtonElement>('[data-menu-close]');
  if (!root || !closeBtn) return;
  menuOpener = document.activeElement instanceof HTMLElement ? document.activeElement : getOpenButton();
  menuOpen = true;
  prevOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  setBackgroundInert(true);
  setExpanded(true);
  root.removeAttribute('hidden');
  requestAnimationFrame(() => closeBtn.focus());
}

function close(restoreFocus = true): void {
  if (!menuOpen) return;
  menuOpen = false;
  hideVisual();
  if (restoreFocus) menuOpener?.focus();
  menuOpener = null;
}

window.addEventListener('keydown', (e) => {
  if (!menuOpen) return;
  if (e.key === 'Escape') {
    close();
    return;
  }
  if (e.key !== 'Tab') return;

  const root = getRoot();
  if (!root) return;
  const focusable = getFocusable(root);
  if (focusable.length === 0) {
    e.preventDefault();
    return;
  }

  const first = focusable[0]!;
  const last = focusable[focusable.length - 1]!;
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

window.addEventListener('popstate', () => {
  if (menuOpen) close(false);
});

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
    closeBtn.addEventListener('click', () => close());
    closeBtn[BOUND] = true;
  }
  items.forEach((a) => {
    if (a[BOUND]) return;
    a.addEventListener('click', () => {
      menuOpen = false;
      hideVisual();
      menuOpener = null;
    });
    a[BOUND] = true;
  });
}

document.addEventListener('astro:page-load', bindButtons);
bindButtons();
