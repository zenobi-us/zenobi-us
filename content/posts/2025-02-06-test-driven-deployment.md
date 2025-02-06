---
date: 2025-02-06
title: Test driven deployment
draft: true
---

Despite my site just being a static website with a blog, there's a few things here that I think are worth mentioning.

> If you want to be deploying many times a day, then your automated testing needs to be acurate, fast and reliable.

I want to highlight this point, because there's a fair amount of delusion as to how this is possible. It's not easy, but it is possible.

You won't be able to scale your product or company there with manual testing. Full stop. It's just not going to happen.
And like... I'm not even saying that you need to automate some of your testing, I'm saying you need to automate all. of. it.

Currently I have about 70 odd e2e tests. They all run all the time, which isn't ideal in teh scope of scaling them. More on this later.

I also have Renovate running automatically so that it will raise PRs for me when dependencies are out of date. Every PR
that is raised, regardless of who raises them, causes the E2E tests to run. The tests passing is one condition for the PR to be mergable.

So what you end up with is some nice automated security updates, and more assurance around that your deployments from your mainline branch are more likely to be successful.

Yes yes. I hear you. "But no one can get 100% test coverage". I agree. But you can get close, and if you pritorise automated testing, then the only manual testing you'll need to do is exploratory testing in order to automate more tests.

## How I think automated testing can scale

So common approach is that you have a mainline, and then you have release branches as snapshots to deploy from.

Snapshots are released into some kind of staging environment and then your QA team start working through their list of stories and bugs for the release.

A few days later we eventually get confirmation that the release is good to go and we deploy it to production.

The first issues here are:

- The QA team become the bottleneck for the next release. We can't release the next one until they've finished testing the current one.
- The QA team are only testing the stories and bugs listed for the release. Since they're manually testing, there's no time to test anything else. So regressions are highly likely.
- Since the QA team are always manually testing, there's rarely time to automate tests. So it becomes a vicious cycle.

So next I'll outline what my ideal scenario looks like and then some ways to get there from the hellscape of manual testing.

### Ideal Scenario

So some premises:

- Your app repo can have the tests in the same repo or not. For the purposes of running them it doesn't matter. It mostly depends on your team and how you want to structure your repos.
- You want a mainline branch that is always deployable.

With that in mind, this is what we'd want

#### Block PRs that don't pass tests or don't have tests

Pretty simple, but it's important to enforce it. This prevents you from deploying code with bugs or incomplete features.

#### Dynamically run tests based on the linked story tickets and user preferences

> Branches that raise PRs **_MUST_** have a naming convention that helps identify a relationship to your story tickets.

This means that If your big feature to go out is described as an Epic ABC-123, and it has 10 stories and 50 task tickets, then:

- work done by developers must use those task tickets in the branch name
- the task tickets must be linked to the story ticket
- the story ticket must be linked to the epic ticket

Every ticketing system is capable of this. If yours isn't, then move to one that is, a super simple choice is Github Projects.

Now, when a developer raises a PR, CICD logic will pick the ticket id from the branch name, make an API call and infer the linked story tickets.

These story tickets are then used to determine which tests to run. If the story ticket has a test associated with it, then that test is run.

If your CICD system is capable of being controlled by the PR comment system (like github can be), then you can include chat-ops or labels that let a developer
to opt out, or opt in to certain tests, or even all tests.

#### Run tests periodically every day

Running tests periodically every day should be done in such a way that when it fails, the CICD system raises alerts to the developers who merged PRs since the last successful run.

#### Create testing transparency

A common
