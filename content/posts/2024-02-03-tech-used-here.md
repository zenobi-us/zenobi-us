---
template: article
title: Tech Used Here
date: 2024-02-03
stage: published
---

Recently rebuilt my personal site, migrating from a gatsby/docker deployed setup over to a statically
rendered [astro](https://astro.build) site deployed to cloudflare pages.

I wanted to explore creating a component library using a Css-In-Js-At-Buildtime inside a [nx](https://nx.dev/) monorepo.

## Site Framework

[Astro](https://docs.astro.build/en/concepts/why-astro) is fullstack SSG or SSR framework that can use React and TypeScript. Powered by Rollup and esbuild, it's fast.

- 👍 following a routing architecture where your `pages/*` determines the url patterns. makes understanding the routes easy.
- 👍 Seems to have a fast development experience.
- 👍 Supports TypeScript and React (or any other component framework you could want)
- 👎 no routing structure type safety, so dead links are a problem. (lates [Next.js has type safe routes](https://nextjs.org/docs/app/building-your-application/configuring/typescript#statically-typed-links))
- 🤔 To get most of the benefits of Astro, you'll end up writing fat page routes in `.astro` files so you can make use of [Astro Islands](https://docs.astro.build/en/concepts/islands/).

## Component Rendering

**[React](https://react.dev/)** doesn't need any introduction. It's a great library for building out components and managing state.
I'm not tied to React. I like it, but I could be persuaded to use other libraries like Vue, Angular, Solid or Svelte.
I'm really just after a nice Component Driven Development experience.

**[Vanilla Extract](https://vanilla-extract.style/)** is a CSS-in-JS library that generates vanilla CSS **at build time**.
This is amazing for a few reasons:

- It's fast. No runtime CSS generation means no CSS-in-JS runtime.
- Provides a [primitive for building a type safe token contract](https://vanilla-extract.style/documentation/global-api/create-global-theme-contract/), which translates into a set of css variables.
- With its [Recipes Primitive](https://vanilla-extract.style/documentation/packages/recipes/), it's easy to build a simple design system that's easy to maintain and extend.

**Typescript**

Needs no introduction, except to say that you'd be mad to think you can replace this with jsdoc.

> 📖 👓
>
> If you want to learn more about typescript. I suggest you chip away at [the courses over at `Exercism`](https://exercism.org/tracks/typescript). They have a great set of exercises that will help you learn the language.

## Repository Organisation

I'm using [Nx](https://nx.dev/) and [yarn 4](https://yarnpkg.com/features/caching) to manage the monorepo, organise the tooling and enforce best practices. Things I like about Nx when used in an ["integrated monorepo"](https://nx.dev/concepts/integrated-vs-package-based):

- 👍 Follows a nicely scaled composition of `tsconfig` files where each package segregates its config between tests and published code.
- 👍 Knows the dependency graph of your monorepo, and as such provides commands (and an sdk) which are aware of changes between commits within the graph.
- 👎 The NX team seem to constantly break the api from one release to another. Most likely because the nature of large scale nodejs projects and monorepos that can intelligently handle them is new ground.

### Yarn Zero Installs

might be controversial, but i'm sick of dealing with the problems caused by avoiding this approach:

- supply chain attack. installed packages are committed to git as `tar.gz`
- in pnp mode install time is measured in milliseconds not minutes. there is no `node_modules` directory, and yarn provides interops for node/vscode
- switching branches means you never have to remember to run `yarn i` each time.
- workflow runs in github actions are faster

### Sprinkled `package.json` throughout a monorepo are slow

A vanilla yarn/pnpm monorepo causes slow down when running initial `yarn install` or `pnpm install` commands.

An integrated Nx monorepo initially uses a single `package.json` for dependency management and then defers to `tsconfig.json#compilerOptions.paths` to manage the module resolution. (There are alternative operation modes for this, but this is the default).

### Dependency Graph Awareness

A vanilla Yarn,Pnpm or npm monorepo have limited provision for understanding the dependency graph of the monorepo.

Yes you'll be able to use PNPMs `filters` to limit the dependency graph, but it's not as powerful or reliable as Nx's `affected` commands.

### Tooling Framework

In a vanilla monorepo, you'll have to build your own tooling to manage the monorepo. You won't have any defined patterns or best practices to follow.

Nx provides a great set of built-in tools to manage the monorepo, but when you need to create more tooling there's an API provided that provides insights into the monorepo. This results in a consistent experience for the developers.

Predictability and consistency are important to me. I want to be able to move between projects and have a similar experience. I want to be able to onboard new developers and have them be productive quickly.

Tribal knowledge is another issue i've seen cause issues in software projects. I want to be able to codify the best practices and patterns into the tooling, so that I don't have to explain them to every new developer that joins the team. This moves the onboarding experience into the pull request process.

## Toolset Management

Ensuring your toolkit for a project is reproducible is important.

Most people use nvm to manage their node versions. I don't. Since there's more to a project than just the node version, I use [ASDF](https://asdf-vm.com/).

ASDF works by shim linking the binaries to the correct version of the tool. You describe the tools your project uses in a `.tool-versions` file. When you run a command, ASDF will look at the `.tool-versions` file and use the correct version of the tool.

This means that I can have different versions of the same tool installed and switch between them easily and reliably.

> ✋ 🥼
>
> ASDF only works on Linux environments, so Windows users need to use WSL2.

## Alternative Tooling

Here's a list of technologies on my radar

- `yarn`:

  - `npm`: 👎 not powerful enough
  - `pnpm`: 🤷 missing yarn 4 plugin system
  - `bun`: 👎 too bleeding edge, missing lots of features
  - `deno`: 🤔 need to revisit this.

- `nodejs`

  - `deno`: 🤔 need to revisit this.

- `asdf`

  - [`aqua`](https://github.com/aquaproj/aqua): 🤩 It operates just like ASDF but works on Windows too. Very interesting
  - [`proto`](https://moonrepo.dev/proto): 🤩 very interested in this. since it interops with moon

- `nx`

  - [moon](https://moonrepo.dev/moon): 🤩 very interested in this

- `astro`
  - [`nextjs`](https://nextjs.org/): 🤔 need to revisit this.
  - [`qwik`](https://qwik.dev/): 🤔 need to revisit this. I'm particular interested in their Resumable vs Rehydrate proposal.
