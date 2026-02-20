---
date: 2025-02-06
title: Test-Driven Deployment
draft: true
---

I’ve been reworking my release process around one non-negotiable idea:

> If you want to deploy often, your tests must be trustworthy, fast, and easy to run.

This site is a static blog, not some giant platform. Doesn’t matter. The delivery principles are the same. My stack is Cloudflare Pages, GitHub Actions, Renovate, and Playwright.

## What I run today

- Renovate opens dependency update PRs.
- Every PR runs E2E tests, linting, and type checks.
- Passing Renovate PRs auto-merge.
- Every PR gets a preview deploy URL.
- Merged PRs deploy to `develop.zenobius.pages.dev`.
- Main branch updates trigger Release Please to open/update a release PR.

It’s a small setup, but the core rule is serious: the default path to production should be automated, visible, and boring.

## Why this matters

Manual QA-only workflows don’t scale. They turn into a queue, then that queue turns into release drag.

A test-driven deployment model changes that:

- Regressions are caught earlier.
- Dependency updates stop rotting in backlog.
- Mainline stays closer to deployable.
- QA can spend more time exploring risk, less time re-checking basics.

I currently run ~70 E2E tests on every PR. That’s still manageable. It won’t be when it becomes 700, so scale strategy matters now, not later.

## How I’d scale it

### 1) Selective test execution

Use branch naming conventions (ticket IDs) and map tests to features/stories via metadata. Run what’s relevant by default, with smoke tests as fallback.

Example mapping:

- Branch: `feature/ABC-456-fix-login`
- Test tags: `@login`, `@story-ABC-456`, `@epic-ABC-123`

That keeps feedback loops fast without sacrificing confidence.

### 2) Parallel full-suite runs

Run full suites on schedule (daily/nightly), split across workers.

- PRs: selective runs for speed
- Scheduled jobs: full regression runs for safety

That’s the balance: fast iteration plus broad coverage.

### 3) Transparent reporting

Your test system should be easy to inspect, not mystical.

- Per-run summaries (what ran, duration, failures)
- Trend views (pass rate, flake rate, slowest tests)
- Traceability from failures to feature/ticket ownership

### 4) Ongoing suite maintenance

Suites decay if you leave them alone.

I’d keep a recurring monthly maintenance pass to:

- remove redundant tests,
- fix flaky cases,
- reduce runtime hot spots,
- update test docs and ownership.

## Moving from manual QA to automation

If you’re mostly manual today, this is the path I’d use:

1. **Start with one high-value flow** (login, checkout, critical form).
2. **Pair QA and engineering** on test design and implementation.
3. **Shift left** with local smoke checks and CI gates.
4. **Automate backlog incrementally** each sprint by risk.
5. **Share wins** whenever tests catch real defects.

That’s how you build trust in the suite and reduce release anxiety.

## Closing thought

Test-driven deployment is less about tooling and more about operating discipline.

Tools will change. The principle won’t: treat your test suite like release infrastructure, not a side project.

If you’ve built a similar setup, I’d love to compare notes—especially around selective execution and keeping large suites healthy over time.
