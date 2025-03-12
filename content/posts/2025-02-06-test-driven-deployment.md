---
date: 2025-02-06
title: Test-Driven Deployment
draft: true
---

I've been mulling over release cadence lately and how automated testing totally changes the game. So, here's a brain dump of my thoughts.

> TL;DR: Your automated test suite needs to be spot on—fast, accurate, and easy to run just the right tests.

My site's just a static blog, nothing fancy, but I've rigged up a test-driven deployment (TDD) pipeline that I think is worth shouting about. It's built on Cloudflare Pages, GitHub Actions, Renovate, and Playwright, and it's been a game-changer for me. Here's the rundown:

- Renovate auto-updates dependencies by raising PRs for me.
- Every PR has to pass E2E tests, linting, and typechecking before it's mergeable.
- Renovate PRs get auto-merged if they pass—nice and hands-off.
- PR changes trigger a preview deployment with an auto-generated subdomain dropped in the PR comments.
- Merging a PR deploys to a non-production env ([https://develop.zenobius.pages.dev/](https://develop.zenobius.pages.dev/)).
- When the main branch updates, Release Please either spins up a release branch or updates an existing one, complete with a PR and preview env.

You might look at this and think, "Aw, cute little pipeline." Fair. Your setup probably has Docker, manual approvals, and a dozen more services. But the ideas here? They scale. Take 'em and run.

## The Testing Experience Needs to Be Fast and Accurate

> If you're aiming to deploy multiple times a day, your automated tests have to be accurate, fast, and damn reliable.

I can't stress this enough; there's some delusion out there about how easy this is. It's not. But it's doable. Manual testing won't scale your product or your team. Period. And I'm not just saying automate _some_ of it—I'm saying _all_ of it.

Right now, I've got about 70 E2E tests. They all run on every PR, which works for now but won't scale forever—more on that in a bit. Renovate's humming along, raising PRs for outdated dependencies, and every PR (human or bot) triggers the full test suite. Passing tests are a hard requirement for merging. What I get out of it is automated security updates and a main branch that's way more likely to deploy cleanly.

I can hear the sceptics already: "No one gets 100% test coverage!" True, but you can get close. Prioritise automation, and the only manual testing left is exploratory stuff to figure out what else to automate.

## How I Think Automated Testing Can Scale

Most setups have a mainline branch and release branches as snapshots for deployment. You push a snapshot to staging, QA manually tests the listed stories and bugs, and a few days later, you get the green light for prod. Here's where it falls apart:

- QA becomes the bottleneck. No new release until they're done.
- They only test what's listed—no time for regressions, which sneak through.
- Manual testing eats all their time, so automation never happens. Vicious cycle.

I've got an ideal scenario in mind, and here's how I'd get there from that manual testing hell-scape.

### Ideal Scenario

A couple premises first:

- Tests can live in the app repo or a separate one—doesn't matter for running them, just team preference.
- The mainline branch should always be deployable.

Here's what I'd want:

#### Block PRs That Don't Pass Tests or Lack Them

Simple but non-negotiable. No buggy or half-baked code slips through.

#### Dynamically Run Tests Based on Tickets and Preferences

> Branches raising PRs **must** follow a naming convention tying them to story tickets.

Say I've got an epic, `ABC-123`, with 10 stories and 50 tasks. Developers name branches with task tickets (e.g., `feature/ABC-456-fix-login`), which link to stories, which link to the epic. Every ticketing system can handle this—GitHub Projects is a dead-simple option if yours can't.

When I raise a PR, the CI/CD grabs the ticket ID from the branch name, hits the API, and figures out the related story tickets. Then it runs only the tests tied to those stories. If GitHub's your jam, you could even add chat-ops in PR comments (e.g., `/run-all-tests`) or labels to tweak what runs.

#### Run Tests Every Day

Periodic daily runs catch regressions early. If they fail, the CI/CD pings whoever merged PRs since the last good run. Keeps everyone accountable.

#### Make Testing Transparent

My test suite's no black box. I'd want:

- **Reports**: Every run spits out a readable summary—what ran, what it covered, how long it took. Stick it in PR comments or Slack.
- **Dashboard**: A quick view of suite health, coverage, and failures over time. Static page or something like Grafana works.
- **Traceability**: Every test links to its ticket. Failures tell me exactly what feature's at risk.

## Scaling the Suite Without Slowing Down

Running all 70 tests every time is fine now, but it won't be when I hit 700. Here's my plan:

### Selective Runs

Use ticket IDs to run only relevant tests. Tag tests with metadata (e.g., `#login`, `#epic-ABC-123`), parse the branch name, and filter. Worst case, fall back to a smoke test suite—critical paths like homepage and login. Keeps things snappy.

### Parallelise It

Playwright's built for parallel runs, so I'd split tests across CI workers. If a full run takes 5 minutes, 5 workers could drop it to 1. GitHub Actions gives me 20 freebies—plenty to play with.

### Keep It Clean

As tests pile up, It'll get flakiness and rot. I'd schedule a recurring cleanup—check failure logs, refactor duplicates, axe outdated tests. Keeps the suite lean.

My approach to this would be to accumulate test report statistics, and visit it as a monthly task:

1. As various soft limits are reached while running e2e tests in PRs are reached, bot managed issue tickets are raised. each bot managed issue ticket is linked to a "dashboard ticket".
2. A scheduled task or a concurrent task on your `master` branch would run the full test suite. Timing data is collected when tests are run here and reported into a bot managed Issue Ticket.
3. To spread the knowledge, someone from the team is designated to review timings, fails etc;
   1. A PR is opened using a branch name that references the bot managed ticket where the team member removes redundant tests, optimises timings, updates documentation, etc.
   2. THe bot managed PR would track these optimisations and make further notes to its issue ticket.

## Escaping Manual Testing Hell

Manual QA bottlenecks suck—regressions slip through, and automation stays a pipe dream. Here's how I'd shift to my ideal:

1. **Start Small**: Automate one big feature (like login) and show it works.
2. **Pair Up**: QA writes test cases; I turn them into Playwright scripts with them. Skill-sharing FTW.
3. **Shift Left**: Make it easy to run the testable stack locally. Force commit-hooks to run smoke-level tests.
4. **Chip Away**: Automate a chunk of the manual backlog each sprint—focus on high-risk stuff first.
5. **Celebrate**: When a test catches a bug, I'm yelling it in chat. Momentum matters.

A few months in, I could flip from 90% manual to 90% automated.

## Wrapping Up

Test-driven deployment's not just tools; it's a mindset. My little setup with Cloudflare, GitHub Actions, Renovate, and Playwright is basic, but the principles hold up. Fast, accurate, selective testing means I can deploy all day, whether it's this blog or some sprawling app.

My automation tests having been ticking away for a few months now; Check it out over at

The takeaway? Treat your test suite like the backbone of your releases—because it is. Manual testing's a dead end, and half-arsed automation's a headache. Nail it, and you'll never look back.

What do you reckon—any holes in my thinking? Hit me up!
