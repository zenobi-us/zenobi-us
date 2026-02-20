---
template: article
date: 2026-02-20
title: From Persistent Memory to Workflow Discipline with miniproject
stage: published
tags:
  - ai
  - automation
  - developer-experience
  - llm
---

In my previous post, [AI-Assisted Project Scaffolding with Persistent Memory](/b/posts/2025-12-13-ai-assisted-project-scaffolding-with-persistent-memory), I focused on one big idea: keep project context in markdown so I do not need to re-explain myself every session.

In this post I want to expand on the approach and clarify some concepts.

Instead of "a pile of files", you want a disciplined approach.

## TL;DR

- I still use markdown artifacts as project memory.
- I now treat `miniproject` as an operating workflow, not a note-taking trick.
- Big model for planning and deep analysis, smaller model for literal execution.
- Tasks as individual files beat checklist line items for focus and handoff.
- `/miniproject status` is the command I use most because its great for reminding me and the LLM in new or longer than anticipated sessions.

## What evolved

Planning wise, not much changed. I still prefer a top-down chain:

1. strategic context
2. research
3. stories
4. tasks
5. execution

What changed is how strict I became about when to move between those steps.

The model always wants to start building early. I usually ignore that impulse until the artifact chain is strong enough.

## Artifact types and what I intended each one to do

Here is my intended model, and how it behaves in practice.

### `summary.md`

**Intended:** the top level map of goals, direction, and current state.

**Reality:** it overlaps with `todo.md` more than I want.

I still keep it because it is the best onboarding file in the set. If someone reads one file first, it should be this one.

### `todo.md`

**Intended:** a basic kanban-like queue.

**Reality:** exactly that. It is intentionally boring.

It keeps me focused on active work and the next thing only.

### `team.md`

**Intended:** coordination for parallel subagents and sessions.

**Reality:** underused right now.

I have seen models record session id and model against tasks, which is useful. But I have not fully operationalized multi-agent coordination yet. Long term I probably want a pi extension to enforce this better.

### `epic-*`, `phase-*`, `story-*`

**Intended:** separation of concerns.

- Epic defines scope, milestones, and success boundaries.
- Phase defines major chunks.
- Story defines testable user-facing intent.

**Reality:** this separation is where quality goes up.

Most teams collapse this into one vague spec or spec plus task list. I think that is a quality trap. You get better outcomes when edge cases are explored early and then translated into isolated, linked stories and tasks.

### `task-*`

**Intended:** self-contained execution units.

**Reality:** this is probably the most important artifact in practice.

A single task file can carry objective, constraints, references, and notes without bloating a master checklist.

### `research-*`

**Intended:** explicit discovery and analysis, with references.

**Reality:** still inconsistent if I am being honest.

Sometimes I accept first-pass research too quickly. When I push harder, quality improves. Avoiding duplicate research is still mostly manual and I want stronger directives in the skill for this.

### `learning-*`

**Intended:** preserve distilled lessons after execution.

**Reality:** this is my retro mechanism.

After an epic, I run cleanup and ask for learnings distilled from task notes and mistakes. Then I archive noisy historical artifacts so old verbosity does not pollute future context.

### `knowledge-*` (like codemap and data flow)

**Intended:** objective operational knowledge.

**Reality:** useful shortcuts, especially in initialization and analysis.

These files are not the same as learnings. They are more concrete and procedural.

## The workflow that pushes me forward

This is my most common sequence in a new repo:

1. `/miniproject init`
2. research and exploration
3. epic definition
4. story and journey exploration
5. task breakdown
6. execution in fresh sessions

The forcing function matters.

At almost every stage, the model wants to jump to implementation. I keep moving through the planning chain first. By the time I execute, I can restart sessions freely because the epic, stories, and tasks hold the context.

That is the practical win.

## Why tasks as files, not line items

Short version: focus and isolation.

Longer version:

- A giant task list grows until it hurts model focus.
- Recency bias gets worse as one file absorbs everything.
- Handoffs to Ralph loops, RLM-style continuation, or subagents become less reliable when context is mixed.

Task files fix that.

Each task has a controlled context window and links back to supporting artifacts. I can expand detail where needed without polluting everything else.

## How I actually use the commands

### Starting a new project

```text
/miniproject init
```

Expected output:
- baseline memory files
- initial codemap and data-flow knowledge files
- starting summary of current state

### New idea capture

```text
/miniproject idea "the idea..."
```

Expected output:
- idea exploration and q&a
- decision to reject or promote to epic
- learning artifact if rejected

### Creating research

```text
/miniproject lets research x y z
```

Expected output:
- one or more `research-*` files
- explicit questions, findings, references
- updates to summary/todo as needed

### Exploring stories and journeys for an epic

```text
/miniproject lets explore the user stories and journeys for epic-1234
```

Expected output:
- story files with acceptance criteria
- clearer user path and edge cases
- tighter alignment before task creation

### Task breakdown

```text
/miniproject create tasks for stories in epic-1234
```

Expected output:
- task files linked to stories
- clearer dependencies
- execution-ready units for sessions or subagents

### Most common command

```text
/miniproject status
```

Expected output:
- current epic and phase
- active task list
- next milestones and blockers

This one keeps me from drifting.

## One practical work pattern I use on teams

At work, I use a Jira skill to clone epics and stories into local memory, then pull related Confluence pages into research artifacts.

That gives me a local planning mirror that I can interrogate with LLM analysis before kickoff and implementation.

I can also mark external tickets that are dependencies but not my scope, which reduces confusion when task planning starts.

## Anti-patterns I keep seeing

1. **Skipping epic or research**
   - Fix: stop and do it first.

2. **Vague prompts and passive acceptance**
   - Fix: ask for research and q&a explicitly.

3. **Letting model sycophancy drive decisions**
   - Fix: tighten AGENTS guidance and stay skeptical of flattering agreement.

## Summary

The evolution from the first post is simple.

I did not replace markdown memory. I constrained it.

`miniproject` works best when it is treated as process guardrails that resist premature coding and preserve decision quality across sessions.

If you already use AI agents for delivery, this is the part worth stealing.

Not the files.

The discipline.
