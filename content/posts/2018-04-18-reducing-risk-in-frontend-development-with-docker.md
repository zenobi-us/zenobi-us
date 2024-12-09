---
template: article
date: 2018-04-18
title: Reducing Risk in Frontend Development with Docker
stage: published
tags:
  - nodejs
  - docker
  - frontend
---

You and your team have been working on a website for the last couple of weeks, everything is good. But now there's a new team member and they need to get their machine setup.

Perhaps you'd goto to the NodeJS website and download whatever version, run the installer and attempt to install the tools for your project.

Or maybe you've discovered that you need a better way to manage the versions of nodejs you need. So you go an install Nodist or Nvm depending on your operating system.

Then you'd try and install the projects tools, because you're a smart cookie you've described all this in your `package.json`. Hopeful faces abound as you run `npm install`.

But now you're experiencing mysterious installation issues, `pngquant` won't install for some reason, `node-sass` can't find some binding thing, and there's a problem with something being too long.

This was the state of affairs around 2016-2018.

> [!NOTE]
> Retrospective from 2020: It roughly continues to be the case in 2020.

If only there was a more reliable way to get a new team member up and running with the project, A way to ensure that your project doesn't rely on 3rd party repositories to make a build.

There is; here's what I've learnt.

## The Risks

Writing and delivering software comes with a lot of tradeoffs, managing these should be done with informed decisions. 

I'm going to outline the risks I encountered.

### Engine Version Managers

New Nodejs versions are released frequently, mostly with new shiny features.

So you'd have to ensure that once you got everything working, that you also specified what version of node to use.

They work nicely on macosx and linux, because bash is awesome. but bash doesn't exist on windows... so yeah, you'll be managing two sets of manifests to describe the environment.

### Tasks Runners and Makefiles

Make doesn't exist on windows, and even if it did, your engineers might suffer hubris and just write everything to only work in `bash`. 

These tasks are a valuable time saver for the team; But they should work on any machine in any environment... bit of a pipe dream, but the Ansible and Terraform guys didn't think so... maybe we can get some middle ground?

### Virtual Machines

Five years ago, teams working on Django, Symphony, Ruby on Rails or Laravel would use a Virtual Machine (VM) tool like Virtualbox (kvm, VMWare, etc) to bake an operating system along with the project and its dependencies into an image of a disc.
You'd end up with an image that could be anywhere from 1-4gb depending on your choice of operating system, and that's just to start.... this image grows because copy on write file-systems are `teh lulz`. 

Windows and .Net developers however seem to handle this differently. I've never met or heard of anyone in that area creating a VM containing Windows, IIS and MSSQL, probably because they're used to downloading and storing dependencies in their project since the dawn of time, or more likely because such an image would end up being 20-60gb.

If you didn't use Vagrant, your VM image is now ready for use.

I actually used Vagrant in the past to simulate my production environment while coding. It's great way to be exposed to production problems sooner, which means you won't code your self into a corner because you didn't realise x library doesn't communicate across the network layer.

Downside is that VMs are slow. start up times are slow, syncing files between host and VM is slow and tricky and running even one VM uses up huge amounts of host memory.

Once you start the VM, the resources it needs are isolated from your host system until you stop it.

### Primary Risks

Show stoppers I've encountered:

- package author removes their package from npm (padleft)
- packages have post install compile steps, which the package author isn't mitigating or hasn't tested. Post build step performs network operations _will_ fail.
- Our internet connection died because Telstra technician unilaterally decides to unplug our router/modem
- Some problem with intermediate caching on our machines is causing an incorrect package to be installed.
- Python wasn't installed, so node-gyp doesn't run, so can't install node-sass.
- Node-gyp wasn't installed globally.
- Didn't have the right version of Python...
- Random version of MSbuild wasn't installed, some post install build process defined a node-gyp step that requires it.
- Git wasn't installed, or more precisely it was un-installed and team member decided that the git bundled with SourceTree was good enough.
- Some post build processes attempt to clean-up, but can't because some aspects of windows don't like paths longer than 256 characters.
- Package author doesn't like windows, won't account for it and is hostile to any suggestions that their architecture contributes to the monumental amount of bug tickets regarding installation of their package.

These are just the ones I can remember, but to narrow them down into defined domains lets call them:

- "hostile deprecation"
- "network dependant"
- "ignorant post installation"
- "obscure system requirements" -- apparently.

### Hostile Deprecation

every time you `npm i` or `pip install` or `bundle install` or `nuget install` you're at the mercy of people like the author of `pad-left` or `imagemin`.

Some of these authors are doe eyed enthusiastic people, they've yet to encounter what a colleague of mine explained to me as:

> We are like diamonds, slowly eroded by the persistent drips of reality into thin lubricating substance that keeps software running smoothly.
> _-- Anon Colleague_

What's that? you can't install a package and you have to create a prod build for deployment in an hour... oh what a shame.

### Network Dependant

This is a big one, and it's not just a problem for nodejs developers. It's a problem for anyone who relies on a package manager to install dependencies.

Your internet connection is not reliable, it's not fast and it's not secure. You have no control over it, and you're at the mercy of your ISP and the people who work for them.

If you're lucky, you'll have a good connection and you'll be able to install all your dependencies in a timely manner. If you're unlucky, you'll have to wait for the next day to try again.

In a commerical environment, this is a huge problem.

### Ignorant Post Installation

This is a problem that is not unique to nodejs, but it's a problem that is unique to the way nodejs packages are installed.

When you install a package, you're at the mercy of the package author. They can do whatever they want in the post install step, and you have no way of knowing what they're doing.

This is a problem because it's not uncommon for a package author to do something like:

```bash
$ make compile --assume-linux-or-osx
```

or

```bash
wget https://some-website.com/some-file.tar.gz
tar -xvf some-file.tar.gz
```

Notice how the url isn't versioned? or how the file isn't checksummed? or how the file isn't cached?

### Obscure System Requirements

When NodeJS came out, it attracted a lot of people who were not developers. They were people who were interested in the web, but didn't want to learn how to code.

Some of these people were not aware that previous languages had already solved a lot of problems that the NodeJS community were now embarking upon.

Often these types of developer would assume that the only operating system that mattered was the one they were using, and that everyone else should just use that.

I know this, because it's how I used to think.

Packages from these authors were often not tested on windows... not even with the freely available windows vms provided by Microsoft.

## Where to from here?

Over the last two years at Fusion, I've had to move outside the well crafted world of linux into that of MacOSx and Windows (7 and 10).

Each of these systems have different ways of doing things on the filesystem, they have different ways of interpreting code. While NodeJS claims to be cross-platform (and it is to a large degree), the reality is that most module authors are on linux or macosx, the automated tests they write rarely run cross platform or on multiple versions of node.

As a frontend developer there are some things I've learnt with regards to the tooling we use, the solutions I came up with as I reached our current game plan were influenced by what I learnt while commercially developing Django projects.

### Docker

1. everything goes in the container
2. the container is where you do development
3. the container is where you run tests
4. the container is where you build the project
5. You can either deploy the image and run it, or it can be used to output your artifacts for something else to use.

### Docker Compose

This recently changed from being called Fig and having a `fig.yml` file to Docker Compose with a `docker-compose.yml` file.

1. docker-compose is used to orchestrate the containers, define the environment variables ad the mounted paths from the host.
2. We can use this file to make running the docker image in various ways easier, since our image will most likely require lots of different inputs

### Dockerfile

What most tutorials and articles won't touch on when it comes to building the image is how best to handle `node_modules` and the volume mounting in your compose file.

The usual process goes like: 

1. add the `package.json` 
2. run `npm install` (or some variation of it)
3. then add the rest of the project

This is nice if your CI system has a long lived cache. Ours did since our build server is hosted in the same city at a secure hosting facility. 

For everyone else though, your docker environment is most likely ephemeral. So you're going to want a different strategy to avoiding lengthy install times.

Some strategies that float around the internet involve a separate dockerfile that creates a base image with just your `package.json` and the `node_modules`. This only gets rebuilt when the `package.json` changes.
Your main image uses the base image as it's base layer.

End result here is that for most builds, you'll just be rebuilding the main image thus significantly speeding up your builds and deploys.

### How does Docker mitigate all the above risks? 

- Version Managers
	- no need any more, the docker image has the tooling baked in. Above I mentioned two images, but you can definitely split it into three or more.
- Task Runners
	- now that your development environment is in the container, you can run commands there
- Virtual Machines
	- your docker images are going to be a lot smaller than the VM images, since you're not carrying around the rest of the operating system
	- A docker container only isolates resources from the host OS if explicitly asked to do so. In all other cases (the default), resources are only used as they are needed, just like any other process on your machine.
- Absent tooling
	- your base image can provide all the tooling.
-  Hostile Deprecation of Dependencies 
	- Now that you have a docker image, you have a snapshot of your installed dependencies.
	- Other team members only need to download the image and get going.
- Ignorant Post Installation Steps
	- now that your development environment is Linux, all post install steps should work since there isn't is going to be an opensource project where they only perform CI on osx.

There's most likely many things I've missed or not covered, so I only intended this to be a record of where I was at in 2018.

