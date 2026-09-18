---
template: article
date: 2026-09-18
title: The Agent Skills I Use Most
stage: published
tags:
  - ai
  - automation
  - developer-experience
  - llm
# cSpell:ignore Worktrunk
---

I have a large collection of agent skills in my dotfiles repository. Some are specialised for a particular framework, game engine, or command-line tool.

The skills I use most are broader. They change how an agent works, rather than adding knowledge about one tool.

Four have become part of my normal workflow:

- `worktree`, to isolate a task
- `surf`, to control a real browser
- `shared-context`, to keep context outside one repository clone
- `browser-acceptance-evidence`, to show that a change works

They deal with four recurring problems: changes getting mixed together, agents guessing about browser state, context being lost between sessions, and work being declared complete without being checked.

## `worktree`: isolate the work

Agents are easier to use when each task has its own workspace.

The `worktree` skill is the starting point. It routes tasks such as starting, reviewing, fixing, submitting, and finishing work to the right workflow. These workflows use [Worktrunk] to create, switch between, and sometimes merge worktrees.

It is useful to let an agent work without changing the files in my main checkout. Another agent can review the work in a separate worktree, and I can abandon an experiment without first cleaning up unrelated edits.

A worktree also gives the task a clear boundary. The agent gets a branch, a path, a handoff, and a definition of done. That is safer than having several sessions work in the same directory and hoping they do not interfere with each other.

The isolation flow is straightforward:

1. resolve the task
2. create a separate worktree
3. give the agent a focused handoff
4. check the result
5. merge or remove the worktree

The skill makes this sequence repeatable. It also connects to `shared-context` and `browser-acceptance-evidence`, which I use to carry context and store browser test evidence outside the worktree.

## `surf`: use a real browser

Source code can tell an agent what a browser should do. It cannot always tell the agent what the browser is doing right now.

`surf` lets an agent inspect and control Chrome from the terminal. It can open pages, read the accessibility tree, click elements, fill in forms, wait for state changes, inspect console output and network requests, and take screenshots.

The rule I follow is simple:

> Read the state first. Act. Check the result.

This avoids a common browser automation error: acting on an old page model, or assuming that a click worked because the command returned without an error.

For longer flows, `surf do` makes the steps repeatable. Named sessions also let several agents use the browser without taking control of each other's sessions.

I use it when the browser is part of the problem: reproducing a UI bug, checking a route, verifying a form, inspecting a redirect, or seeing what a logged-in user actually sees.

How is `surf` different from agent-browser or playwright-cli? Mainly in two ways:

- It uses an extension for communication and control, so the browser does not need to be launched with a special command-line option.
- It uses a JSON workflow format, so flows can be shared and run again.

## `shared-context`: keep context where agents can reach it

A Git checkout is not always the right place for agent context.

A worktree is temporary. That is useful for code, but not for information that needs to survive branch changes and remain available to other sessions.

`shared-context` stores alignment files and source material outside a single repository clone. It keys the storage location by the repository's Git origin. Separate worktrees can therefore use the same context without a manually copied directory.

The skill also makes the storage rules explicit:

- resolve the active alignment root before reading or writing
- use that root for all shared writes
- index new source files
- do not overwrite hand-written context
- publish shared changes when the storage mode requires it

This gives the context a known location and a few clear rules, instead of leaving it as an informal pile of notes.

It is useful for more than memory. I use it for research, handoffs, captured external sources, and evidence from manual tests.

If you work in a GitHub organisation with an Enterprise plan, you can also store this context in a private repository and publish it through GitHub Pages. The access controls can keep it private to the organisation, which makes it useful for sharing context between agents and people.

## `browser-acceptance-evidence`: replace claims with proof

Unit tests and type checks are necessary, but they do not prove that a user can complete a flow in a running application.

The `browser-acceptance-evidence` skill turns browser testing into something that other people can review. It creates three things:

- a test plan written before the browser opens, which can be handed to a person or another agent
- an `evidence.jsonl` file with one record for each test step
- an HTML report with the screenshots and verdicts

Writing the plan first stops the test from becoming a story written after the result is known. Each step records what the agent did, which selector it resolved, which URL it used, what it observed, and which screenshot supports the result.

The skill also defines how to handle uncertainty:

- a missing element is `BLOCKED` until its precondition has been checked
- a `PASS` requires a screenshot
- a tool reference such as `e46` is not a durable selector
- incomplete proof is `PARTIAL`, not "probably fine"
- every test-data override and uncovered test must be named

I usually use this skill with `surf`.

## How the four skills fit together

These skills work best as a chain.

First, `worktree` gives the task an isolated workspace. The agent can then use `shared-context` to read project context and write back decisions or handoff material that needs to survive the worktree.

If the task changes a web application, `surf` gives the agent a real browser. `browser-acceptance-evidence` adds a process around that browser session: plan the test, record each step, take screenshots, and publish the result.

The workflow looks like this:

```text
isolated worktree
        |
        v
shared project context ---> focused implementation
                                  |
                                  v
                         real browser via surf
                                  |
                                  v
                    acceptance plan and evidence report
```

None of these skills replaces judgement. They make the parts of my usual workflow that benefit from repeatability easier to follow.
