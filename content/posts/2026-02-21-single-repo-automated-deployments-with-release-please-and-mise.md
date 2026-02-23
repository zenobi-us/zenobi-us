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

## The workflow split

The old pattern was one workflow that did everything. Considering a lot of people 
hate implementing CI/CD, that is a natural place to start. It's in one place, it's done. bam. they can move 
on with their lives.

But as I kept using this, something annoying kept interrupting me... if the final 
publish/deploy step failed, I had a stupid constraint: 
I needed another commit to retrigger the pipeline cleanly.


### Better pattern

- **Workflow A: release**
  - runs on push, due to push from local or merge from PR.
  - runs `release-please`, where it derives version bump and changelog from commits.
  - emits `repository_dispatch(stage)` where stage could be your stable/beta/next channels or prod/dev/staging environment names.

- **Workflow B: publish/deploy**
  - runs on `repository_dispatch` events.
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

This feels a lot forgiving.

## Why I avoid `package.json` scripts for deployment logic

I've been doing web dev for nearly 20 years now. Early days, I would follow the 
tutorials and put all my projects orchestration in `package.json` scripts. 

The fact that everyone does this is why projects like `npm-run-all` and `concurrently` exist. 
They are trying to patch the fact that `package.json` scripts don't have good primitives for composition, branching, or parameter handling.

Then scripts grew from one-liners into mini orchestration layers.

At that point, `package.json` becomes the wrong abstraction:

- weak readability once scripts chain scripts
- awkward branching and parameter handling
- poor ergonomics for non-Node tasks

I notice more and more repos using [Justfile](https://github.com/casey/just) now, which is a much nicer abstraction than `Makefile` (which I've always found confusing).


[`mise`](https://mise.jdx.dev) gives me a cleaner path from simple to complex.

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

As tasks become more complex, I can split these into their own files, add parameters, or even write custom task runners in JS/TS/Python/Rust if I want.

> 🤔 Writing more complex scripts as their own file means you get syntax highlighting and easier linting/lsp support by your editor.

### Side Effect: better testing of ci pipeline

I suspect the reason why many of us dislike implementing ci/cd is that they are so tedious to test. You make a change, you push, you wait for the result. If it fails, you fix and repeat.

How ever, by moving your operational steps into separate scripts/files that accept arguments and flags instead of assuming a CI environment, you can test these locally before pushing. This makes the feedback loop much faster and less frustrating.

## The minimal setup I recommend

### 1) Release workflow (`release.yml`)

- trigger: `push` to main
- job: run `release-please-action`
  - **regular commits on mainline**: creates or updates a release PR? `repository_dispatch(dev)` 
  - **merging a release pr**: doesn't create or update a release PR? `repository_dispatch(prod)` 

### 2) Deploy workflow (`deploy.yml`)

- triggers:
  - `workflow_dispatch` with filters for `dev` and `prod` stages
  - `repository_dispatch` with filters for `dev` and `prod` stages
  - if this is a library, we'd probably also trigger this on `tag.v*` events.
- job: publish package or deploy app

### 3) Local + CI task orchestration

- move operational commands to `mise`
- keep `package.json` focused on package metadata and runtime boundaries

## Summary

My default now:

- `release-please` for releases
- split release and deploy workflows
- manual dispatch on deploy workflow
- `mise` for task orchestration
- no deployment logic pile-up in `package.json`

The important part is not the tools. It is decoupling:

- decouple versioning from deployment.
- decouple deployment reruns from source changes.
- decouple operational logic from package metadata and ci pipeline definitions.


