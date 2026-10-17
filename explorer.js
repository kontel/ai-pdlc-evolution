// PDLC Explorer — interactive structural view in the hero (replaces the static poster).
// Three views share one card: lifecycle effort by era, the J-curve, and the operating model.
// All numbers in the lifecycle and curve views are an illustrative model (see the notes in
// index.html); stats quoted in detail panels are sourced and carry evidence tags.
(function () {
  const root = document.getElementById('pdlcExplorer');
  if (!root) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ev = (k, label, title) => `<span class="ev ev--${k}" title="${title}">${label}</span>`;
  const secLink = (href, label) => `<a href="${href}" class="pdx-link">${label} &rarr;</a>`;

  /* ---------- View switcher ---------- */
  let onCurveShown = null; // set by the J-curve view; re-lays out once its panel has a width
  const tabs = [...root.querySelectorAll('.pdx-views [role="tab"]')];
  const panels = [...root.querySelectorAll('.pdx-panel')];
  function showView(id, focus) {
    tabs.forEach((t) => {
      const on = t.dataset.view === id;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    panels.forEach((p) => { p.hidden = p.dataset.view !== id; });
    if (id !== 'flow') stopPlay();
    if (id === 'curve' && onCurveShown) onCurveShown();
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => showView(t.dataset.view));
    t.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      showView(next.dataset.view, true);
    });
  });

  /* ---------- View 1: where the effort goes ---------- */
  const STAGES = [
    { id: 'discover', name: 'Discover' },
    { id: 'specify', name: 'Specify' },
    { id: 'build', name: 'Build' },
    { id: 'verify', name: 'Verify' },
    { id: 'release', name: 'Release' },
    { id: 'operate', name: 'Operate &amp; learn' },
  ];
  // effort = % of one story's delivery effort; agent = share of that stage done by agents.
  const ERAS = {
    legacy: {
      label: 'Pre-AI',
      effort: [15, 10, 40, 15, 10, 10],
      agent: [0, 0, 0, 0, 0, 0],
      bottleneck: 'build',
      summary: '<strong>Bottleneck: writing code.</strong> Humans do all of the work, and ceremonies quietly cost about 10% of capacity (1.1).',
    },
    assist: {
      label: 'Assistants &middot; 2025',
      effort: [14, 10, 30, 24, 12, 10],
      agent: [0.15, 0.1, 0.4, 0.1, 0.25, 0.1],
      bottleneck: 'verify',
      summary: '<strong>Bottleneck moves to review.</strong> Code gets cheaper to write; checking it doesn&rsquo;t. The queue moves from the editor to the pull request (1.5).',
    },
    agents: {
      label: 'Agents &middot; 2026',
      effort: [12, 18, 14, 32, 12, 12],
      agent: [0.4, 0.35, 0.8, 0.5, 0.6, 0.45],
      bottleneck: 'verify',
      summary: '<strong>Bottleneck: verification and human attention.</strong> The effort freed from coding is absorbed by specifying intent and deciding what is safe to ship. Practitioners report a ceiling of about 8&ndash;12 parallel agents per person (10.8).',
    },
  };
  const DETAIL = {
    discover: {
      legacy: 'Interviews, analytics pulls and research synthesis are all done by hand. Insights arrive weeks after the question was asked.',
      assist: 'AI summarises interviews, tickets and analytics, but humans still plan and run every study.',
      agents: 'Agents turn raw signals into JTBD briefs and spin up prototype swarms. Humans choose which bets are worth testing.',
      link: ['#agentic-recipes', '10.4 Agentic recipes'],
    },
    specify: {
      legacy: 'PRDs and tickets are written for humans to interpret, and ambiguity gets resolved in refinement meetings.',
      assist: 'Assistants draft stories and acceptance criteria. Estimation is still planning poker, now against unreliable velocity (1.2).',
      agents: 'The spec becomes the agent&rsquo;s input: requirements, then design, then an ordered task list (Spec Kit, Kiro). Effort <em>grows</em> here because intent is now the scarce input.',
      link: ['#capabilities', '2 Capabilities'],
    },
    build: {
      legacy: 'The constraint. About 40% of a typical story is hand-written code (6.3, illustrative).',
      assist: 'Completion and chat speed up routine code, but gains shrink to 10% or less on complex legacy code. ' + ev('field', 'Field data', 'Stanford research cited by DORA'),
      agents: 'Agents write most routine code, several in parallel. Microsoft engineers merged ~24% more PRs after the CLI-agent rollout. ' + ev('field', 'Field data', 'Telemetry, tens of thousands of engineers'),
      link: ['#verification-bottleneck', '5.6 Verification'],
    },
    verify: {
      legacy: 'Line-by-line review plus a QA phase after development. Slow, but proportionate to how much code exists.',
      assist: 'The queue moves here. DORA found higher AI adoption associated with both higher throughput and higher instability. ' + ev('survey', 'Survey', 'DORA 2025'),
      agents: 'Still the bottleneck. Merged agent PRs need follow-up fixes at 1.62&times; the odds of human PRs. The response is review by exception plus outer-loop acceptance gates. ' + ev('field', 'Field data', 'Repository mining, 6,774 agent PRs'),
      link: ['#verification-bottleneck', '5.6 Verification'],
    },
    release: {
      legacy: 'Change Advisory Boards, manual approvals and release trains.',
      assist: 'Pipelines are partly automated, and AI drafts the CAB risk packs.',
      agents: 'Release sentinels watch canaries and roll back on threshold breaches. Provenance records which agents, models and skills touched each change.',
      link: ['#evolution', '3 Review &amp; Release track'],
    },
    operate: {
      legacy: 'Retros run on feelings, and incidents are diagnosed by hand.',
      assist: 'AI summarises incidents and retros, but humans still triage.',
      agents: 'Agents triage incidents and propose harness fixes; every resolved escalation becomes a policy (the escalation &rarr; RCA flywheel).',
      link: ['#product-engineer', '10.7 RCA flywheel'],
    },
  };

  const stagesEl = document.getElementById('pdxStages');
  const eraSummaryEl = document.getElementById('pdxEraSummary');
  const stageDetailEl = document.getElementById('pdxStageDetail');
  const flowTableEl = document.getElementById('pdxFlowTable');
  const eraBtns = [...root.querySelectorAll('[data-era]')];
  const playBtn = document.getElementById('pdxPlay');
  const MAX_EFFORT = 40;
  let era = 'agents';
  let stage = 'verify';
  let playTimer = null;

  stagesEl.innerHTML = STAGES.map((s) => `
    <button type="button" class="pdx-stage" data-stage="${s.id}" aria-pressed="false">
      <span class="pdx-stage-flag" aria-hidden="true">&#9888; Bottleneck</span>
      <span class="pdx-stage-track"><span class="pdx-stage-total"></span><span class="pdx-bar"><span class="pdx-seg pdx-seg--agent"></span><span class="pdx-seg pdx-seg--human"></span></span></span>
      <span class="pdx-stage-name">${s.name}</span>
    </button>`).join('');
  const stageBtns = [...stagesEl.querySelectorAll('.pdx-stage')];

  function humanShare(e) {
    const d = ERAS[e];
    return Math.round(d.effort.reduce((sum, v, i) => sum + v * (1 - d.agent[i]), 0));
  }

  function renderFlow() {
    const d = ERAS[era];
    stageBtns.forEach((btn, i) => {
      const effort = d.effort[i];
      const agentPct = Math.round(effort * d.agent[i]);
      const humanPct = effort - agentPct;
      btn.style.setProperty('--total', effort / MAX_EFFORT);
      btn.style.setProperty('--agent', effort ? agentPct / effort : 0);
      btn.querySelector('.pdx-stage-total').textContent = effort + '%';
      const isBottleneck = STAGES[i].id === d.bottleneck;
      btn.classList.toggle('no-agent', agentPct === 0);
      btn.classList.toggle('is-bottleneck', isBottleneck);
      btn.classList.toggle('is-active', STAGES[i].id === stage);
      btn.setAttribute('aria-pressed', STAGES[i].id === stage);
      btn.setAttribute('aria-label',
        `${STAGES[i].name.replace('&amp;', 'and')}: ${effort}% of effort, ${humanPct}% human, ${agentPct}% agent${isBottleneck ? ', bottleneck' : ''}`);
    });
    eraBtns.forEach((b) => b.setAttribute('aria-pressed', b.dataset.era === era));
    const human = humanShare(era);
    eraSummaryEl.innerHTML = `<span class="pdx-era-stat"><strong>${human}%</strong> human &middot; <strong>${100 - human}%</strong> agent</span><span>${d.summary}</span>`;
    renderStageDetail();
  }

  function renderStageDetail() {
    const i = STAGES.findIndex((s) => s.id === stage);
    const d = ERAS[era];
    const info = DETAIL[stage];
    const agentPct = Math.round(d.effort[i] * d.agent[i]);
    stageDetailEl.innerHTML = `
      <div class="pdx-detail-head">
        <h4>${STAGES[i].name} <span class="pdx-detail-era">${d.label}</span></h4>
        <span class="pdx-detail-nums">${d.effort[i]}% of effort &middot; ${d.effort[i] - agentPct}% human &middot; ${agentPct}% agent</span>
      </div>
      <p>${info[era]}</p>
      <div class="pdx-detail-compare">
        <span><em>Pre-AI:</em> ${ERAS.legacy.effort[i]}%</span>
        <span><em>2025:</em> ${ERAS.assist.effort[i]}%</span>
        <span><em>2026:</em> ${ERAS.agents.effort[i]}%</span>
        ${secLink(info.link[0], info.link[1])}
      </div>`;
  }

  function renderFlowTable() {
    const head = '<tr><th>Stage</th>' + Object.values(ERAS).map((d) => `<th>${d.label}<br><small>effort / agent share</small></th>`).join('') + '</tr>';
    const rows = STAGES.map((s, i) => '<tr><td>' + s.name + '</td>' + Object.keys(ERAS).map((k) => {
      const d = ERAS[k];
      return `<td>${d.effort[i]}% / ${Math.round(d.agent[i] * 100)}%${d.bottleneck === s.id ? ' &#9888;' : ''}</td>`;
    }).join('') + '</tr>').join('');
    const total = '<tr><td><strong>Human share of effort</strong></td>' + Object.keys(ERAS).map((k) => `<td><strong>${humanShare(k)}%</strong></td>`).join('') + '</tr>';
    flowTableEl.innerHTML = `<table class="compare-table"><thead>${head}</thead><tbody>${rows}${total}</tbody></table>`;
  }

  function setEra(next) { era = next; renderFlow(); }
  function stopPlay() {
    if (!playTimer) return;
    clearInterval(playTimer);
    playTimer = null;
    playBtn.textContent = '▶ Play';
    playBtn.setAttribute('aria-pressed', 'false');
  }
  function startPlay() {
    const order = Object.keys(ERAS);
    setEra(order[0]);
    playBtn.textContent = '❚❚ Pause';
    playBtn.setAttribute('aria-pressed', 'true');
    let i = 0;
    playTimer = setInterval(() => {
      i += 1;
      if (i >= order.length) { stopPlay(); return; }
      setEra(order[i]);
    }, reduceMotion ? 3000 : 2200);
  }

  eraBtns.forEach((b) => b.addEventListener('click', () => { stopPlay(); setEra(b.dataset.era); }));
  playBtn.addEventListener('click', () => (playTimer ? stopPlay() : startPlay()));
  stageBtns.forEach((b) => b.addEventListener('click', () => { stage = b.dataset.stage; renderFlow(); }));

  renderFlow();
  renderFlowTable();

  /* ---------- View 2: the J-curve ---------- */
  const SERIES = [
    { id: 'found', name: 'Foundations first', cls: 'pdx-line--found',
      pts: [[0, 100], [1, 94], [2, 89], [3, 86], [4, 89], [5, 95], [6, 101], [8, 109], [10, 117], [12, 124], [15, 132], [18, 139], [21, 145], [24, 150]] },
    { id: 'bolt', name: 'Tools bolted on', cls: 'pdx-line--bolt',
      pts: [[0, 100], [2, 108], [4, 112], [6, 113], [9, 111], [12, 105], [15, 97], [18, 89], [21, 84], [24, 82]] },
  ];
  const PHASES = [
    { from: 0, to: 2, short: 'P1', name: 'Foundations &amp; Baseline', action: 'Sandboxed agents, an approved skills registry, and a baseline that includes rework.' },
    { from: 2, to: 4, short: 'P2', name: 'Harness Before Scale', action: 'Guides and sensors in version control; deterministic gates on every agent PR; more CI capacity.' },
    { from: 4, to: 6, short: 'P3', name: 'Hybrid Flow &amp; Review by Exception', action: 'Agent lane sized to review capacity; risk-tiered review; outer-loop acceptance suites.' },
    { from: 6, to: 9, short: 'P4', name: 'Restructure: Citizens, Agents, Experts', action: 'Smaller hybrid pods, a governed citizen-build path, and deliberate apprenticeship.' },
    { from: 9, to: 12, short: 'P5', name: 'Continuous Operations', action: 'Self-improving harness, agent provenance in releases, outcome metrics.' },
    { from: 12, to: 24, short: 'Year 2', name: 'Compounding', action: 'Gains compound as the harness, knowledge base and team shape mature (DORA: years two and three).' },
  ];
  const BOLT_NOTE = [
    [0, 3, 'Visible acceleration as assistants and agents land on the old process.'],
    [4, 9, 'Velocity plateaus; integration delays and review queues start to build.'],
    [10, 15, 'Review and debugging become the bottleneck; rework climbs.'],
    [16, 24, 'Delivery stalls as comprehension debt and instability compound.'],
  ];
  // Monotone-ish smoothing: linear interpolation between keypoints, eased per segment.
  const rawAt = (pts, m) => {
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1]; const [x1, y1] = pts[i];
      if (m <= x1) {
        const t = (m - x0) / (x1 - x0);
        const eased = t * t * (3 - 2 * t);
        return y0 + (y1 - y0) * (0.5 * t + 0.5 * eased);
      }
    }
    return pts[pts.length - 1][1];
  };
  const valueAt = (pts, m) => Math.round(rawAt(pts, m));

  const svg = document.getElementById('pdxCurve');
  const tip = document.getElementById('pdxCurveTip');
  const slider = document.getElementById('pdxMonth');
  const monthOut = document.getElementById('pdxMonthOut');
  const curveDetail = document.getElementById('pdxCurveDetail');
  // Layout adapts to the container: a wide layout, and a compact one for phones
  // so SVG text never scales below ~9px.
  let W; let H; let M; let compact;
  const X = (m) => M.l + (m / 24) * (W - M.l - M.r);
  const Y = (v) => M.t + ((160 - v) / (160 - 75)) * (H - M.t - M.b);
  const NS = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs, text) => {
    const n = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
    if (text != null) n.textContent = text;
    return n;
  };
  let cross; let dots; let month = 3;

  function draw() {
    compact = svg.parentElement.clientWidth < 560;
    W = compact ? 400 : 720; H = compact ? 280 : 300;
    M = compact ? { l: 34, r: 40, t: 30, b: 30 } : { l: 44, r: 128, t: 34, b: 34 };
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    [...svg.querySelectorAll(':scope > :not(title)')].forEach((n) => n.remove());

    // Phase bands + labels
    PHASES.forEach((p, i) => {
      svg.appendChild(el('rect', { x: X(p.from), y: M.t, width: X(p.to) - X(p.from), height: H - M.t - M.b, class: 'pdx-band' + (i % 2 ? ' pdx-band--alt' : '') }));
      const label = compact && p.short !== 'Year 2' ? p.short.slice(1) : p.short;
      svg.appendChild(el('text', { x: (X(p.from) + X(p.to)) / 2, y: M.t - 10, 'text-anchor': 'middle', class: 'pdx-band-label' }, label));
    });
    // Grid + y ticks
    [80, 100, 120, 140, 160].forEach((v) => {
      svg.appendChild(el('line', { x1: M.l, x2: W - M.r, y1: Y(v), y2: Y(v), class: v === 100 ? 'pdx-base' : 'pdx-grid' }));
      svg.appendChild(el('text', { x: M.l - 6, y: Y(v) + 4, 'text-anchor': 'end', class: 'pdx-tick' }, v));
    });
    if (!compact) svg.appendChild(el('text', { x: W - M.r + 6, y: Y(100) + 4, class: 'pdx-tick' }, 'baseline'));
    // X ticks
    (compact ? [0, 6, 12, 18, 24] : [0, 3, 6, 9, 12, 15, 18, 21, 24]).forEach((m) => {
      svg.appendChild(el('text', { x: X(m), y: H - M.b + 18, 'text-anchor': 'middle', class: 'pdx-tick' }, m === 0 && !compact ? 'Month 0' : m));
    });
    // Lines + end labels (compact: values only; the legend names the series)
    SERIES.forEach((s) => {
      const d = [];
      for (let m = 0; m <= 24; m += 0.25) d.push(`${d.length ? 'L' : 'M'}${X(m).toFixed(1)},${Y(rawAt(s.pts, m)).toFixed(1)}`);
      svg.appendChild(el('path', { d: d.join(''), class: 'pdx-line ' + s.cls }));
      const end = s.pts[s.pts.length - 1];
      svg.appendChild(el('text', { x: X(24) + 6, y: Y(end[1]) + 4, class: 'pdx-end-label ' + s.cls }, compact ? end[1] : `${s.name} ${end[1]}`));
    });
    // Annotation at the dip
    svg.appendChild(el('text', { x: X(3.4), y: Y(86) + 18, 'text-anchor': 'start', class: 'pdx-annot' }, compact ? 'the dip' : 'the dip: learning + verification tax'));
    // Crosshair + markers
    cross = el('line', { y1: M.t, y2: H - M.b, class: 'pdx-cross' });
    dots = SERIES.map((s) => el('circle', { r: 5, class: 'pdx-dot ' + s.cls }));
    svg.appendChild(cross); dots.forEach((c) => svg.appendChild(c));
    // Hit layer (whole plot, bigger than the marks)
    const hit = el('rect', { x: M.l, y: M.t, width: W - M.l - M.r, height: H - M.t - M.b, class: 'pdx-hit' });
    hit.addEventListener('pointermove', (e) => setMonth(monthFromEvent(e), true));
    hit.addEventListener('pointerdown', (e) => setMonth(monthFromEvent(e), true));
    hit.addEventListener('pointerleave', () => { tip.hidden = true; });
    svg.appendChild(hit);
    setMonth(month, false);
  }

  function setMonth(m, showTip) {
    m = Math.max(0, Math.min(24, Math.round(m)));
    month = m;
    slider.value = m;
    monthOut.textContent = m;
    cross.setAttribute('x1', X(m)); cross.setAttribute('x2', X(m));
    const vals = SERIES.map((s) => valueAt(s.pts, m));
    dots.forEach((c, i) => { c.setAttribute('cx', X(m)); c.setAttribute('cy', Y(rawAt(SERIES[i].pts, m))); });
    const phase = PHASES.find((p) => m >= p.from && m < p.to) || PHASES[PHASES.length - 1];
    const bolt = BOLT_NOTE.find(([a, b]) => m >= a && m <= b);
    curveDetail.innerHTML = `
      <div class="pdx-detail-head">
        <h4>Month ${m} &middot; ${phase.short === 'Year 2' ? 'Year 2' : 'Phase ' + phase.short.slice(1)}: ${phase.name}</h4>
        <span class="pdx-detail-nums">Foundations first <strong>${vals[0]}</strong> &middot; Tools bolted on <strong>${vals[1]}</strong></span>
      </div>
      <p><strong>Roadmap focus:</strong> ${phase.action}</p>
      <p><strong>Without foundations:</strong> ${bolt ? bolt[2] : ''}</p>
      <div class="pdx-detail-compare">${secLink('#five-phase-roadmap', '7.1 Roadmap')} ${secLink('#j-curve', '7.6 J-curve')}</div>`;
    if (showTip) {
      tip.hidden = false;
      tip.innerHTML = `<strong>Month ${m}</strong><span><i class="pdx-key pdx-key--found"></i>${vals[0]}</span><span><i class="pdx-key pdx-key--bolt"></i>${vals[1]}</span>`;
      const box = svg.getBoundingClientRect();
      const px = (X(m) / W) * box.width;
      tip.style.left = Math.min(box.width - 110, Math.max(0, px + 10)) + 'px';
      tip.style.top = ((Y(Math.max(...vals)) / H) * box.height - 10) + 'px';
    }
  }
  function monthFromEvent(e) {
    const box = svg.getBoundingClientRect();
    const xView = ((e.clientX - box.left) / box.width) * W;
    return ((xView - M.l) / (W - M.l - M.r)) * 24;
  }
  slider.addEventListener('input', () => setMonth(+slider.value, false));
  draw();
  // Redraw when the chart crosses the compact breakpoint (and when its tab is first shown,
  // since a hidden panel measures 0px wide).
  function relayout() {
    const w = svg.parentElement.clientWidth;
    if (w && (w < 560) !== compact) draw();
  }
  onCurveShown = relayout;
  if ('ResizeObserver' in window) new ResizeObserver(relayout).observe(svg.parentElement);
  else window.addEventListener('resize', relayout);

  const curveTable = document.getElementById('pdxCurveTable');
  const months = [0, 3, 6, 9, 12, 18, 24];
  curveTable.innerHTML = '<table class="compare-table"><thead><tr><th>Month</th>' + SERIES.map((s) => `<th>${s.name}</th>`).join('') +
    '</tr></thead><tbody>' + months.map((m) => `<tr><td>${m}</td>${SERIES.map((s) => `<td>${valueAt(s.pts, m)}</td>`).join('')}</tr>`).join('') + '</tbody></table>';

  /* ---------- View 3: who does the work ---------- */
  const LAYERS = {
    citizens: {
      title: 'Citizens build', who: 'PMs, designers, analysts, ops',
      owns: 'Problem framing and working prototypes, treated as <em>evidence for a decision</em>, not a backlog item.',
      stat: '32% of organisations skipped a software purchase because agents made an in-house build feasible. ' + ev('survey', 'Survey', 'McKinsey State of AI 2026'),
      risk: 'Antipattern: handing a weekend build to engineers &ldquo;to finish&rdquo;.',
      link: ['#citizens-agents-experts', '4.3'],
    },
    agents: {
      title: 'Agents execute', who: 'Coding, test, review and ops agents, running in sandboxes',
      owns: 'Implementation, refactoring, tests, triage, and first-pass review against deterministic gates.',
      stat: 'Practitioners report ~8&ndash;12 parallel agents per person before human attention runs out, and 2&ndash;4 agents per wave to keep the orchestrator&rsquo;s context clean. ' + ev('practitioner', 'Practitioner', 'Thoughtworks field reports'),
      risk: 'Risk: merged agent PRs need follow-up fixes more often (1.62&times; the odds).',
      link: ['#coordination-patterns', '11.5'],
    },
    experts: {
      title: 'Experts govern', who: 'Engineers, architects, security, platform',
      owns: 'Deciding what is safe to run in production: architecture, review by exception, resilience, cost, and compliance.',
      stat: 'One product function moved from pods of 8&ndash;10 to hybrid teams of 4&ndash;6 supported by agents. ' + ev('practitioner', 'Practitioner', 'Consultancy case example (McKinsey)'),
      risk: 'Risk: no juniors today means no experts tomorrow (the apprenticeship gap).',
      link: ['#apprenticeship-gap', '4.4'],
    },
    harness: {
      title: 'The harness around all three', who: 'Owned by the platform team as a product',
      owns: '<em>Guides</em> (specs, rules, skills), <em>sensors</em> (types, linters, architecture tests), outer-loop gates, and an approved skills/MCP registry.',
      stat: 'A cheaper model went from 3/10 to 10/10 accepted runs with a harness, at about a third less cost than an unharnessed frontier model. ' + ev('practitioner', 'Practitioner', 'Small-n experiment, 10 runs per condition'),
      risk: 'Risk: skills are a supply chain. 76 malicious public skills were found in one scan (8.3).',
      link: ['#harness-engineering', '5.2'],
    },
  };
  const modelBtns = [...root.querySelectorAll('[data-layer-id]')];
  const modelDetail = document.getElementById('pdxModelDetail');
  function showLayer(id) {
    const L = LAYERS[id];
    modelBtns.forEach((b) => {
      const on = b.dataset.layerId === id;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on);
    });
    modelDetail.innerHTML = `
      <div class="pdx-detail-head"><h4>${L.title}</h4><span class="pdx-detail-nums">${L.who}</span></div>
      <p><strong>Owns:</strong> ${L.owns}</p>
      <p>${L.stat}</p>
      <p class="pdx-detail-risk">${L.risk}</p>
      <div class="pdx-detail-compare">${secLink(L.link[0], 'Section ' + L.link[1])}</div>`;
  }
  modelBtns.forEach((b) => b.addEventListener('click', () => showLayer(b.dataset.layerId)));
  showLayer('agents');
})();
