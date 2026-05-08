import { renderSectionNav, renderSectionMap } from './sections.js';
import { initHero } from './hero.js';
import { initSectionNav, initScrollTop } from './nav.js';
import { initTabs } from './tabs.js';
import { initAgentLoop } from './agent-loop.js';
import { initScrollProgress, initFadeIn, initFreshness, initActiveSection, initRoadmap, initTaskBars, initAnchorLinks } from './utils.js';

// Render data-driven nav and section map before any interaction init
renderSectionNav(document.getElementById('sectionNavList'));
renderSectionMap(document.getElementById('sectionMap'));

initHero();
initSectionNav();
initScrollTop();
initTabs();
initAgentLoop();
initScrollProgress();
initFadeIn();
initFreshness();
initActiveSection();
initRoadmap();
initTaskBars();
initAnchorLinks();
