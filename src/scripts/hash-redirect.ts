// Backward-compatibility for the old SPA hash routes.
// Runs synchronously in <head>, before any rendering, so legacy share links land correctly.
const map: Record<string, string> = {
  '#home': '/',
  '#start': '/start',
  '#books': '/books',
  '#essays': '/essays',
  '#tools': '/tools',
  '#frames': '/frames',
  '#frames-1': '/frames/1',
  '#frames-2': '/frames/2',
  '#about': '/about',
  '#notes': '/notes',
};

const target = map[window.location.hash];
if (target && window.location.pathname === '/') {
  window.location.replace(target + window.location.search);
}
