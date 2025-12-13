---
template: article
date: 2025-12-13
title: AI-Assisted Project Scaffolding with Persistent Memory
stage: published
tags:
  - ai
  - automation
  - developer-experience
  - llm
---

I kept losing the thread.

Every time I started a new session with an LLM to scaffold a project, I'd spend the first ten minutes re-explaining context. What we'd decided. What we'd tried. What didn't work. The model had no memory, and neither did I — not reliably, anyway.

So I started writing things down. Not for me. For the agent.

## The Pattern

A `.memory/` directory at the project root. Simple markdown files:

- `summary.md` — project overview, current state, key decisions
- `todo.md` — pending work, with `[NEEDS-HUMAN]` markers for things the agent shouldn't decide alone
- `team.md` — which agents have touched this project and what they contributed

Plus typed artifacts: `research-`, `phase-`, `guide-`, `notes-`, `implementation-`, `task-`. Each gets an 8-character hash and a title. The naming convention isn't clever — it's just greppable.

The agent's first job in any session: read `summary.md`. Its last job: update it.

## Multi-Agent Handoffs

One agent doesn't do everything. A planning agent thinks through architecture. A build agent writes code. A research agent digs into documentation.

They pass context through two mechanisms:

1. **`session` tool** — direct messaging between agents in the same conversation
2. **`task` tool** — delegation to a subagent with a fresh context window

When context gets heavy, agents compact: distill findings into `.memory/` artifacts, then continue with a lighter load. `team.md` acts as a ledger — who did what, what they learned, what's unresolved.

The `[NEEDS-HUMAN]` marker is the escape hatch. When an agent hits something consequential — a design tradeoff, a risky deletion, an ambiguous requirement — it tags the item and stops. I review, decide, and the next session picks up where we left off.

## What I Learned

**Simple beats clever for small projects.** A vector database gives you semantic search, but it also gives you infrastructure to maintain. For a project with fewer than 50 files, grepping markdown is fast enough and infinitely more debuggable.

**Git history of AI decisions is useful.** Each session commits its changes. I can `git log` through the project's evolution and see what the agent was thinking at each step. When something goes wrong, I can trace it back.

**This breaks down at scale.** Once you're past a few dozen `.memory/` files, the pattern needs pruning logic. I haven't solved that yet — for now, I just delete old research artifacts manually when they stop being relevant.

**The human-in-the-loop marker works.** `[NEEDS-HUMAN]` is a forcing function. It makes the agent's uncertainty explicit instead of letting it guess at things it shouldn't.

## When This Fits

- Iterative scaffolding over days or weeks
- Projects where you want an audit trail of AI-assisted decisions
- Situations where context exceeds a single session's window

## When it doesn't fit

- large codebases
- real-time retrieval
- or anything requiring semantic similarity search.

---

## Appendix: Implementation


<GithubEmbed 
  repo="zenobi-us/dotfiles"
  ref="1f0aac29223f7c954702ef61a892862b19bd607f"
  path="devtools/files/opencode/agent/miniproject.md"
  language="markdown"
/>


<GithubEmbed 
  repo="zenobi-us/dotfiles"
  ref="1f0aac29223f7c954702ef61a892862b19bd607f"
  path="devtools/files/opencode/command/miniproject.md"
  language="markdown"
/>
