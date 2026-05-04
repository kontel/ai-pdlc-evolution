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
