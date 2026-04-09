// Hero infographic: open/close fullscreen (grayscale inline, color in fullscreen)
(function () {
  const trigger = document.getElementById('heroInfographicTrigger');
  const fullscreen = document.getElementById('infographicFullscreen');
  const closeBtn = document.getElementById('infographicFullscreenClose');
  const backdrop = document.getElementById('infographicFullscreenBackdrop');

  function openFullscreen() {
    if (!fullscreen) return;
    fullscreen.hidden = false;
    fullscreen.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
  }

  function closeFullscreen() {
    if (!fullscreen) return;
    fullscreen.classList.remove('is-open');
    document.body.style.overflow = '';
    fullscreen.addEventListener('transitionend', function onEnd() {
      fullscreen.removeEventListener('transitionend', onEnd);
      fullscreen.hidden = true;
    }, { once: true });
  }

  trigger?.addEventListener('click', openFullscreen);
  closeBtn?.addEventListener('click', closeFullscreen);
  backdrop?.addEventListener('click', closeFullscreen);
  fullscreen?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeFullscreen();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fullscreen?.classList.contains('is-open')) closeFullscreen();
  });
})();

// Section navigation panel (all viewports)
(function () {
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

  function togglePanel() {
    if (panel.classList.contains('is-open')) closePanel();
    else openPanel();
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePanel();
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
})();

// Scroll to top button
document.getElementById('scrollTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Tabs - support multiple tab groups
document.querySelectorAll('.tabs').forEach(tabGroup => {
  tabGroup.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      const section = tabGroup.parentElement;
      tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      section.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + tab).classList.add('active');
    });
  });
});

// Scroll progress
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  document.getElementById('progressBar').style.width = (scrollTop / docHeight) * 100 + '%';
  document.getElementById('scrollTop').classList.toggle('visible', scrollTop > 400);
});

// Fade-in animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Dynamic freshness chips for section nav + hero map
(function () {
  const freshnessTargets = document.querySelectorAll('#sectionNavList a[data-updated], #sectionMap a[data-updated]');
  if (!freshnessTargets.length) return;

  function parseDate(raw) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw || '');
    if (!match) return null;
    return {
      year: Number(match[1]),
      month: Number(match[2]),
      day: Number(match[3])
    };
  }

  function diffInDays(fromParts, toDate) {
    const fromUtc = Date.UTC(fromParts.year, fromParts.month - 1, fromParts.day);
    const toUtc = Date.UTC(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
    return Math.max(0, Math.floor((toUtc - fromUtc) / 86400000));
  }

  function formatRelativeDays(days) {
    if (days === 0) return 'Updated today';
    if (days === 1) return 'Updated 1d ago';
    return `Updated ${days}d ago`;
  }

  function formatAbsoluteDate(parts) {
    const date = new Date(parts.year, parts.month - 1, parts.day);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  function stateForDays(days) {
    if (days <= 7) return 'strong';
    if (days <= 21) return 'medium';
    return 'muted';
  }

  freshnessTargets.forEach((target) => {
    const rawDate = target.dataset.updated;
    const parts = parseDate(rawDate);
    if (!parts) return;

    const note = target.dataset.updateNote;
    const days = diffInDays(parts, new Date());
    const state = stateForDays(days);
    const chip = target.querySelector('.nav-freshness');
    if (!chip) return;

    chip.textContent = formatRelativeDays(days);
    chip.classList.remove('nav-freshness--recent', 'nav-freshness--weeks', 'nav-freshness--stable');
    chip.classList.add(
      state === 'strong' ? 'nav-freshness--recent' :
      state === 'medium' ? 'nav-freshness--weeks' :
      'nav-freshness--stable'
    );

    target.classList.remove('freshness-strong', 'freshness-medium', 'freshness-muted');
    target.classList.add(`freshness-${state}`);

    const absolute = formatAbsoluteDate(parts);
    const title = note ? `${note} · Last updated ${absolute}` : `Last updated ${absolute}`;
    chip.title = title;
    target.title = title;
  });
})();

// Active section highlight in section nav
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('#sectionNavList a[href^="#"], #sectionMap a[href^="#"]');
function updateActiveSectionNav() {
  let current = '';
  const y = window.scrollY;
  sections.forEach((section) => {
    if (y >= section.offsetTop - 100) current = section.getAttribute('id');
  });
  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
}
window.addEventListener('scroll', updateActiveSectionNav, { passive: true });
updateActiveSectionNav();

// Roadmap item toggle (event delegation)
document.querySelector('.roadmap')?.addEventListener('click', (e) => {
  const item = e.target.closest('.roadmap-item');
  if (item) item.classList.toggle('open');
});

// Animate task bars on scroll
const taskObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.task-bar').forEach(bar => {
        const w = bar.style.width;
        bar.style.width = '0%';
        requestAnimationFrame(() => { requestAnimationFrame(() => { bar.style.width = w; }); });
      });
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.task-spectrum').forEach(el => taskObserver.observe(el));

// Anchor copy-link buttons
document.querySelectorAll('.anchor-link').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const url = window.location.origin + window.location.pathname + this.getAttribute('href');
    navigator.clipboard.writeText(url).then(() => {
      this.classList.add('anchor-link-copied');
      setTimeout(() => this.classList.remove('anchor-link-copied'), 1400);
    });
  });
});
