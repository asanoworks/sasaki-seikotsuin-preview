export function initHeader() {
  const header = document.querySelector('[data-header]');
  if (!header) return;
  let scheduled = false;
  const update = () => {
    header.classList.toggle('is-compact', !document.documentElement.hasAttribute('data-export') && window.scrollY > 100);
    scheduled = false;
  };
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
}
