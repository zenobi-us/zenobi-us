---
template: article
title: Exploring Design Systems with Vanilla Extract
date: 2024-01-31
stage: draft
tags:
  - design-systems
---

If you're building one off websites, you probably don't need a design system and you can stop reading.

Read on if you're building a product, or a suite of products, where consistency is important.

## What is a design system?

A design system is the visual rules that result from creating a design language.

Usually you'd end up with a collection of things called Tokens, which would describe the size of things, the kinds of typeface or the set of colours you'd want.

Recently the phrase Design System gets thrown around and results in some watering down to the point where it's hard to tell the different between bootstrap and a design system.

But the disctinction is easy. A design system is bespoke for your needs. a component library usually isn't. So with this in mind we can say that all design systems contain a component library, but not all component libraries are design systems.

The components in your design system make up a collection of reusable components, guided by very clear standards, that can be assembled together to build any number of applications.

## Why do I need a design system?

> More savvy organisations might first formulate a Design Language to cover more than just visual elements, this can then be implemented as a Design System.

## Vanilla Extract vs Emotion.JS

The comparison comes down to two questions:

- do you care about the runtime cost of your applications?
- do you want to easily switch token values, ie a theme system.

If you don't care about either of these, then Emotion.JS is where you should start.

Once you figure out that you do care about these things, you'll find that libraries like Vanilla Extract are a better fit.

## how to use vanilla extract

## my approach: monorepos
