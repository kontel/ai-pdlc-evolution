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
      closeBtn?.focus();
    });
  }

  function closePanel(restoreFocus = true) {
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
    if (restoreFocus) toggle.focus();
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
    if (e.key === 'Tab' && panel.classList.contains('is-open')) {
      const focusable = [...panel.querySelectorAll('a[href], button')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!panel.contains(document.activeElement)) {
        e.preventDefault();
        first?.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
    if (e.key === 'Escape' && panel.classList.contains('is-open')) {
      e.preventDefault();
      closePanel();
      toggle.focus();
    }
  });

  document.querySelectorAll('#sectionNavList a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      closePanel(false);
      const target = document.getElementById(link.dataset.sectionId);
      target?.setAttribute('tabindex', '-1');
      target?.focus({ preventScroll: true });
    });
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

// Interactive agent loop visual
(function () {
  const lab = document.querySelector('.agent-loop-lab');
  if (!lab) return;

  const steps = {
    trigger: {
      label: 'Step 1',
      title: 'Trigger: the user frames the outcome',
      body: 'The agent needs a useful starting point: the product goal, constraints, success measure, and permission boundary. A good trigger sounds like "find the highest-risk assumption in this onboarding idea and propose the cheapest test," not "think about onboarding."',
      note: 'Product lens: the PM or PE owns the outcome and the decision boundary before the agent starts working.'
    },
    reason: {
      label: 'Step 2',
      title: 'Reason: the model turns intent into a path',
      body: 'The reasoning model interprets the goal, breaks it into smaller decisions, weighs uncertainty, and chooses what to do next. For product work, this is where a vague ask becomes a test plan, risk scan, prototype brief, or escalation package.',
      note: 'Product lens: the model is useful when the problem has a clear goal but the path is not known in advance.'
    },
    memory: {
      label: 'Step 3',
      title: 'Memory: the agent carries the right context forward',
      body: 'Memory is not just chat history. It includes the current task, prior product decisions, customer evidence, reusable policies, and lessons from earlier outcomes. Good context engineering keeps the signal and drops stale noise.',
      note: 'Product lens: memory turns one-off automation into compounding product judgment, but unmanaged memory can create drift.'
    },
    tools: {
      label: 'Step 4',
      title: 'Tools: intent becomes real action',
      body: 'Tools let the agent search, query analytics, update tickets, inspect files, run tests, or deploy a prototype. The model may decide which tool to use, but the system still needs typed inputs, permissions, logs, and safe execution boundaries.',
      note: 'Product lens: tools determine what the agent can actually change, so tool access should map to risk and trust.'
    },
    plan: {
      label: 'Step 5',
      title: 'Planning + reflection: the loop corrects itself',
      body: 'Planning decomposes the task; reflection checks whether the last action improved the situation. If confidence rises, the agent continues. If it gets stuck, sees conflicting evidence, or hits a policy boundary, it escalates.',
      note: 'Product lens: the strongest agent systems are governed by confidence thresholds, not by the illusion that every task should finish autonomously.'
    },
    environment: {
      label: 'Step 6',
      title: 'Act + learn: the environment sends feedback',
      body: 'The environment is where work becomes observable: product analytics, support queues, codebases, calendars, documents, customer conversations, or production systems. The agent acts, reads feedback, and either reports an answer or starts another loop.',
      note: 'Product lens: feedback closes the PDLC loop. Without evaluation and observability, an agent is just faster uncertainty.'
    }
  };

  const svg = lab.querySelector('.agent-loop-svg');
  const label = document.getElementById('agentLoopStepLabel');
  const title = document.getElementById('agentLoopStepTitle');
  const body = document.getElementById('agentLoopStepBody');
  const note = document.getElementById('agentLoopProductNote');
  const controls = lab.querySelectorAll('.agent-loop-control');
  const svgTargets = lab.querySelectorAll('[data-agent-step]:not(.agent-loop-control)');

  function activate(stepKey) {
    const step = steps[stepKey] || steps.trigger;
    if (label) label.textContent = step.label;
    if (title) title.textContent = step.title;
    if (body) body.textContent = step.body;
    if (note) note.textContent = step.note;

    controls.forEach((control) => {
      const isActive = control.dataset.agentStep === stepKey;
      control.classList.toggle('active', isActive);
      control.setAttribute('aria-pressed', String(isActive));
    });

    svgTargets.forEach((target) => {
      target.classList.toggle('is-active', target.dataset.agentStep === stepKey);
    });
    svg?.classList.add('is-filtered');
  }

  controls.forEach((control) => {
    control.addEventListener('click', () => activate(control.dataset.agentStep));
  });
  svgTargets.forEach((target) => {
    target.addEventListener('click', () => activate(target.dataset.agentStep));
    target.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activate(target.dataset.agentStep);
      }
    });
  });

  activate('trigger');
})();

// Scroll progress
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = document.getElementById('progressBar');
  if (progress) progress.style.width = (docHeight > 0 ? scrollTop / docHeight : 0) * 100 + '%';
  document.getElementById('scrollTop')?.classList.toggle('visible', scrollTop > 400);
});

// Fade-in animations
document.documentElement.classList.add('atlas-js');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Research atlas: progressively enhance the complete, always-readable document.
(function () {
  const map = document.getElementById('sectionMap');
  const search = document.getElementById('atlasSearch');
  if (!map || !search) return;

  const topics = {
    summary: 'delivery', legacy: 'delivery', capabilities: 'systems',
    evolution: 'delivery', teams: 'people', discipline: 'systems',
    'beyond-code': 'delivery', roadmap: 'delivery', risks: 'systems',
    future: 'systems', 'product-engineer': 'people',
    'agent-architecture': 'systems', sources: 'reference', changelog: 'reference'
  };
  const filters = [...document.querySelectorAll('.atlas-filters button')];
  const count = document.getElementById('atlasResultCount');
  const empty = document.getElementById('atlasEmpty');
  const normalize = text => text.replace(/\s+/g, ' ').trim().toLowerCase();
  const cleanHeading = heading => {
    const clone = heading.cloneNode(true);
    clone.querySelectorAll('.anchor-link, .nav-new, .ev').forEach(el => el.remove());
    return clone.textContent.replace(/\s+/g, ' ').trim();
  };

  const entries = [...map.querySelectorAll('.section-tile')].map(tile => {
    const section = document.getElementById(tile.dataset.sectionId);
    const headings = [...(section?.querySelectorAll('h3[id]') || [])];
    const blocks = [...(section?.querySelectorAll('h3[id], p, td, li') || [])].map(el => {
      const text = el.matches('h3') ? cleanHeading(el) : el.textContent.replace(/\s+/g, ' ').trim();
      return { el, text, normalized: normalize(text) };
    });
    const match = document.createElement('span');
    match.className = 'section-tile-match';
    match.hidden = true;
    tile.append(match);

    // An outline exposes the shape of a long lens before the reader dives in.
    const header = section?.querySelector('.section-header');
    if (header && headings.length) {
      const outline = document.createElement('div');
      outline.className = 'section-outline';
      outline.setAttribute('role', 'navigation');
      outline.setAttribute('aria-label', `Topics in ${tile.querySelector('.section-tile-name').textContent}`);
      const label = document.createElement('span');
      label.textContent = `In this lens / ${headings.length} topics`;
      const list = document.createElement('ol');
      headings.forEach(heading => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = cleanHeading(heading);
        item.append(link);
        list.append(item);
      });
      outline.append(label, list);
      header.append(outline);
    }
    return {
      tile, section, headings, blocks, match,
      href: tile.getAttribute('href'),
      topic: topics[tile.dataset.sectionId],
      title: normalize(tile.querySelector('.section-tile-name').textContent),
      text: normalize(section?.textContent || '')
    };
  });
  let activeTopic = 'all';

  function filterIndex() {
    const query = normalize(search.value);
    let visible = 0;
    entries.forEach(entry => {
      const matches = (!query || entry.text.includes(query) || entry.title.includes(query)) &&
        (activeTopic === 'all' || entry.topic === activeTopic);
      entry.tile.hidden = !matches;
      entry.tile.setAttribute('href', entry.href);
      entry.match.hidden = true;
      if (!matches) return;
      visible++;
      if (!query || entry.title.includes(query)) return;

      const block = entry.blocks.find(block => block.el.matches('h3') && block.normalized.includes(query)) ||
        entry.blocks.find(block => block.normalized.includes(query));
      if (!block) return;
      const index = block.normalized.indexOf(query);
      const start = Math.max(0, index - 35);
      const snippet = block.text.slice(start, start + 150);
      entry.match.textContent = `${start ? '\u2026' : ''}${snippet}${start + 150 < block.text.length ? '\u2026' : ''}`;
      entry.match.hidden = false;
      // Link directly to the matching subsection when its heading is available.
      const heading = entry.headings.filter(heading => heading === block.el ||
        (heading.compareDocumentPosition(block.el) & Node.DOCUMENT_POSITION_FOLLOWING)).pop();
      if (heading) entry.tile.setAttribute('href', `#${heading.id}`);
    });
    count.textContent = query || activeTopic !== 'all' ? `${visible} of ${entries.length} lenses` : `${entries.length} lenses`;
    empty.hidden = visible !== 0;
    map.classList.toggle('is-filtered', Boolean(query) || activeTopic !== 'all');
  }
  search.addEventListener('input', filterIndex);
  filters.forEach(button => button.addEventListener('click', () => {
    activeTopic = button.dataset.topic;
    filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    filterIndex();
  }));
  document.getElementById('atlasReset')?.addEventListener('click', () => {
    search.value = '';
    activeTopic = 'all';
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.topic === 'all')));
    filterIndex();
    search.focus();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey ||
        event.target.closest('input, textarea, select, [contenteditable="true"]') ||
        document.body.classList.contains('section-nav-open') ||
        document.getElementById('infographicFullscreen')?.classList.contains('is-open')) return;
    event.preventDefault();
    search.scrollIntoView({ block: 'center' });
    search.focus({ preventScroll: true });
  });
  document.querySelector('.atlas-search').hidden = false;
  document.querySelector('.atlas-index-tools').hidden = false;
  filterIndex();

  const guide = document.getElementById('readingGuide');
  const next = document.getElementById('readingNext');
  const progress = document.getElementById('readingProgress');
  if (!guide || !next || !progress) return;
  let scheduled = false;
  function updateGuide() {
    scheduled = false;
    let currentIndex = -1;
    entries.forEach((entry, index) => {
      if (entry.section && entry.section.getBoundingClientRect().top <= 145) currentIndex = index;
    });
    guide.hidden = currentIndex < 0;
    if (currentIndex < 0) return;
    const current = entries[currentIndex];
    document.getElementById('readingNumber').textContent = `Lens ${current.tile.querySelector('.section-tile-num').textContent} / ${entries.length}`;
    document.getElementById('readingTitle').textContent = current.tile.querySelector('.section-tile-name').textContent;
    const following = entries[currentIndex + 1];
    next.href = following ? following.href : '#sectionMap';
    next.setAttribute('aria-label', following ? `Next: ${following.tile.querySelector('.section-tile-name').textContent}` : 'Return to research index');
    next.firstChild.textContent = following ? 'Next ' : 'Index ';
    const bounds = current.section.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, (145 - bounds.top) / bounds.height));
    progress.style.width = `${fraction * 100}%`;
  }
  function scheduleGuide() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateGuide);
    }
  }
  window.addEventListener('scroll', scheduleGuide, { passive: true });
  window.addEventListener('resize', scheduleGuide);
  updateGuide();
})();

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
