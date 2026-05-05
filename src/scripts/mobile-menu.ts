// Mobile menu controller.
//
// History integration: opening the menu pushes a marker history entry so the
// browser back button closes the menu instead of navigating away. Pattern:
//   open  -> history.pushState({ bmMenu: true }, '')
//   close (button/Esc) -> history.back() -> popstate fires -> we sync state
//   close (back button) -> popstate fires with non-marker state -> we hide
//   menu item click -> let ClientRouter navigate; the marker entry stays
//                      with the same URL as the previous page, so a single
//                      back from the new page lands on that page anyway.

let prevOverflow = '';
let menuOpen = false;

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
  requestAnimationFrame(() => closeBtn.focus());
}

function close(): void {
  if (!menuOpen) return;
  menuOpen = false;
  hideVisual();
  // If we're still parked on the marker entry we pushed, pop it so the
  // browser history doesn't grow with a redundant duplicate-URL entry.
  if (history.state && (history.state as { bmMenu?: boolean }).bmMenu) {
    history.back();
  }
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menuOpen) close();
});

window.addEventListener('popstate', () => {
  // Back button pressed while menu is open. The marker entry was popped
  // already; just sync our state and hide the overlay.
  if (!menuOpen) return;
  const isMarker = !!(history.state && (history.state as { bmMenu?: boolean }).bmMenu);
  if (!isMarker) {
    menuOpen = false;
    hideVisual();
  }
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
      // ClientRouter handles the link click. We just need to dismiss the
      // overlay — slight delay matches the old animation feel.
      setTimeout(close, 120);
    });
    a[BOUND] = true;
  });
}

document.addEventListener('astro:page-load', bindButtons);
bindButtons();
