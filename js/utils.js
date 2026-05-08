export function initScrollProgress() {
  const bar = document.querySelector('[data-scroll="progress"]');
  const topBtn = document.querySelector('[data-scroll="top"]');
  if (!bar && !topBtn) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (scrollTop / docHeight) * 100 + '%';
    topBtn?.classList.toggle('visible', scrollTop > 400);
  });
}

export function initFadeIn() {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
}

export function initFreshness() {
  const targets = document.querySelectorAll('#sectionNavList a[data-updated], #sectionMap a[data-updated]');
  if (!targets.length) return;

  function parseDate(raw) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw ?? '');
    return m ? { year: +m[1], month: +m[2], day: +m[3] } : null;
  }

  function diffDays(parts, now) {
    const a = Date.UTC(parts.year, parts.month - 1, parts.day);
    const b = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.max(0, Math.floor((b - a) / 86_400_000));
  }

  function relativeLabel(days) {
    if (days === 0) return 'Updated today';
    if (days === 1) return 'Updated 1d ago';
    return `Updated ${days}d ago`;
  }

  function absoluteLabel(parts) {
    return new Date(parts.year, parts.month - 1, parts.day)
      .toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function stateFor(days) {
    if (days <= 7) return 'strong';
    if (days <= 21) return 'medium';
    return 'muted';
  }

  const now = new Date();
  targets.forEach((target) => {
    const parts = parseDate(target.dataset.updated);
    if (!parts) return;
    const days = diffDays(parts, now);
    const state = stateFor(days);
    const chip = target.querySelector('.nav-freshness');
    if (!chip) return;

    chip.textContent = relativeLabel(days);
    chip.classList.remove('nav-freshness--recent', 'nav-freshness--weeks', 'nav-freshness--stable');
    chip.classList.add(
      state === 'strong' ? 'nav-freshness--recent' :
      state === 'medium' ? 'nav-freshness--weeks' :
      'nav-freshness--stable'
    );
    target.classList.remove('freshness-strong', 'freshness-medium', 'freshness-muted');
    target.classList.add(`freshness-${state}`);

    const abs = absoluteLabel(parts);
    const tip = target.dataset.updateNote ? `${target.dataset.updateNote} · Last updated ${abs}` : `Last updated ${abs}`;
    chip.title = tip;
    target.title = tip;
  });
}

export function initActiveSection() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#sectionNavList a[href^="#"], #sectionMap a[href^="#"]');

  function update() {
    let current = '';
    const y = window.scrollY;
    sections.forEach((s) => { if (y >= s.offsetTop - 100) current = s.id; });
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

export function initRoadmap() {
  document.querySelector('.roadmap')?.addEventListener('click', (e) => {
    const item = e.target.closest('.roadmap-item');
    if (item) item.classList.toggle('open');
  });
}

export function initTaskBars() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.task-bar').forEach((bar) => {
          const w = bar.style.width;
          bar.style.width = '0%';
          requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.width = w; }));
        });
      });
    },
    { threshold: 0.2 }
  );
  document.querySelectorAll('.task-spectrum').forEach((el) => observer.observe(el));
}

export function initAnchorLinks() {
  document.querySelectorAll('.anchor-link').forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const url = window.location.origin + window.location.pathname + this.getAttribute('href');
      navigator.clipboard.writeText(url).then(() => {
        this.classList.add('anchor-link-copied');
        setTimeout(() => this.classList.remove('anchor-link-copied'), 1400);
      });
    });
  });
}
