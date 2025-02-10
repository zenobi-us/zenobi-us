---
template: article
title: How I use NPM
date: 2018-05-24
stage: published
tags:
  - nodejs
  - architecture
  - npm
---

Npm lifecycle scripts are great:

- it exposes all the keys in a `package.json` as environment variables to child processes
- by default running an entrypoint will also attempt to run a `pre*` and a `post*` commands.
- Using `onchange`, `npm-run-all`, `npx`, `cross-var`, `cross-env` can help automate many typical project tasks.
- the keys can actually contain mostly whatever characters you want, below you see I use it to mark out groups of commands.

Here's an example of what I've used in the past:

```json
    "dev": "npm run docker:run -- tool npm run container:nuxt:dev",
    "build": "npm run docker:run -- tool npm run container:nuxt:build",
    "start": "npm run docker:run -- tool npm run container:nuxt:start",
    "generate": "npm run docker:run -- tool npm run container:nuxt:generate",

    "yarn:rebuild": "npm run docker:run -- yarn",

    "// [ci] commands": "where docker volume mounting is not possible",
    "ci:generate": "npm run docker:run -- build npm run container:nuxt:generate",

    "// [test] commands": "",
    "test:unit": "echo 0",
    "test:integration": "echo 0",

    "// [container] commands": "",
    "container:nuxt:dev": "nuxt --spa --config-file ./project/nuxt.config.js",
    "container:nuxt:build": "nuxt build --universal --config-file ./project/nuxt.config.js",
    "container:nuxt:generate": "nuxt generate --spa --config-file ./project/nuxt.config.js",
    "container:nuxt:start": "nuxt start --spa --config-file ./project/nuxt.config.js",


    "// [workstation] Release Commands": "",
    "git:checkoutStatic": "git checkout ./docs",
    "git:cleanStatic": "git clean -f ./docs",
    "git:pull": "git pull",
    "git:check": "git diff --check && git diff --exit-code && git diff --cached --exit-code",
    "git:publish": "npx npm-run-all --serial git:add git:commit-amend git:push-origin",
    "git:add": "git add .",
    "git:commit-amend": "git commit --amend --no-edit",
    "git:push-origin": "git push --follow-tags",
    "prerelease": "npx npm-run-all --serial git:checkoutStatic git:cleanStatic git:pull",
    "release": "npx standard-version",
    "postrelease": "npx npm-run-all --serial generate git:publish",

    "// [workstation] Docker Commands": "",
    "docker:run": "docker-compose run --service-ports --rm",
    "docker:shell": "npm run docker:run -- build /bin/sh",
    "docker:exec": "npm run docker:run -- build",
    "docker:build": "npm run docker:run -- make docker-make --no-push",
    "docker:push": "npm run docker:run -- make docker-make",
    "predocker:release": "npm run git:pull",
    "docker:release": "npx standard-version",
    "postdocker:release": "npm run git:publish",

    "// [container] Release Commands": "",
    "container:release": "npx run-s release:build-frontend release:publish-styleguide",
    "container:release:changelog": "conventional-changelog --infile=./project/CHANGELOG.md"
```

That's a lot there and it covers the majority of my work flow, so lets go over the groups of commands below.

## General Entrypoint

```
npm run dev
npm run build
npm run start
npm run generate
```

Usually we're just compiling the source code in development mode or in production mode, so here these lines are relevant:

```json
    "dev": "npm run docker:run -- tool npm run container:nuxt:dev",
    "build": "npm run docker:run -- tool npm run container:nuxt:build",
    "start": "npm run docker:run -- tool npm run container:nuxt:start",
    "generate": "npm run docker:run -- tool npm run container:nuxt:generate",
```

`dev` will first call `docker:run` supplying arguments `tool npm run container:nuxt:dev`.

These are really just fed into `docker-compose`. So we're running the `tool` service defined in `docker-compose.yml` and then telling docker-compose to run `npm run container:nuxt:dev` from within the container. Any commands meant to be run within a docker container are labelled as such.

So the chain is :

- `npm run dev`
- `npm run docker:run`
- `docker-compose run ... tool npm run container:nuxt:dev`
- `nuxt --spa --config-file ./project/nuxt-config.js`

One thing you'll notice is that I point at the configuration file in the `project` directory. This doesn't exist here, but the `docker-compose.yml` describes volumes that mount the project directory to that path. I do this because of the nature of file vs directory docker volumes. File volumes don't reliably get updated back to the host, especially if it gets removed in the container and rebuilt. So mounting a folder at a place and operating on files within is more reliable and flexible.

## Rebuild Yarn Offline Cache

`$ npm run yarn:rebuild`

To reliably build the docker image with the right node modules, we need to maintain an offline cache of them. This command just launches the `yarn` docker-compose service, which is hard coded to yarn install the modules in order to obtain an offline copy of the modules. This technique only retains the offline cache, everything else is thrown away, because creating the container later is what we keep.

## Release Commands

`$ npm run release`

This whole chain starts off with [standard version](https://www.npmjs.com/package/standard-version), a much better alternative to just `npm version patch|minor|major`.

The idea with this chain, is that you need to automate all the "git paperwork" when making a release.

- conflicts need to be checked for,
- dist output needs to be reset to remote state avoid conflicts before pulling.
- version in `package.json` needs to be made.
- a git tag needs to be made.
- changelog needs to be generated.
- a build needs to be made.
- you might also want to run tests here.
- new files need to be committed.
- and finally new commits pushed.

So running `$ npm run release` triggers the following chain:

- `prerelease` is triggered first
  - `git:check` 👈 this one is a nice trick
  - `git:checkoutStatic`
  - `git:cleanStatic`
  - `git:pull`
- then `release` is run
- then `postrelease` is triggered.
  - `generate`
    - `docker:run`
      - `container:nuxt:generate`
  - `git:publish`
    - `git:add`
    - `git:commit-amend`
    - `git:push-origin`

Something I want to improve here is that very early on bail if we're running this on the incorrect git branch:

```
...
"git:only-master": "npx git-branch-require master",
...
```

`git-require-branch` doesn't exist (yet), so if you make it... it needs to take a branch name amd return an exit code of 0 or 1 to indicate success or failure. We wan't this because the npm run process will stop the whole chain when it receives an exit code of 1.

## Docker Commands

I've learn through much pain and anguish some key lessons:

- Focus on your strengths: don't run your own email server.
- Backups: always make your dependencies available offline.
- Sandbox Environment: ensure it's the same every time it's used.

I encountered that last point early back when I started python development, where Ubuntu utilised python libraries for it's operating system which also meant they were available when I ran my own python programs. This lead to unreliable code because I couldn't control the versions of those libraries, and when I tried installing the ones I needed it overwrote the system versions. Then some people came up with `Virtualenv`, which just like npm and node_modules made python packages installed and resolved locally.

But when I started nodejs development, my colleagues used a mixture of windows, macosx and me on linux. As you can imagine just getting nodejs installed was a error prone experience.

After some time I explored using Docker to containerise our frontend development environment, so that now instead of worrying about what version of node or node_modules we needed (and all the other requirements that randomly pop up), we said "just install docker and any version of node that has npx (8+)".

> [!NOTE]
> Retrospective 2024
>
> I've moved on from using `package.json#scripts` . You should definitely do the same.
> Something like a [Justfile](https://github.com/casey/just) is perfect.
