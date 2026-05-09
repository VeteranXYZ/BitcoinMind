function getRoot(target: Element | null): HTMLElement | null {
  return target?.closest<HTMLElement>('[data-explore-root]') ?? null;
}

function getButton(root: HTMLElement): HTMLButtonElement | null {
  return root.querySelector<HTMLButtonElement>('[data-explore-button]');
}

function getMenu(root: HTMLElement): HTMLElement | null {
  return root.querySelector<HTMLElement>('[data-explore-menu]');
}

function setOpen(root: HTMLElement, open: boolean): void {
  const button = getButton(root);
  const menu = getMenu(root);
  if (!button || !menu) return;
  button.setAttribute('aria-expanded', open ? 'true' : 'false');
  menu.hidden = !open;
}

function isOpen(root: HTMLElement): boolean {
  return getButton(root)?.getAttribute('aria-expanded') === 'true';
}

function closeAll(except?: HTMLElement): void {
  document.querySelectorAll<HTMLElement>('[data-explore-root]').forEach((root) => {
    if (root !== except) setOpen(root, false);
  });
}

function focusFirstItem(root: HTMLElement): void {
  const first = root.querySelector<HTMLAnchorElement>('[data-explore-item]');
  first?.focus();
}

document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const button = target?.closest<HTMLButtonElement>('[data-explore-button]');

  if (button) {
    const root = getRoot(button);
    if (!root) return;
    const nextOpen = !isOpen(root);
    closeAll(root);
    setOpen(root, nextOpen);
    return;
  }

  const item = target?.closest('[data-explore-item]');
  if (item) {
    closeAll();
    return;
  }

  if (!target?.closest('[data-explore-root]')) closeAll();
});

document.addEventListener('keydown', (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const root = getRoot(target);

  if (event.key === 'Escape') {
    const openRoot = Array.from(document.querySelectorAll<HTMLElement>('[data-explore-root]')).find(isOpen);
    if (!openRoot) return;
    event.preventDefault();
    setOpen(openRoot, false);
    getButton(openRoot)?.focus();
    return;
  }

  if (!root || event.key !== 'ArrowDown') return;
  const button = target?.closest('[data-explore-button]');
  if (!button) return;
  event.preventDefault();
  closeAll(root);
  setOpen(root, true);
  focusFirstItem(root);
});

export {};
