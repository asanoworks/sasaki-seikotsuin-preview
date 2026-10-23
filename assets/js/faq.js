export function initFaq() {
  const immediate = () => matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.hasAttribute('data-export');
  document.querySelectorAll('details.faq-item').forEach(details => {
    const summary = details.querySelector('summary');
    const answer = details.querySelector('.faq-answer');
    if (!summary || !answer || typeof answer.animate !== 'function') return;
    let animation;
    let expanded = details.open;
    details.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || !details.open) return;
      event.preventDefault();
      animation?.cancel();
      animation = undefined;
      expanded = false;
      details.open = false;
      answer.style.overflow = '';
      summary.focus();
    });
    summary.addEventListener('click', event => {
      event.preventDefault();
      expanded = !expanded;
      const current = answer.getBoundingClientRect().height;
      animation?.cancel();
      details.open = true;
      if (immediate()) { details.open = expanded; answer.style.overflow = ''; return; }
      const target = expanded ? answer.scrollHeight : 0;
      answer.style.overflow = 'hidden';
      const running = answer.animate([{ height: `${current}px`, opacity: current ? 1 : 0 }, { height: `${target}px`, opacity: expanded ? 1 : 0 }], { duration: 300, easing: 'ease-in-out' });
      animation = running;
      running.onfinish = () => {
        if (animation !== running) return;
        details.open = expanded;
        answer.style.overflow = '';
        animation = undefined;
      };
    });
  });
}
