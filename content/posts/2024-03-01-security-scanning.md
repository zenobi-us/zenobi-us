---
template: article
title: Repo security scanning and repair
date: 2024-03-01
stage: published
tags:
  - security
  - git
---

Over the last few years my focus on frontend engineering has been centred around how teams work together.
Are there dynamics and ergonomics that can shape the groups mentality into good scalable behaviours? I think so.

Here, I want to address the topic of "how do I handle the obvious security slip ups in my codebase?".

I'll focus on some obvious concerns, build a list of tools I look at and leave it at some kind of summary.

Given enough motivation I might write a follow up post on refining the process and extending the concerns.

## The concerns?

- committing secrets
- outdated dependencies
- vulnerable dependencies
- supply chain attacks

There's probably more, but these are low hanging fruit. Not only are they low hanging, but if addressed they can help reshape
your teams mentality around security.

## Available tooling

Lets look at each concern and see what tools are available to help us.

These could be categorised as:

- 📖 open-source
- 💸 paid
- 🧱 prevention
- 📑 management
- ⛏️ deep dive

### Secrets committed to sourcecode

<!-- cSpell:words gitguardian tartufo -->

Here we're looking at stopping secrets from being committed to source code.

- [gitguardian](https://www.gitguardian.com/) 💸 ⛏️
- [tartufo](https://github.com/godaddy/tartufo) 📖 🧱 ⛏️
- [gitguardian](https://www.gitguardian.com/) 💸
- [detect-secrets](https://github.com/Yelp/detect-secrets) 📖 🧱 📑
- [git-secrets](https://github.com/awslabs/git-secrets) 📖 ⛏️
- [git-hound](https://github.com/ezekg/git-hound) 📖 🧱
- [git-leaks](https://github.com/gitleaks/gitleaks) 📖 🧱 ⛏️
- [git-rob](https://github.com/michenriksen/gitrob) 📖 ⛏️
- [forager](https://forager.trufflesecurity.com/explore) 📖 ⛏️
- [trufflehog](https://trufflesecurity.com/trufflehog) 📖 ⛏️
- [repo-security-scanner](https://github.com/techjacker/repo-security-scanner) 📖 ⛏️
- [canary tokens](https://docs.canarytokens.org/guide/#what-are-canarytokens) 📖 🧱

Out of this selection [detect-secrets], [trufflehog] and [forager] stood out to me.

Most popular mentions on the web are [git-secrets], [git-hound] and [git-rob].

Since the aim is to prevent or rollover secrets in repos under your control a good choice is [trufflehog].

Just keep in mind

- you can't control what people do with their local repos, and we're working within the confines of "protect our repos" not "every possible repo"
- people want to do the right thing, but might forget now and then, or since that might be different from org to org, having a reminder is nice.
- we want to be able to scan our repos and fix them if we find secrets. so a bill of materials will be useful.

#### [detect-secrets](https://github.com/Yelp/detect-secrets)

a lot like [git-leaks]

- uses heuristic checks to identify secrets
- 👍 command line tool
- 👍 builds reports and can be integrated into CI/CD
- 👍 can be used in pre-commit hooks against a baseline
- 👎 only scans provided files. so i guess doing a 'state of the world' across your entire repos history and branches would take a while.

#### [git-leaks](https://github.com/gitleaks/gitleaks)

a lot like [detect-secrets], but does git better.

<!-- cSpell:words sarif -->

- is rule based
- 👍 command line tool
- 👍 scans against a baseline
- 👍 reports are able to be uploaded. json, csv, junit, sarif
- 👍 can be used in pre-commit hooks against a baseline
- 👍 can scan all commits, a range of commits or fs files
- 👍 fairly extensive configuration
- 👎 escape hatches in code like eslint.

#### [trufflehog](https://trufflesecurity.com/trufflehog)

- 👍 command line tool
- 👍 docker images
- 👍 github actions
- 👍 scans against a baseline
- 👍 can scan remote repo or many repos, github orgs, s3 buckets, google cloud buckets
- 👍 can scan all commits, a range of commits
- 👍 configuration file
- 👍 exclusion patterns

### Outdated dependencies

The offering is fairly slim here.

- [dependabot](https://dependabot.com/) 💸 📑 (part of github now)
- [renovate](https://www.whitesourcesoftware.com/free-developer-tools/renovate/) 💸 📑
- [npm-check-updates](https://www.npmjs.com/package/npm-check-updates) 📖 🧱

These days I'd just go with [dependabot] since it's part of github now. Just make sure your dependabot pull requests
are blocked by automated smoke tests that ensure your app still builds and runs when dependencies are updated.

### Vulnerable dependencies

- [snyk](https://snyk.io/) 💸 📑
- [dependabot](https://dependabot.com/) 💸 📑
- [npm audit](https://docs.npmjs.com/cli/v7/commands/npm-audit) 📖 🧱
  - <https://github.com/marketplace/actions/npm-audit-action> creates a issue
  - <https://github.com/JasonEtco/npm-audit-fix-action> creates a pr
  - <https://github.com/ybiquitous/npm-audit-fix-action> creates a pr
- [yarn audit](https://classic.yarnpkg.com/en/docs/cli/audit/) 📖 🧱
  - <https://github.com/actions-marketplace-validations/basaldev_yarn-npm-audit-action> creates a pr
  - <https://github.com/actions-marketplace-validations/pragatheeswarans_yarn-audit-action> creates a issue
  - <https://github.com/GradiusX/yarn-audit-github-action> prints to stdout
- [pnpm audit](https://pnpm.io/cli/audit) 📖 🧱
  - <https://github.com/marketplace/actions/pnpm-audit> comments on pr

Same again, it's either something like Dependabot or Snyk or DIY with your package manager tools.

Snyk is very expensive but also very comprehensive in it's covering a lot of
languages and platforms, or writing everything yourself using your package manager tools.

### Supply chain attacks

This one's interesting in that you should have two approaches to it. One is to prevent it, the other is to detect it.

There's three problems here:

- package goes missing
- package is taken over
- package is poisoned

### Detection

> tl;dr implement a vulnerability scanner from previous section.

In order to detect it you need to know what you're looking for. So you need to know what the attack vectors are. Usually it's package take over or package poisoning.

Package take over is when a package maintainer abandons a package and someone else takes it over and publishes a new version with a backdoor.

Package poisoning is when a package maintainer publishes a new version with a backdoor.

Detecting them can usually be done via the same tools as the previous section. But preventing them is a different story.

### Prevention

Once you know the dependencies you're using are clean, you'll want to ensure that don't get swapped out for something malicious or goes missing.

You might think your package managers lockfile is good enough, but consider if your lockfile lock the version of the package or the hash of the package? if it's only the version, then the package could be swapped out for something else.

To prevent a package going missing or being swapped out you could use a package manager that uses a lockfile that locks the hash of the package.

Yarn checks for package hashes, so if the package is swapped out for something else, yarn will error out.

You could go even further and use [Yarn Zero Installs](https://yarnpkg.com/features/caching#zero-installs), which is a the strategy of keeping a private copy of your dependencies.
They're stored in a `.yarn` directory and are immutable. This means that if a package is swapped out at the source we don't care because we have a copy of the package stored in the repo.

Your other option is to run a private registry. Verdaccio, Nexus, Artifactory, etc. This way you control the packages that are available to your team.

Some people will suggest using Docker and it's layers as a way to prevent supply chain attacks. But I think that's a bit of a red herring. It's not the same thing. Docker layers are a way to optimise the build process, not a way to prevent supply chain attacks.

## Summary

- [detect-secrets] for scanning for secrets
- [dependabot] for updating dependencies
- [snyk] for scanning for vulnerable dependencies
- [yarn] for preventing supply chain attacks
- [verdaccio] for preventing supply chain attacks
