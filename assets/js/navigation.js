export function initNavigation() {
  const desktopToggle = document.querySelector('[data-dropdown-toggle]');
  const dropdown = document.querySelector('[data-dropdown]');
  const setDropdown = open => {
    if (!desktopToggle || !dropdown) return;
    desktopToggle.setAttribute('aria-expanded', String(open));
    dropdown.hidden = !open;
  };
  desktopToggle?.addEventListener('click', () => setDropdown(desktopToggle.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('click', event => {
    if (!desktopToggle?.contains(event.target) && !dropdown?.contains(event.target)) setDropdown(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && desktopToggle?.getAttribute('aria-expanded') === 'true') {
      setDropdown(false); desktopToggle.focus();
    }
  });
  document.querySelector('[data-desktop-nav]')?.addEventListener('focusout', event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setDropdown(false);
  });

  const toggle = document.querySelector('[data-menu-toggle]');
  const panel = document.querySelector('[data-mobile-menu]');
  const overlay = document.querySelector('[data-menu-overlay]');
  if (!toggle || !panel) return;
  let open = false;
  let finishTimer;
  let previousFocus;
  let previousOverflow;
  const inertState = new Map();
  const immediate = () => matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.hasAttribute('data-export');
  const focusable = () => [...panel.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]')].filter(element => !element.closest('[hidden], [inert]') && element.getClientRects().length);
  const lock = () => {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const background = [...document.querySelectorAll('#main-content, [data-site-footer]'), ...document.querySelectorAll('[data-header] a, [data-header] button')];
    background.forEach(element => {
      if (element === toggle || panel.contains(element) || element.contains(panel)) return;
      inertState.set(element, element.inert); element.inert = true;
    });
  };
  const unlock = () => {
    document.body.style.overflow = previousOverflow || '';
    inertState.forEach((value, element) => { element.inert = value; });
    inertState.clear();
  };
  const setMenu = (next, restoreFocus = true) => {
    if (open === next) return;
    clearTimeout(finishTimer);
    open = next;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    if (open) {
      previousFocus = document.activeElement;
      lock();
      panel.hidden = false;
      panel.inert = false;
      if (overlay) { overlay.hidden = false; overlay.inert = false; }
      panel.getBoundingClientRect();
      panel.classList.add('is-open');
      overlay?.classList.add('is-open');
      (focusable()[0] || panel).focus({ preventScroll: true });
      setDropdown(false);
    } else {
      panel.classList.remove('is-open');
      overlay?.classList.remove('is-open');
      panel.inert = true;
      if (overlay) overlay.inert = true;
      unlock();
      if (restoreFocus) (previousFocus?.isConnected ? previousFocus : toggle).focus({ preventScroll: true });
      const finish = () => {
        if (open) return;
        panel.hidden = true;
        if (overlay) overlay.hidden = true;
      };
      if (immediate()) finish(); else finishTimer = setTimeout(finish, 460);
    }
  };
  toggle.addEventListener('click', () => setMenu(!open));
  panel.querySelectorAll('[data-menu-close]').forEach(button => button.addEventListener('click', () => setMenu(false)));
  overlay?.addEventListener('click', () => setMenu(false));
  panel.querySelectorAll('a[href]').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (!open) return;
    if (event.key === 'Escape') { event.preventDefault(); setMenu(false); }
    if (event.key !== 'Tab') return;
    const items = focusable();
    const first = items[0] || panel;
    const last = items.at(-1) || panel;
    if (event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) {
      event.preventDefault(); first.focus();
    }
  });
  panel.querySelectorAll('[data-submenu-toggle]').forEach(button => {
    const list = document.getElementById(button.getAttribute('aria-controls'));
    button.addEventListener('click', () => {
      if (!list) return;
      const expanded = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(expanded));
      list.hidden = !expanded;
    });
  });
  matchMedia('(min-width: 1101px)').addEventListener('change', event => {
    if (event.matches && open) setMenu(false, false);
    if (!event.matches) setDropdown(false);
  });
}
