function update(): void {
  const bar = document.getElementById('pb');
  if (!bar) return;
  const tot = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.width = tot > 0 ? (window.scrollY / tot) * 100 + '%' : '0%';
}

window.addEventListener('scroll', update, { passive: true });
update();
