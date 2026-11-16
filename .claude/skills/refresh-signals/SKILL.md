---
name: refresh-signals
description: Run a fresh 1–2 week industry scan on agentic PDLC topics — led by the evolution of the SDLC and engineering practice (what software development is becoming) — and append a new week block to signals.html. Use weekly (Sunday evening cadence). Also use when the user says "refresh signals", "do the weekly signals", "add this week's signals", "scan the last 1-2 weeks", or "update signals.html".
---

# Refresh Signals — Weekly Industry Scan

This skill produces a new weekly entry for `signals.html` in this repo. It is intentionally narrow: a strict 1–2 week scope, a fixed topic list, a fixed item shape, append-only writes.

**Lead lens: the SDLC.** Every week starts from the question *"what is software development becoming?"* — how engineering process, practices, roles and tooling are changing as agents write, review, test and ship code. This lens gets its own rail, placed first in every week, and its own one-line summary strip. The three-layer rails follow it.

## When to use

- The user asks to **refresh signals** for the writeup, "do this week's signals", "scan the last 1–2 weeks", "update signals.html", or similar.
- The user invokes you with a Sunday-evening cadence to add the latest week.
- The user wants to backfill a specific past week (override the date range).

Do **not** use this for one-off research questions, for the writeup itself (`index.html`), or for the workspace prototype. Those are different surfaces. Signals is the weekly log.

## Inputs

- **Date range**: default = "last 7 days". If the user says "last 2 weeks" or names a window, use that. Always state the date range you're using before running searches. If the previous week block ends more than 7 days before the new window starts, tell the user about the gap and offer a backfill; don't silently stretch the window.
- **Topic list** (fixed unless the user expands it). Topic 1 is the lead and is searched first and most thoroughly:
  1. **SDLC evolution — what software development is becoming.** Search each of these sub-areas every week:
     - *Process shape*: spec-driven / intent-driven development, plan → agent → review loops, background and long-running coding agents, PR-as-unit-of-work vs. task-as-unit-of-work, continuous agents in CI.
     - *Practices*: agent-authored code review, test generation and verification, evals as tests, repo context files (`AGENTS.md`, `CLAUDE.md`, skills), harness engineering, codebase "agent-readiness".
     - *Delivery & operations*: CI/CD and release changes for agent-produced change volume, AI SRE / incident agents, security of generated code, dependency and supply-chain risk from agents.
     - *Evidence*: productivity and quality research (RCTs, telemetry, DORA, METR, repository mining), defect / churn / review-load data, cost per change.
     - *Roles & teams*: engineer → agent manager / reviewer / product engineer, junior pipeline and hiring, team topology, platform engineering for agents.
     - *Tooling moves*: releases from coding-agent vendors (Claude Code, Codex, GitHub Copilot, Cursor, Devin, Windsurf, Jules, Kiro, Amp, Factory, etc.) **only when they change how the work is done**, not for routine feature lists.
  2. Agentic PDLC and product engineer role evolution (beyond engineering: discovery, design, PM)
  3. Three-layer future of computing — **ambient intent capture**, **agentic execution**, **ephemeral verification UX** (generative / disposable UI)
  4. Multi-agent orchestration patterns and harnesses
  5. Trust calibration / human-in-the-loop UX for agents
  6. Cross-cutting: standards (A2UI, AG-UI, MCP Apps, Agent Skills), enterprise procurement, regulation

## Output contract

Append **one new `<section class="sig-week">` block** to `signals.html`, inserted immediately after the hero/filters block and **before** any existing `sig-week` sections. Older weeks must remain — never overwrite or reorder them. Recompute the filter counts at the top.

Each week block has, in this order:

1. **Header** with `Week NN · YYYY` + dated range (e.g. "Week 17 · 2026" / "21–26 April 2026") and a count of signals. `NN` is the ISO week number of the window's start date.
2. **TL;DR strip** — one or two sentences capturing the headline of the week. Goes inside `.sig-week-tldr`.
3. **SDLC strip** — one or two sentences, inside `<div class="sig-week-sdlc"><strong>SDLC shift:</strong> …</div>`, stating what the week's evidence says about how software development is changing. Grounded only in items from this week's SDLC rail; no predictions.
4. **SDLC rail** (`<div class="sig-layer sdlc" data-layer="sdlc">`, header `<span class="sig-layer-num">SE</span> Software engineering &middot; SDLC`) — **3–6 items, required every week**. If fewer than 3 in-window items survive filtering, keep what you have and say so to the user; never pad with out-of-window items.
5. **Three layer rails** (`data-layer="ambient"`, `data-layer="agentic"`, `data-layer="ephemeral"`) — 0–5 items each. Omit a rail entirely if it has no items.
6. **Optional cross-cutting rail** (`data-layer="cross"`) for items that don't fit one layer (orchestration patterns outside coding, non-engineering role evolution, regulation, enterprise procurement).

**Routing rule:** if an item's main consequence is for *how software gets built, reviewed, tested, shipped or operated*, or for engineering roles, it goes in the SDLC rail — even if it is also an agentic-execution product launch. A coding agent launch goes in SDLC; a consumer shopping agent goes in Agentic.

Each item must use this exact shape:

```html
<article class="sig-item">
  <div class="sig-item-date">Apr 23</div>
  <div class="sig-item-body">
    <div class="sig-item-title"><a href="<URL>" target="_blank" rel="noopener"><Title></a></div>
    <div class="sig-item-summary"><2–5 sentences. First sentence = why it matters. Italicise key phrases with <em>...</em>.></div>
    <div class="sig-item-tags">
      <span class="sig-tag"><tag1></span>
      <span class="sig-tag"><tag2></span>
    </div>
  </div>
</article>
```

### Hard rules for items

- **Date in title-case month + day** (e.g. `Apr 23`), inside `.sig-item-date`. No year.
- **Title is a clickable link** to the primary source. Do not link to aggregators when the original is available.
- **Summary is 2–5 sentences**. The first sentence must answer "why does this matter for the topics in our writeup?" — for SDLC items, "what does this change about how software is built?". The second/third can describe the substance. Plain English. No marketing voice. Report numbers with their source and method (e.g. "in a 16-developer RCT", "self-reported survey of 3,000").
- **Italicise key phrases** sparingly with `<em>`. Used for emphasis on the substantive insight, not for decoration.
- **2–3 tags max** from this controlled vocabulary (extend only if necessary):
  - General: `OS-level`, `Hardware`, `Voice`, `Screen context`, `Computer use`, `Browser-native`, `Long-running`, `Parallelism`, `Enterprise`, `Governance`, `Standard`, `Generative UI`, `Toolchain`, `Design role`, `Orchestration`, `Trust`, `Role evolution`, `Regulation`, `Open source`, `Paper`, vendor name (e.g. `OpenAI`, `Google`, `Microsoft`, `Anthropic`, `GitHub`, `Cursor`), `Vertical · <industry>`.
  - SDLC: `Agentic coding`, `Spec-driven`, `Code review`, `Testing`, `CI/CD`, `Security`, `Dev productivity`, `Engineering practice`, `Team shape`.
  - SDLC items should carry one stage tag where it fits: `Stage · Plan`, `Stage · Code`, `Stage · Review`, `Stage · Test`, `Stage · Release`, `Stage · Operate`.
- **No editorialising**. The signal page is a log, not a manifesto.

### Filter chip counts

After inserting the new week, update the five `<span class="sig-chip-count">` numbers at the top of the page. Recompute from scratch every run; do not increment in place:

```
All       = sum of items across all weeks
SDLC      = total items inside data-layer="sdlc" rails across all weeks
Ambient   = total items inside data-layer="ambient" rails
Agentic   = total items inside data-layer="agentic" rails
Ephemeral = total items inside data-layer="ephemeral" rails
Cross     = total items inside data-layer="cross" rails
```

A quick way to count: `grep -c` won't work on nested markup; use a short script that walks each `.sig-layer` and counts `.sig-item` children by `data-layer`.

### Hero meta

Update the "Last refresh" line in the hero (look for the string `Last refresh`) to today's date.

## How to run the scan

1. **State the window**. Print the explicit date range (e.g. "Scanning 19 → 26 April 2026") to the user before starting.
2. **Search the SDLC lens first.** Run at least five date-aware `WebSearch` queries covering the SDLC sub-areas above (process shape, practices, delivery & operations, evidence, roles & teams), plus one per major coding-agent vendor that shipped in the window. Then search topics 2–6. Always include the current month/year in queries — recency matters more than exhaustive coverage. Use `WebFetch` on the primary source to confirm date and facts before writing an item.
3. **Filter ruthlessly to the date window.** Only include items where the source's publication date falls inside the window. Drop everything else, even if interesting. This is a hard rule — a week-old item belongs in the writeup, not the signals log.
4. **Deduplicate.** If two sources cover the same news, pick the closest-to-primary one (vendor blog > tech press > aggregator). Drop the others.
5. **Layer.** Place each surviving item in exactly one rail, applying the routing rule above.
6. **Trim.** SDLC 3–6, other layers ≤5. Choose by signal strength: independent evidence (RCT, field data) > vendor announcement that changes practice > funded launch > research paper > practitioner essay > opinion piece > tutorial.
7. **Write the summaries.** First-sentence = why-it-matters. Then substance. 2–5 sentences total per item. Plain English. Then write the TL;DR and SDLC strips last, from the items.
8. **Edit `signals.html`.** Insert the new `<section class="sig-week">` right after the closing tag of the `.sig-filters` div (so newest week is on top), update the five chip counts, and update the hero "Last refresh" line.
9. **Verify.** Open the preview (Python http server runs via `.claude/launch.json` as `site`), screenshot the top of `signals.html`, confirm the new week renders, the SDLC chip filters correctly, and the counts match. Also load `graph.html` and confirm the SDLC lane shows the new items.
10. **Update the writeup changelog** in `index.html` with a one-line entry under today's date: "Signals — added week NN (NN–NN Month YYYY): NN items, led by N SDLC signals, across <layers>." Append to the most recent date heading if it's the same day; otherwise add a new `<h4>` heading.

## Don'ts

- Don't rewrite older week blocks. Append-only. (Older weeks have no SDLC rail; leave them as they are.)
- Don't expand a week's count beyond ~18 items total even if there's more news. Quality over coverage.
- Don't add items outside the date window, even if the user pastes one — politely flag it as "writeup material, not signals".
- Don't fill the SDLC rail with release notes. A coding-tool feature belongs only if it changes the shape of the work (who does what, in what order, with what check).
- Don't change the styling, structure, or filter chip names without the user explicitly asking.
- Don't skip the verification step — silent regressions on this page accumulate.

## Example invocation

```
User: refresh signals for this week
You: Scanning 19 → 26 April 2026, SDLC lens first, then the other five topic areas…
     [runs WebSearch in parallel]
     [drafts week block]
     [Edits signals.html, updates counts, bumps "Last refresh"]
     [Adds one-line changelog entry to index.html]
     [Screenshots signals.html top]
You: Added Week 17. 5 SDLC · 3 ambient · 3 agentic · 2 ephemeral · 1 cross-cutting.
     SDLC shift: <one sentence>. Top story: <one sentence>. See signals.html.
```

## Where to look (starter list — extend as needed)

- **SDLC & engineering practice**:
  - Coding-agent vendors: anthropic.com/engineering, claude.com/blog, openai.com/index (Codex), github.blog (Copilot, Octoverse), cursor.com/blog, cognition.ai/blog, blog.google / developers.googleblog.com (Jules, Gemini CLI), aws.amazon.com/blogs (Kiro, Q Developer), ampcode.com, factory.ai, jetbrains.com/blog
  - Evidence: dora.dev, metr.org, arxiv.org/list/cs.SE, research.google, microsoft.com/en-us/research, stackoverflow.blog, getdx.com/blog, faros.ai, linearb.io, jellyfish.co
  - Practice & opinion: martinfowler.com, thoughtworks.com/radar, newsletter.pragmaticengineer.com, leaddev.com, infoq.com, thenewstack.io, simonwillison.net, addyosmani.com, latent.space, swyx.io, kentbeck.com / tidyfirst.substack.com, birgitta.info
- Vendor blogs: openai.com, anthropic.com/news, blog.langchain.com, developers.googleblog.com, microsoft.com/en-us/microsoft-cloud/blog, devblogs.microsoft.com
- Tech press: thenewstack.io, infoq.com, theregister.com, techcrunch.com, technologyreview.com, infoworld.com
- Standards: a2ui.org, github.com/google/A2UI, github.com/modelcontextprotocol, agentskills.io
- Research: arxiv.org/list/cs.AI, sequoiacap.com (analyses)
- Practitioner blogs: harrisonchase.dev, every.to

If a source you'd normally trust hasn't published anything in the window, that's fine — leave it out. Empty cells beat padding.
