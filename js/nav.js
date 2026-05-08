export function initSectionNav() {
  const toggle = document.getElementById('sectionNavToggle');
  const panel = document.getElementById('sectionNavPanel');
  const backdrop = document.getElementById('sectionNavBackdrop');
  const closeBtn = document.getElementById('sectionNavClose');
  if (!toggle || !panel || !backdrop) return;

  let closeTimer = null;

  function openPanel() {
    clearTimeout(closeTimer);
    backdrop.removeAttribute('hidden');
    panel.removeAttribute('hidden');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('section-nav-open');
    requestAnimationFrame(() => {
      backdrop.classList.add('is-visible');
      panel.classList.add('is-open');
    });
    closeBtn?.focus();
  }

  function closePanel() {
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('section-nav-open');
    backdrop.classList.remove('is-visible');
    panel.classList.remove('is-open');
    clearTimeout(closeTimer);
    let finished = false;
    function done() {
      if (finished) return;
      finished = true;
      backdrop.setAttribute('hidden', '');
      panel.setAttribute('hidden', '');
    }
    backdrop.addEventListener(
      'transitionend',
      function onBackdropEnd(e) {
        if (e.propertyName !== 'opacity') return;
        backdrop.removeEventListener('transitionend', onBackdropEnd);
        done();
      },
      { once: true }
    );
    closeTimer = window.setTimeout(done, 320);
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (panel.classList.contains('is-open')) closePanel();
    else openPanel();
  });
  closeBtn?.addEventListener('click', () => closePanel());
  backdrop.addEventListener('click', () => closePanel());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) {
      e.preventDefault();
      closePanel();
      toggle.focus();
    }
  });

  document.querySelectorAll('#sectionNavList a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => closePanel());
  });
}

export function initScrollTop() {
  const btn = document.querySelector('[data-scroll="top"]');
  btn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
