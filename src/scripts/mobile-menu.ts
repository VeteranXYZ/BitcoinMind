// Mobile menu controller.
//
// Browser-back integration: opening the menu pushes a same-URL history entry
// so the back gesture closes the menu instead of navigating. The popstate
// handler is intentionally state-agnostic — if the menu is open, any back
// navigation closes it. We don't inspect history.state because Astro's
// ClientRouter may have replaced our state marker with its own routing info.

let prevOverflow = '';
let menuOpen = false;
let pushed = false;

function getRoot(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-mobile-menu]');
}

function hideVisual(): void {
  const root = getRoot();
  if (!root) return;
  document.body.style.overflow = prevOverflow;
  root.setAttribute('hidden', '');
}

function open(): void {
  if (menuOpen) return;
  const root = getRoot();
  const closeBtn = root?.querySelector<HTMLButtonElement>('[data-menu-close]');
  if (!root || !closeBtn) return;
  menuOpen = true;
  prevOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  root.removeAttribute('hidden');
  history.pushState({ bmMenu: true }, '');
  pushed = true;
  requestAnimationFrame(() => closeBtn.focus());
}

function close(): void {
  if (!menuOpen) return;
  menuOpen = false;
  hideVisual();
  if (pushed) {
    pushed = false;
    // Pop the marker entry so the history stack stays clean.
    // popstate will fire, but its handler is a no-op when menuOpen is false.
    history.back();
  }
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menuOpen) close();
});

// State-agnostic close — any back navigation closes the menu when it's open.
window.addEventListener('popstate', () => {
  if (!menuOpen) return;
  menuOpen = false;
  pushed = false; // browser already popped the marker for us
  hideVisual();
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
    closeBtn.addEventListener('click', close);
    closeBtn[BOUND] = true;
  }
  items.forEach((a) => {
    if (a[BOUND]) return;
    a.addEventListener('click', () => {
      // ClientRouter handles the link click and pushes the new URL.
      // Critical: clear `pushed` BEFORE close() runs, otherwise close() would
      // call history.back() and immediately undo ClientRouter's navigation,
      // making the click feel like "page didn't switch".
      pushed = false;
      menuOpen = false;
      hideVisual();
    });
    a[BOUND] = true;
  });
}

document.addEventListener('astro:page-load', bindButtons);
bindButtons();
