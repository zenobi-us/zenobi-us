---
date: 2025-02-10
title: My approach to project provisioning
draft: true
tags:
  - tools
  - asdf
  - mise
  - DX
# cSpell:ignore Taskfile sdkman
---

Recently I did an update of my personal website where I made a subtle change to my [fundamental approach to project provisioning](/b/posts/2024-02-04-python-project-setup). I thought it would be interesting to share my approach and the reasons behind it.

## TL;DR

Instead of ASDF and Just, I use [Mise](https://mise.jdx.dev/).

## Intro

If you've worked with me, then it won't be a surprise that I have some opinions on ... anything. But specific to this, my views are:

- No downloading and installing tools manually.
- Custom task logic should be commented and have linters. In extreme cases, even testable.
- Once my provisioning tool of choice is installed, there should be a one stop command to provision the project.
- For web projects, provisioning uses the same one stop command in all environments. If you move a prebuilt artifact between environments instead, then the environment that builds this artifact should use the one stop command to get started.

> You're free to try and provision the project manually, but it will be stated that you're on your own and you'll need to justify the time it takes and any bugs caused by your bespoke setup process.

## Provisioning

> I define "tools" as any software that is not the project itself, but is required to build, run, or test the project.

So in the old days I would have used Vagrant or Ansible to ensure a project is provisioned on a workstation in the same way it's provisioned on a server. In the days before Docker this made sense, especially for full stack teams.

Since Docker became as prolific as it has, Ansible just represents a burden to maintain and learn. The teams I'm a part of now don't have any experience with provisioning and probably won't really gain any experience due to it being a thing managed by our DevOps silo.

For the last 5-6 years I've relied on [ASDF](https://github.com/asdf-vm/asdf). Which was pretty amaze-balls to me at the time, having come from teams that agonised over how developer tooling was created. Usually they decide that they want it to be reproducible, and since they aren't using ASDF end up relying on home baked tooling (which eats up huge amounts of time), or restrict themselves to what can be found in the repository of the language being used.

So ASDF really allowed teams to "choose the right tool for the job".

Recently though, I've been evaluating [Mise](https://mise.jdx.dev/). I'm pretty impressed.

## Task Runner

For almost any Nodejs tutorial, guide or forum thread, you'll see the idea of just using `package.json#scripts` field as being good enough for a task runner.
Why would you need anything else?

- any task defined also potentially executes a `post*`, `pre*` task.
- if you're using yarn 4, then bash idioms are abstracted on platforms that don't have bash.
- you can use `prepare` or `preinstall` to do things when you run `yarn/pnpm/npm install`

But my objection to this is simple:

- I can't write comments there to explain what's going on. Comments next to the problem are better than comments tucked away elsewhere.
- There's no facility for task dependencies, be it other tasks or files. Sure there's node cli tools for that (npm-run-all, onchange), but then you run into the next issue.
- Compound tasks either end up being massive one line strings a billion lines long, or you end up creating groups of namespaced commands `build`, `build:setup`, `build:compile-routes`, `build:server`, `build:watch`

Instead I spent a few years experimenting with dedicated tools for this purpose:

- a directory of bash files
- Make
- Taskfile.dev
- Just

The one I settled on is `Just`, but recently [Mise](https://mise.jdx.dev/) has changed my approach to something more suitable to most teams.

### Task dependencies

Bash files can be [annotated with comments that contain `MISE` directives](https://mise.jdx.dev/tasks/file-tasks.html#task-configuration) to indicate various kinds of dependencies that affect this task:

- files that it creates
- files that it uses
- other tasks that should run first
- setting environment variables you'd like for the duration of the task

So for example, because this lives in `.mise/tasks/content.sh` this one lets me run `mise run storybook`, `mise run storybook -b` or `mise run storybook --build` :

```sh title=".mise/tasks/content.sh"
#!/usr/bin/env bash

# https://usage.jdx.dev/
#USAGE flag "-b --build" help="Build storybook"

#MISE description="Storybook."
#MISE env={STORYBOOK=1}

# - global
# shellcheck disable=SC2154
if [ "$usage_build" = "true" ]; then
    echo "Building storybook... $STORYBOOK"
    yarn storybook build
else
    echo "Starting storybook... $STORYBOOK"
    yarn storybook dev -p 6006
fi
```

You can see this allows me to be more expressive, leave comments and gain syntax highlighting.
I'd even be able to run unit tests against these with [Bats](https://bats-core.readthedocs.io/en/stable/)

### Task UX

The developer of Mise also created a separate tool ([usage](https://usage.jdx.dev/) ) that you can add to any bash file in order to allow tasks to accept validated input via flags and arguments.

Again, this is in a bash file and is done via [directives in bash comments](https://mise.jdx.dev/tasks/file-tasks.html#arguments) with the `USAGE` directive:

```sh title=".mise/tasks/content"
#!/usr/bin/env bash

# https://usage.jdx.dev/
#USAGE flag "-w --watch" help="Run in watch mode"

#MISE description="Prepares content for building the site"
#MISE depends=["content"]
#MISE sources=["./content/**/*"]
#MISE outputs=[".content-collections/**/*"]

# - global
# shellcheck disable=SC2154
if [ "$usage_watch" = "true" ]; then
    yarn content-collections watch
else
    yarn content-collections build
fi
```

Running `mise run content`, `mise run content -w` or `mise run content --watch` allows me to make decisions about what to do in the task.

## In previous efforts

Previously I'd use a dedicated tool for task running separate for provisioning.
These were [ASDF] and [Just].

Have a look at my other post on [Python project Setup](/b/posts/2024-02-04-python-project-setup) to get an idea of what I used to do.

### Just a task runner

Just has the ability for me to write tasks on multiple lines and in what ever language I wanted.

The main issue with this is that:

- Syntax highlighting didn't work because the tasks had to be written as strings in config files (Taskfile.dev, Just)
- There wasn't enough powerful relationship tools (Just)

[Mise](https://mise.jdx.dev/) changes all that for me.

Previously in a `justfile`, I'd do something like:

```just title="justfile"
export PATH := justfile_directory() + "/node_modules/.bin:" + env_var('PATH')

default:
    @just --list

content:
  @yarn content-collections build

content_watch:
  @yarn content-collections watch
```

But now with [Mise], I can still do this in one file if I'm feeling lazy. But I can also break them out into separate bash files:

```sh
> ls -c1 .mise/tasks
storybook
test-action
typecheck
preview
serve
setup
dev
e2e
generate
lint
new-post
build
content
deploy
```

There's a few good things about this:

1. Each file can structure it's own complexity in such a way as to help focus on the core process of that task. You can abstract all the steps into functions, then compose them at the end.
2. You can abstract commonalities into a share lib. Task logic stored as a single string, or a multiline string in a config file really struggles to make this an obvious approach to the problem.
3. Syntax Colouring! Your editor is instantly able to help you see the various parts of your code, even lint it! I really struggled with this when using Taskfile or Just.
4. Everything else is just easier, but strictly speaking is still possible when using a single file approach that Just, Taskfile and the config approach of Mise require.

### Cumbersome provisioning

Initially I started on teams that only did web. There were some macosx users, but these were intel machines.

Regardless, to provision a project assisted by ASDF you may have used some custom plugins. These had to be installed before you could run `asdf install` against your `.tool-versions` file.

So I came up with a common `./setup.bash` file that would:

1. install asdf
2. conditionally add it to your `zshrc` or `bashrc`
3. detect and environment variables starting with `ASDF_PLUGIN_URL__.*` and install the plugin under that name from that url
4. run `asdf install`

Eventually the Apple M1 became a thing and there was much hype. Annoyingly it was not intel and so much teeth gnashing ensued.

Eventually this `setup.bash` metastasised to support running asdf under arm CPUs.

Oh and because it was all based on bash, none of this could be evangelised to the dot net colleagues. (no `msysgit` is not bash, I learnt that 10 years ago).

So when [Mise] turned up, it was amazing:

- It's a binary compiled... so it runs on windows too.
- Supported all the asdf plugin ecosystem. so migrating wouldn't be annoying.
- It now supports the [Aqua project](https://aquaproj.github.io/), so there's amazing supply chain attack mitigation.
- It supports VFox plugins, which are basically wasm modules. More windows support.
- describing custom asdf plugins is part of the standard configuration, which means i don't need my `setup.bash` anymore and can reduce instructions to two steps: a) Install mise, b) run `mise install`

## Conclusion

Use [Mise](https://mise.jdx.dev/). Save yourself the time and headache of not using [Mise](https://mise.jdx.dev/).
