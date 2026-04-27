---
name: refresh-signals
description: Run a fresh 1–2 week industry scan on agentic PDLC topics and append a new week block to signals.html. Use weekly (Sunday evening cadence). Also use when the user says "refresh signals", "do the weekly signals", "add this week's signals", "scan the last 1-2 weeks", or "update signals.html".
---

# Refresh Signals — Weekly Industry Scan

This skill produces a new weekly entry for `signals.html` in this repo. It is intentionally narrow: a strict 1–2 week scope, a fixed topic list, a fixed item shape, append-only writes.

## When to use

- The user asks to **refresh signals** for the writeup, "do this week's signals", "scan the last 1–2 weeks", "update signals.html", or similar.
- The user invokes you with a Sunday-evening cadence to add the latest week.
- The user wants to backfill a specific past week (override the date range).

Do **not** use this for one-off research questions, for the writeup itself (`index.html`), or for the workspace prototype. Those are different surfaces. Signals is the weekly log.

## Inputs

- **Date range**: default = "last 7 days". If the user says "last 2 weeks" or names a window, use that. Always state the date range you're using before running searches.
- **Topic list** (fixed unless the user expands it):
  1. Agentic PDLC and product engineer role evolution
  2. Three-layer future of computing — **ambient intent capture**, **agentic execution**, **ephemeral verification UX** (generative / disposable UI)
  3. Multi-agent orchestration patterns and harnesses
  4. Trust calibration / human-in-the-loop UX for agents
  5. Cross-cutting: standards (A2UI, AG-UI, MCP Apps), enterprise procurement, regulation

## Output contract

Append **one new `<section class="sig-week">` block** to `signals.html`, inserted immediately after the hero/filters block and **before** any existing `sig-week` sections. Older weeks must remain — never overwrite or reorder them. Increment the filter counts at the top to match.

Each week block has:

- **Header** with `Week NN · YYYY` + dated range (e.g. "Week 17 · 2026" / "21–26 April 2026") and a count of signals.
- **TL;DR strip** — one or two sentences capturing the headline of the week. Goes inside `.sig-week-tldr`.
- **Three layer rails** (`data-layer="ambient"`, `data-layer="agentic"`, `data-layer="ephemeral"`) plus an optional **cross-cutting rail** (`data-layer="cross"`) for items that don't fit one layer (e.g. orchestration patterns, role evolution, regulation, enterprise procurement).
- **3–5 items per layer**, no more. Signal beats volume.

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
- **Summary is 2–5 sentences**. The first sentence must answer "why does this matter for the topics in our writeup?". The second/third can describe the substance. Plain English. No marketing voice.
- **Italicise key phrases** sparingly with `<em>`. Used for emphasis on the substantive insight, not for decoration.
- **2–3 tags max** from this controlled vocabulary (extend only if necessary): `OS-level`, `Hardware`, `Voice`, `Screen context`, `Computer use`, `Browser-native`, `Long-running`, `Parallelism`, `Enterprise`, `Governance`, `Standard`, `Generative UI`, `Toolchain`, `Design role`, `Orchestration`, `Trust`, `Role evolution`, `Regulation`, `Open source`, `Paper`, `Vendor name (e.g. OpenAI, Google, Microsoft, Anthropic)`, `Vertical · <industry>`.
- **No editorialising**. The signal page is a log, not a manifesto.

### Filter chip counts

After inserting the new week, update the four `<span class="sig-chip-count">` numbers at the top of the page:

```
All = sum of items across all weeks
Ambient = total items with data-layer="ambient" across all weeks
... etc.
```

Recompute these from scratch every run; do not increment in place.

### Hero meta

Update the "Last refresh" line in the hero (look for the string `Last refresh`) to today's date.

## How to run the scan

1. **State the window**. Print the explicit date range (e.g. "Scanning 19 → 26 April 2026") to the user before starting.
2. **Search.** Use `WebSearch` for each of the five topic areas with date-aware queries. Always include the current month/year in queries — recency matters more than exhaustive coverage.
3. **Filter ruthlessly to the date window.** Only include items where the source's publication date falls inside the window. Drop everything else, even if interesting. This is a hard rule — a week-old item belongs in the writeup, not the signals log.
4. **Deduplicate.** If two sources cover the same news, pick the closest-to-primary one (vendor blog > tech press > aggregator). Drop the others.
5. **Layer.** Place each surviving item in exactly one layer rail. Use cross-cutting only for items that genuinely don't fit a single layer.
6. **Trim to 3–5 per layer.** Choose by signal strength: vendor announcement > funded launch > research paper > opinion piece > tutorial.
7. **Write the summaries.** First-sentence = why-it-matters. Then substance. 2–5 sentences total per item. Plain English.
8. **Edit `signals.html`.** Use a single `Edit` operation that:
   - Inserts the new `<section class="sig-week">` right after the closing tag of the `.sig-filters` div (so newest week is on top).
   - Updates the four chip counts.
   - Updates the hero "Last refresh" line.
9. **Verify.** Open the preview (Python http server runs via `.claude/launch.json` as `site`), screenshot the top of `signals.html`, confirm the new week renders and the counts match.
10. **Update the writeup changelog** in `index.html` with a one-line entry under today's date: "Signals — added week NN (NN–NN Month YYYY): NN items across <layers>." Append to the most recent date heading if it's the same day; otherwise add a new `<h4>` heading.

## Don'ts

- Don't rewrite older week blocks. Append-only.
- Don't expand a week's count beyond ~15 items total even if there's more news. Quality over coverage.
- Don't add items outside the date window, even if the user pastes one — politely flag it as "writeup material, not signals".
- Don't change the styling, structure, or filter chip names without the user explicitly asking.
- Don't skip the `Edit` verification step — silent regressions on this page accumulate.

## Example invocation

```
User: refresh signals for this week
You: Scanning 19 → 26 April 2026 across [the five topic areas]…
     [runs WebSearch in parallel]
     [drafts week block]
     [Edits signals.html, updates counts, bumps "Last refresh"]
     [Adds one-line changelog entry to index.html]
     [Screenshots signals.html top]
You: Added Week 17. 4 ambient · 4 agentic · 5 ephemeral · 0 cross-cutting.
     Top story: <one-sentence summary>. See signals.html.
```

## Where to look (starter list — extend as needed)

- Vendor blogs: openai.com, anthropic.com/news, blog.langchain.com, developers.googleblog.com, microsoft.com/en-us/microsoft-cloud/blog, devblogs.microsoft.com
- Tech press: thenewstack.io, infoq.com, theregister.com, techcrunch.com, technologyreview.com, infoworld.com
- Standards: a2ui.org, github.com/google/A2UI, github.com/modelcontextprotocol
- Research: arxiv.org/list/cs.AI, sequoiacap.com (analyses)
- Practitioner blogs: addyosmani.com, simonwillison.net, harrisonchase.dev, latent.space, every.to

If a source you'd normally trust hasn't published anything in the window, that's fine — leave it out. Empty cells beat padding.
