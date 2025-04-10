---
date: 2025-03-13
title: Friends don't let friends use redux
stage: draft
---

So there's a trend I've noticed, the kind that feels like an annoying splinter under the finger nail.

You've joined a team, and they use Redux/Mobx/Zustand. Ok, sure but then you notice they also use Apollo Client or Tanstack Query.

![Eye twitch](./2025-03-13-eye-twitch.gif)

But why? No. I'm not going to try and list all the reasons why. Instead lets just outline why you shouldn't.

Both Apollo Client and Tanstack Query have a concept of cache. The short of if it is that this cache is already your global state.
