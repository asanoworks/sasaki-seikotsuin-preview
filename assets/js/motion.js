export function initMotion() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches || document.documentElement.hasAttribute('data-export') || !('IntersectionObserver' in window)) return;
  const pending = new Set(document.querySelectorAll('section[data-reveal]'));
  const running = new Set();
  let observer;
  const create = () => {
    observer?.disconnect();
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || entry.intersectionRatio < .06) return;
        const section = entry.target.closest('section[data-reveal]');
        if (!section || !pending.has(section)) return;
        pending.delete(section);
        observer.unobserve(entry.target);
        if (typeof section.animate !== 'function') return;
        const animation = section.animate([{ opacity: 0, transform: 'translateY(34px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 1800, easing: 'cubic-bezier(0.25,0.46,0.45,0.94)' });
        running.add(animation);
        animation.onfinish = () => running.delete(animation);
      });
    }, { threshold: 0.06, rootMargin: `0px 0px -${Math.round(innerHeight * .14)}px 0px` });
    pending.forEach(section => {
      const target = section.offsetHeight * .06 > innerHeight * .86 ? section.querySelector('h2, h3, [data-reveal-trigger]') || section : section;
      observer.observe(target);
    });
  };
  create();
  window.addEventListener('resize', create, { passive: true });
  reduced.addEventListener('change', () => {
    if (reduced.matches) { observer.disconnect(); running.forEach(animation => animation.cancel()); running.clear(); }
    else create();
  });
}
