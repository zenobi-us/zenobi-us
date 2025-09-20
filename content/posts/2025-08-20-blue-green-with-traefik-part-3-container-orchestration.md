---
date: 2025-08-20
title: "Blue Green with Traefik 3: Container Orchestration"
stage: published
---

This is part 3 of my blue-green deployment journey. After getting [Proxmox working with Terraform](/b/2025-08-15-blue-green-with-traefik-part-2-proxmox-pivot), I had VMs that actually worked. Now came the fun part - actually deploying stuff.

## Terraform Wasn't Cutting It

So I had this bright idea - why not manage Docker containers with Terraform too? I mean, it worked great for VMs, right?

<img src="/images/javier-bardem-silvia-villain.png" class="flex mx-auto rounded-lg" />

Wrong. So wrong.

---

### Here's Why Terraform Sucks for Containers

First off, Terraform has no real logic.

No loops, no if-statements, nothing.

You want to check if a container is healthy before routing traffic?

Too bad. Terraform doesn't do that.

But the real kicker? I had no idea what Terraform would do to my running containers. Would it restart them? Delete them? Who knows! The docs sure didn't tell me. I needed something that wouldn't accidentally nuke my production containers while trying to be "idempotent".

### Finding Gold with mise

I'd been using [mise](https://mise.jdx.dev/) for managing tool versions (you know, instead of having 47 different tools to manage versions of various languages floating around). But something most people don't know about - it's also a task runner. Not just any task runner, but one that actually makes sense.

There's this sibling project called [usage](https://usage.jdx.dev/) that lets you add comments to your task scripts to help with managing script inputs. Combine that with mise's file tasks, and suddenly you've got yourself a deployment system that doesn't suck.

So I broke everything down into simple commands that actually tell you what they do:

- **Create environment**: `mise env:create whoami dev dev.example.com` - Sets up Traefik configs
- **Deploy the configs**: `mise env:deploy docker-host whoami dev` - Pushes them to Traefik
- **Deploy your app**: `mise app:deploy docker-host dev whoami v1.2.0` - Spins up containers
- **Promote to production**: `mise app:promote docker-host whoami dev v1.2.0 75%` - Gradually shift traffic
- **Check what's running**: `mise env:status docker-host whoami dev` - See what's actually happening

**Breaking It Down Into Bash (Because Why Not?)**

Instead of one giant deployment script that nobody understands, I split everything into small bash helpers:

```bash
# .mise/helpers/stack-operations - handles naming things consistently
# .mise/helpers/traefik - talks to Traefik without breaking everything
# .mise/helpers/docker-network - connects containers without the pain
# .mise/helpers/docker-volume - manages volumes so you don't lose data
```

Each helper does one thing. When something breaks (and it will), you know exactly where to look.

**Brainlet Moment - Every Deployment Gets a URL**

I'm not sure if this will be a good idea, but instead of trying to juggle "current" and "next" versions, every single deployment gets its own unique URL:

1. **Preview URLs**: Every version gets `v1.2.0-whoami.dev.example.com` - test it without touching production
2. **Production URL**: The main `whoami.dev.example.com` that users actually hit

So instead of thinking about the `prod`, `dev`, `stg` urls as being tied to a particular bucket where items are only reachable when moved into that "bucket", we instead give every deployment its own unique URL, and promotion is simply a matter of give that deployment an alias to the production URL.

More on how we do this in the next post.

**Naming Things So You Don't Go Insane**

Every deployment follows the same pattern: `app-env-version`
- Docker calls it: `whoami-dev-v1.2.0`
- Network becomes: `whoami-dev-v1.2.0_default`
- URL becomes: `v1.2.0-whoami.dev.example.com`


No more "wait, which container is production again?" at 3 AM during an outage.

## What's Next

Alright, so now I could deploy stuff without it exploding. But I still needed to figure out the actual blue-green routing magic. The next posts cover:

- **[Part 4: Dynamic Configuration Architecture](/b/2025-08-22-blue-green-with-traefik-part-4-architecture)** - Core Traefik blue-green routing setup
- **[Part 5: Deployment Workflows and mise Integration](/b/2025-08-25-blue-green-with-traefik-part-5-deployment-workflows)** - Complete deployment workflows
- **[Part 6: CI/CD Integration and Production Considerations](/b/2025-09-01-blue-green-with-traefik-part-6-cicd-production)** - GitHub Actions and production lessons