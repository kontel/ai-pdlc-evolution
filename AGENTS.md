# AGENTS.md — PDLC Futures Sketchpad

## Project overview

This is an evolving research synthesis site exploring how AI transforms the enterprise Product Development Life Cycle (PDLC). It is a single-page HTML application (`index.html`) with a companion workspace prototype (`workspace.html`) and a full-document view (`document.html`). The site is static — no build step, no framework, no bundler.

## File structure

- `index.html` — Main sketchpad. 12 numbered sections plus a changelog. All content is in this single file.
- `workspace.html` — Agentic workspace concept prototype (smart alerts, pulse analytics).
- `document.html` — Full-document prose view of the same material.
- `styles.css` — Shared stylesheet for `index.html` and `workspace.html`.
- `main.js` — Shared JS for nav, scroll, roadmap toggles, anchor copy-links, and animations.
- `assets/` — Static images (infographic).

## Section numbering convention

Every section uses a consistent `X.Y` numbering scheme:

- **Section 1–3**: No subsections (flat content).
- **Section 4**: 4.1, 4.2
- **Section 5**: 5.1 through 5.6
- **Section 6**: 6.1 through 6.3
- **Section 7**: 7.1 through 7.5
- **Section 8**: 8.1, 8.2
- **Section 9**: No subsections.
- **Section 10**: 10.1 through 10.11
- **Section 11**: 11.1 through 11.4
- **Section 12**: Sources (flat list).
- **Changelog**: Reverse-chronological entries by date.

When adding new subsections, increment sequentially and renumber anything that follows. Never use letter suffixes (e.g. 10.2A) — always use integers.

## Navigation metadata

The nav uses `data-updated` and `data-update-note` attributes on each `<li>` in `#sectionNavList`. When you update a section:

1. Set `data-updated` to today's date (`YYYY-MM-DD`).
2. Set `data-update-note` to a brief description of the change.
3. The freshness badges (`nav-freshness--recent`, `nav-freshness--weeks`, `nav-freshness--stable`) are computed dynamically by `main.js` — do not hardcode badge text.

## Anchor links

New or updated subsections should have:

1. An `id` attribute on the `<h3>` (e.g. `id="adoption-chasm"`).
2. An anchor-link icon: `<a href="#id" class="anchor-link" title="Copy link to this section">&#128279;</a>` placed after any badges.
3. The copy-to-clipboard behaviour is handled by `main.js` — no additional JS needed.

## Changelog convention

The changelog section (`#changelog`) is reverse-chronological. Each entry:

- Date as `<h4>` (format: `D Month YYYY`, e.g. `9 April 2026`).
- Bulleted list of changes, each starting with `<strong>Section X.Y</strong>` and the section title in `<em>`, followed by `(new)` or `(updated)`.
- Always update the changelog when adding or modifying sections.

## Badge convention

- `<span class="nav-new">new</span>` — for brand-new sections.
- `<span class="nav-new">updated</span>` — for sections with substantive new content added to existing material.
- Badges are placed inside the `<h3>` text, before any anchor link icon.

## Sources convention

New sources go in Section 12 (`#sources`) as `<li>` items:

```html
<li><span class="source-org">Org Name</span> &mdash; <a href="URL" target="_blank">Title</a> (Date)</li>
```

## Content style

- Research-backed: every claim should cite a source with a link.
- Statistics use the `<span class="metric">` pattern inside cards.
- Quotes use `.quote-block` with `.quote-source` for attribution.
- Callouts use `.callout` with `.callout-title` for the header.
- Comparison data uses `.compare-table` inside `.diagram-wrapper`.
- Cards use a grid of `.card` elements with `<h3>` title and `<p>` body.

## Key patterns

- All content sections use `fade-in` class for scroll-triggered animation.
- The hero badge should reflect the current month/year of latest updates.
- The footer date range should span from initial creation to latest update (e.g. `March–April 2026`).
- No build step — edit HTML/CSS/JS directly and push.
