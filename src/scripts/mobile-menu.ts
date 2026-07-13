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

function getPanel(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-mobile-menu-panel]');
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
  const button = getOpenButton();
  if (!button) return;
  button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  button.setAttribute('aria-label', expanded ? 'Close menu' : 'Open menu');
}

function hideVisual(): void {
  const root = getRoot();
  if (!root) return;
  document.body.style.overflow = prevOverflow;
  setBackgroundInert(false);
  setExpanded(false);
  root.setAttribute('hidden', '');
}

function handleOutsidePointerDown(event: PointerEvent): void {
  if (!menuOpen) return;
  const panel = getPanel();
  const button = getOpenButton();
  const target = event.target;
  if (!(target instanceof Node) || !panel || !button) return;

  if (!panel.contains(target) && !button.contains(target)) {
    close(false);
  }
}

function addOutsideListener(): void {
  document.addEventListener('pointerdown', handleOutsidePointerDown);
}

function removeOutsideListener(): void {
  document.removeEventListener('pointerdown', handleOutsidePointerDown);
}

function open(): void {
  if (menuOpen) return;
  const root = getRoot();
  if (!root) return;
  menuOpener = document.activeElement instanceof HTMLElement ? document.activeElement : getOpenButton();
  menuOpen = true;
  prevOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  setBackgroundInert(true);
  setExpanded(true);
  root.removeAttribute('hidden');
  addOutsideListener();
}

function close(restoreFocus = true): void {
  if (!menuOpen) return;
  menuOpen = false;
  removeOutsideListener();
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
  const items = root.querySelectorAll<HTMLAnchorElement & { [BOUND]?: boolean }>('[data-menu-item]');

  if (openBtn && !openBtn[BOUND]) {
    openBtn.addEventListener('click', () => {
      if (menuOpen) {
        close(false);
      } else {
        open();
      }
    });
    openBtn[BOUND] = true;
  }
  items.forEach((a) => {
    if (a[BOUND]) return;
    a.addEventListener('click', () => {
      menuOpen = false;
      removeOutsideListener();
      hideVisual();
      menuOpener = null;
    });
    a[BOUND] = true;
  });
}

bindButtons();
