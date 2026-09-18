---
name: writing-posts-in-zenobius
description: Use when planning, drafting, or revising zenobi.us posts and you need repository-native writing style, start-middle-end structure, MDX-safe formatting, and miniproject-based planning artifacts.
---

# Writing Posts in zenobi.us

## Overview

Use this skill to create posts that match the tone and structure used in
`content/posts/`.

This skill is opinionated:

1. Plan first.
2. Write in **start / middle / end** form.
3. Use mixed explanation modes (lists, diagrams, stories, anecdotes).
4. Enforce quality gates before final draft.
5. Use `miniproject` for planning artifacts.

## Inputs You Need

- Topic
- Target reader
- Core concepts to teach
- Desired post type: quick-tip, deep-dive, series-entry, reflection

## Mandatory Setup (miniproject)

Before planning any post, invoke the `miniproject` skill and create planning
artifacts in `.memory/`.

Minimum requirement:

1. Initialize or verify memory store.
2. Create one story file for the post intent.
3. Create at least two task files: `outline` and `draft`.
4. Add task links to `.memory/todo.md`.

If you need a direct helper command to locate memory:

```bash
MEMORY_DIR=$(/home/zenobius/.pi/agent/skills/projectmanagement/miniproject/scripts/get-memory-dir.sh --create)
```

## Post Planning Workflow (Required Order)

### 1) Topics

Define 3-6 concepts the post must teach.

Output:
- concept list
- reader problems each concept addresses

### 2) Structure

Map concepts into **start / middle / end**:

- **Start (Overview / TL;DR):** preview the concepts.
- **Middle (The Story):** explain with examples, decisions, tradeoffs.
- **End (Summary):** remind readers of the same concepts and next steps.

### 3) Section Steps

Create stepwise intent for every section:

- purpose
- key point
- evidence/example
- transition sentence

### 4) Post Proposal

Produce a proposal before drafting body copy:

- title options (3)
- one-sentence promise
- section outline
- representation mix plan (see below)
- risks/unknowns

### 5) Implementation

Draft section-by-section using the approved proposal.

## Representation Mix Rule

Every draft must use at least **two** modes from this list:

- dot points / checklists
- diagrams (e.g. `nomnoml` code fence)
- story sequence (timeline of decisions)
- anecdote (specific real scenario)

For technical deep-dives, prefer **three** modes.

## Quality Gates (Do Not Skip)

### Gate A — Planning Completeness

- `.memory/` artifacts exist
- concepts are explicit
- start/middle/end mapping is complete

### Gate B — Structural Integrity

- start contains concise overview or TL;DR
- middle carries the main narrative
- end repeats/summarizes original concepts

### Gate C — Teaching Quality

- abstract claims are grounded with examples
- at least two representation modes used
- jargon is explained or linked

### Gate D — zenobi.us Style Alignment

- practical and opinionated tone
- concrete tradeoffs, not vague advice
- readable section headings
- links to related posts when relevant

### Gate E — MDX Safety

- only supported components/markdown features used
- code fences and diagram fences are valid
- no unsupported ad-hoc JSX components

Reference files:
- `./style-pointers.md`
- `./mdx-capabilities.md`

## Output Template

Use this output shape when asked to draft:

1. `## TL;DR` (or equivalent overview)
2. Story sections (`##` headings)
3. `## Summary`
4. Optional `## Next steps` or `## Appendix`

## Fast Self-Check

Before finalizing, verify:

- Did I preview and then re-summarize the same concepts?
- Did I include at least two explanation modes?
- Did I create planning docs via `miniproject` first?
- Does this sound like a practical engineering post, not generic SEO text?
