// Per-page IntersectionObserver — disconnect previous before re-init to avoid leaks.
let observer: IntersectionObserver | null = null;

function init(): void {
  observer?.disconnect();
  observer = null;

  const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-frame-node]'));
  const indexItems = Array.from(document.querySelectorAll<HTMLElement>('[data-frame-idx]'));
  if (nodes.length === 0 || indexItems.length === 0) return;

  const setActive = (i: number): void => {
    indexItems.forEach((el, j) => el.classList.toggle('fidx--on', i === j));
  };

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const i = nodes.indexOf(entry.target as HTMLElement);
          if (i >= 0) setActive(i);
        }
      });
    },
    { rootMargin: '-30% 0px -55% 0px', threshold: 0 }
  );
  nodes.forEach((el) => observer!.observe(el));

  indexItems.forEach((item, i) => {
    item.addEventListener('click', () => {
      const target = nodes[i];
      if (!target) return;
      const y = target.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
}

document.addEventListener('astro:page-load', init);
init();
