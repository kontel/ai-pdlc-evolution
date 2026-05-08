export const SECTIONS = [
  { id: 'summary',           num: '01', title: 'Executive summary',    flavor: 'Thesis & context',       updated: '2026-03-15', updateNote: 'Baseline synthesis' },
  { id: 'legacy',            num: '02', title: 'Legacy PDLC',          flavor: 'Pain points today',       updated: '2026-03-15', updateNote: 'Baseline synthesis' },
  { id: 'capabilities',      num: '03', title: 'AI capabilities',      flavor: 'What tools unlock',       updated: '2026-03-15', updateNote: 'Baseline synthesis' },
  { id: 'evolution',         num: '04', title: 'Evolution map',        flavor: 'Workflows shift',         updated: '2026-03-15', updateNote: 'Baseline synthesis' },
  { id: 'teams',             num: '05', title: 'Teams & structures',   flavor: 'Roles & topology',        updated: '2026-03-15', updateNote: 'Baseline synthesis' },
  { id: 'discipline',        num: '06', title: 'Engineering discipline', flavor: 'Harness & debt',        updated: '2026-04-02', updateNote: 'Harness and comprehension debt' },
  { id: 'beyond-code',       num: '07', title: 'Beyond coding',        flavor: 'Ops, PM, research',       updated: '2026-03-15', updateNote: 'Baseline synthesis' },
  { id: 'roadmap',           num: '08', title: 'Roadmap & adoption',   flavor: 'Phases & intent',         updated: '2026-04-09', updateNote: 'Adoption chasm, numbering fix' },
  { id: 'risks',             num: '09', title: 'Four risks',           flavor: 'Product lens',            updated: '2026-03-15', updateNote: 'Baseline synthesis' },
  { id: 'future',            num: '10', title: 'Future vision',        flavor: 'Compound gains',          updated: '2026-04-26', updateNote: '9.1 three-layer future of computing added' },
  { id: 'product-engineer',  num: '11', title: 'Product engineer',     flavor: 'Human orchestrator',      updated: '2026-04-08', updateNote: 'JTBD shifts and recipe patterns' },
  { id: 'agent-architecture',num: '12', title: 'Agent architecture',   flavor: 'Ensemble & memory',       updated: '2026-05-04', updateNote: 'Interactive agent loop infographic added' },
  { id: 'sources',           num: '13', title: 'Sources',              flavor: 'References',              updated: '2026-05-04', updateNote: 'Agent section sources added' },
  { id: 'changelog',         num: '14', title: 'Changelog',            flavor: 'What changed',            updated: '2026-05-04', updateNote: 'Agent section update logged' },
];

function esc(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function renderSectionNav(listEl) {
  if (!listEl) return;
  listEl.innerHTML = SECTIONS.map((s) => `
    <li><a href="#${s.id}" data-section-id="${s.id}" data-updated="${s.updated}" data-update-note="${esc(s.updateNote)}">
      <span class="section-nav-text">${esc(s.title)}</span>
      <span class="nav-freshness nav-freshness--stable"></span>
    </a></li>`).join('');
}

export function renderSectionMap(mapEl) {
  if (!mapEl) return;
  mapEl.innerHTML = SECTIONS.map((s) => `
    <a href="#${s.id}" class="section-tile" data-section-id="${s.id}" data-updated="${s.updated}" data-update-note="${esc(s.updateNote)}">
      <span class="nav-freshness nav-freshness--stable section-tile-freshness"></span>
      <span class="section-tile-num">${s.num}</span>
      <span class="section-tile-name">${esc(s.title)}</span>
      <span class="section-tile-flavor">${esc(s.flavor)}</span>
    </a>`).join('');
}
