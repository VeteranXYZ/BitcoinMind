// Category + search filtering for the Library, Texts, and Toolkit lists.
//
// This used to live as an inline <script> in the shared layout, which put
// ~3.1KB of dead JavaScript into all seventeen pages so that three could use
// it. It now ships with the component that needs it.

interface AnalyticsWindow extends Window {
  BitcoinMindAnalytics?: { track: (event: string, params?: Record<string, unknown>) => void };
}

function tokens(value: string | null): string[] {
  return (value ?? '')
    .split('|')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

function update(scope: HTMLElement): void {
  const active = (scope.getAttribute('data-active-filter') || 'all').toLowerCase();
  const input = scope.querySelector<HTMLInputElement>('[data-filter-search]');
  const query = input ? input.value.trim().toLowerCase() : '';
  let visibleCount = 0;

  scope.querySelectorAll<HTMLButtonElement>('[data-filter-button]').forEach((button) => {
    const isActive = (button.getAttribute('data-filter') || '').toLowerCase() === active;
    button.classList.toggle('on', isActive);
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  scope.querySelectorAll<HTMLElement>('[data-filter-card]').forEach((card) => {
    const values = tokens(card.getAttribute('data-filter-values'));
    const search = (card.getAttribute('data-filter-search') || '').toLowerCase();
    const matchesFilter = active === 'all' || values.includes(active);
    const matchesSearch = !query || search.includes(query);
    const show = matchesFilter && matchesSearch;
    card.hidden = !show;
    if (show) visibleCount += 1;
  });

  scope.querySelectorAll<HTMLElement>('[data-filter-group]').forEach((group) => {
    group.hidden = group.querySelectorAll('[data-filter-card]:not([hidden])').length === 0;
  });

  const empty = scope.querySelector<HTMLElement>('[data-filter-empty]');
  if (empty) empty.hidden = visibleCount !== 0;
}

function scopeOf(target: EventTarget | null): HTMLElement | null {
  return target instanceof Element ? target.closest<HTMLElement>('[data-filter-scope]') : null;
}

document.addEventListener('click', (event) => {
  const target = event.target;
  const button = target instanceof Element ? target.closest<HTMLButtonElement>('[data-filter-button]') : null;
  if (!button) return;
  const scope = scopeOf(button);
  if (!scope) return;

  const selectedFilter = button.getAttribute('data-filter') || 'all';
  scope.setAttribute('data-active-filter', selectedFilter);
  update(scope);

  // Category choices are a recommended `select_content` event. The free-form
  // search box is deliberately never reported.
  (window as AnalyticsWindow).BitcoinMindAnalytics?.track('select_content', {
    content_type: 'resource_filter',
    item_id: `${location.pathname}:${selectedFilter.toLowerCase()}`,
  });
});

document.addEventListener('input', (event) => {
  const target = event.target;
  if (!(target instanceof Element) || !target.matches('[data-filter-search]')) return;
  const scope = scopeOf(target);
  if (scope) update(scope);
});

document.querySelectorAll<HTMLElement>('[data-filter-scope]').forEach(update);

export {};
