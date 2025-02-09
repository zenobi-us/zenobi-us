---
template: article
date: 2025-02-06
title: New website
stage: published
tags:
  - web dev
  - reflections
  - vanilla extract
---

<!--- cspell:ignore syncpack --->

Mid last year, I started a project to explore some complex topics around monorepos, design systems, and newer ways I could approach CSS. I chose to use Vanilla Extract, which at the time seemed like a reasonable choice. It compiles possible CSS at build time down to CSS, and at runtime, the values change based on CSS variables. The DX (Developer eXperience) of it felt like css-in-js, but the runtime had none of the problems of css-in-js.

It's blazing fast at runtime.

I wanted to explore building a design system with great TypeScript experience, one that was fundamentally driven by tokens and provided the possibility for variants in a component's styles. It also needed to support themes.

Everyone starts with a `<Box/>` component, so I did too. Mine ended up doing the job of what others would create a `<Stack />` and `<Flex />` for. Vanilla extract essentially allows you to define all the possible CSS attributes you want to support on a component, resulting in a contract of props that reflect those CSS attributes and the allowed values you want.
all the possible css attributes you want to support on a component and the result is a a contract of props that reflect those css attributes and the allowed values you want.

At this point it was great and easy, the `gap` property on a `<Box />` could be described semantically instead of with magical numbers. My words represented the tokens in my design system.
The issue came when I realised that Vanilla Extract couldn't support arbitrary css values that you would normally provide to an attribute like `width`, so I couldn't have any of this at the same time:

```tsx
<Box width="100%" /> // Here I want to use a string for any percentage value.
<Box width="small" />
```

I either had to use tokens and get type safety or use strings and lose type safety. I couldn't have both. I tried to work around this by creating a `width` token that had a `percentage` type and a `string` type, but it was a hack and it didn't work.

The rabbit hole grew larger as I added more components. At some point, I realised that the complexity was getting in the way.

So I threw it all out.

The few valuable monorepo libraries I converted into single project repos, and I converted this repo back into a single app repo.

I installed Tailwind CSS along with Tailwind Variants and then started the process of converting all the Vanilla Extract Style objects into pure Tailwind Variant driven objects that merely describe tailwind classes.

This part only took me a few nights after work.

The next thing I chucked out was this custom content type generator that was fairly limited in what it could do. I replaced it with Content Collections instead.

The next thing I replaced was ASDF and Just. (deep breath)... I really like these two. But they got replaced with Mise. (I'll do a write up on ASDF, Just and Mise soon).

So here we are, a new website.

Short list of bits and pieces that are used :

- Tailwind CSS
- Framer Motion
- Remix
  - My own hand rolled SSG generator (could do with some more love tbh)
- Content Collections

For Tooling:

- Mise and Bash
- Node (obviously)

For Testing:

- Jest (but I should switch to Vitest)
- Playwright

For CI-CD:

- [syncpack](https://www.npmjs.com/package/syncpack), ESLint and Husky
- Github Actions
- Cloudflare Pages via Wrangler CLI
- Release Please
- Renovate
