---
template: article
date: 2026-02-21
title: My Default CI/CD Pattern for Single Repos
stage: published
tags:
  - ci-cd
  - github-actions
  - release-please
  - deployment
  - developer-experience
---

I finally landed on a deployment pattern for single-library and single-app repos that is simple, recoverable, and low-ceremony.

If you want the short version:

- use [`release-please`](https://github.com/googleapis/release-please-action)
- skip `@changesets/cli` unless you actually need multi-package orchestration.
- split release from publish/deploy workflows. Don't try to do it in the same workflow.
- stop stuffing logic into `package.json` scripts, use `mise` tasks instead

## TL;DR

My pattern now has three explicit rules:

1. **Versioning and changelog:** `release-please`.
2. **Execution model:** separate workflows for release and deploy/publish.
3. **Task runner:** `mise`, not `package.json` scripts.

This gives me:

- automation when commits land
- manual recovery path via `workflow_dispatch`
- better task composition as CI/CD needs get more complex

## Why I stopped using changesets for single repos

Changesets is good software. I am not arguing it is bad.

I am saying it is usually **too much ceremony** for a single lib or single app repo.

For this repo shape, I do not want:

- extra changeset files for every release intent
- another authoring workflow during normal feature work
- more editorial overhead to keep release metadata tidy

For single repos, `release-please` hits the sweet spot:

- derives version bumps from conventional commits
- opens/updates release PR automatically
- generates changelog entries
- keeps release intent close to commits

That is enough.

> I'd argue that release-please is also amazing for monorepos.

## The workflow split that fixed my deployment friction

The old pattern was one workflow that did everything. It worked, until it didn’t.

If the final publish/deploy step failed, I had a stupid constraint: I needed another commit to retrigger the pipeline cleanly.

That is unnecessary coupling.

### Better pattern

- **Workflow A: release**
  - runs on push
  - runs `release-please`
  - creates or updates release PR / tags

- **Workflow B: publish/deploy**
  - runs on release events (or tag pushes)
  - also supports `workflow_dispatch`

Now you still get automated deploys from normal commits, **and** you get a manual button when you need to rerun deployment without changing code.

```nomnoml
#direction: right
#edges: rounded
#bendSize: 0.5
[Developer commit] -> [Release workflow
(release-please)]
[Release workflow
(release-please)] -> [Release PR / Tag]
[Release PR / Tag] -> [Publish/Deploy workflow]
[Maintainer] -> [Manual dispatch]
[Manual dispatch] -> [Publish/Deploy workflow]
```

That manual path is not a luxury. It is operational hygiene.

## Why I avoid `package.json` scripts for deployment logic

I used to centralise everything in `package.json` scripts because it was convenient.

Then scripts grew from one-liners into mini orchestration layers.

At that point, `package.json` becomes the wrong abstraction:

- weak readability once scripts chain scripts
- awkward branching and parameter handling
- poor ergonomics for non-Node tasks

`mise` gives me a cleaner path from simple to complex.

### What changes in practice

In `mise.toml`, I can keep tasks explicit, composable, and language-agnostic.

```toml
[tasks.release]
description = "Run release automation"
run = "gh workflow run release.yml"

[tasks.deploy]
description = "Run deploy workflow manually"
run = "gh workflow run deploy.yml"

[tasks.ci]
description = "Local preflight checks"
run = [
  "mise run typecheck",
  "mise run lint",
  "mise run test"
]
```

For simple repos, this is still dead simple.

For growing repos, this scales without turning into script spaghetti.

## The minimal setup I recommend

### 1) Release workflow (`release.yml`)

- trigger: `push` to main
- job: run `release-please-action`

### 2) Deploy workflow (`deploy.yml`)

- triggers:
  - `release.published` (or tags)
  - `workflow_dispatch`
- job: publish package or deploy app

### 3) Local + CI task orchestration

- move operational commands to `mise`
- keep `package.json` focused on package metadata and runtime boundaries

## A blunt tradeoff summary

[bias: I optimise for low-operational-friction solo/small-team repos]

- If you run a **single package/app repo**, this pattern is hard to beat.
- If you run a **large monorepo with many independently versioned packages**, changesets may still be the better fit.

Use the simplest release model that matches the topology of your repo.

Most single repos are over-engineered here.

## Summary

My default now:

- `release-please` for releases
- split release and deploy workflows
- manual dispatch on deploy workflow
- `mise` for task orchestration
- no deployment logic pile-up in `package.json`

The important part is not the tools. It is decoupling:

- decouple versioning from deployment
- decouple deployment reruns from source changes
- decouple operational logic from package metadata

That decoupling is what makes this pattern robust.
