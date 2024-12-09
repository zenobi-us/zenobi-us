---
date: 2024-10-25
title: On Systems and Automated Guidance
stage: published
---

> You don't rise to the level of your goals, you fall to the level of your systems

https://www.youtube.com/watch?v=Ch2Wt1yrN4s

There are some aspects to software engineering that are almost always a solved problem with clear preferred approaches.

The ambiguity to this statement often comes from choices made in spite or ignorance of it.

It happens more than we'd like.

## Why do I care ?

My approach to successful team work in software development is to automate as much of the boring stuff.

- PR reviews? DangerJS, Eslint, Prettier and a Team managed styleguide that lives in the repo.
- Deployments? Github actions and templated infrastructure declaration (pulumi, flux2, nomad, etc)
- Testing? Again, Follow our Styleguide... but start with good separation so we can use [test doubles](http://xunitpatterns.com/Test%20Double.html)/mocks.
- Security and Supply Chain Attack Mitigation? Dependabot, Renovate, etc.

Time spent here wisely will save the whole team time and highlight those who attempt to jump the guardrails.

But If we don't tend to our garden of automation, then we as leadership need to fill the gaps that automation doesn't.

Whether you can would be a topic for another post.

But just remember that when we delegate remaining gap to humans, several things happen:

- We need to remember what the guidelines were first, did we document it?
- We have to talk/agree/decide, requiring bandwidth and time we probably don't have.

So if you're not automating boring stuff and still doing these two things over and over again... isn't it time you see the wasted time and frustration it causes?

Peace.
