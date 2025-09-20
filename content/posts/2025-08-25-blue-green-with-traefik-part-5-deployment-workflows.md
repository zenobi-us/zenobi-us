---
date: 2025-08-25
title: "Blue Green with Traefik 5: Deployment Workflows"
stage: published
---

This post is about making the blue-green setup from [Part 4](/posts/2025-08-22-blue-green-with-traefik-part-4-architecture) actually usable by humans. Because having cool architecture is pointless if nobody can figure out how to deploy stuff.

The journey so far:
- [Part 1: Fighting libvirt and losing](/b/2025-08-02-blue-green-with-traefik-part-1-libvirt-networking)
- [Part 2: Proxmox to the rescue](/b/2025-08-15-blue-green-with-traefik-part-2-proxmox-pivot)
- [Part 3: mise becomes my deployment buddy](/b/2025-08-20-blue-green-with-traefik-part-3-container-orchestration)
- [Part 4: The actual blue-green magic](/b/2025-08-22-blue-green-with-traefik-part-4-architecture)

## Making It Actually Usable

So I had this fancy blue-green architecture, but how do you actually use it? I needed something my team could use without a PhD in container orchestration:

- **Dead simple commands**: No 47-step deployment procedures
- **Test without breaking prod**: Preview environments for everything
- **Promote when ready**: Not when you're forced to
- **Panic button that works**: Rollback in seconds when things go sideways

## One Command to Rule Them All

After a lot of iteration, I landed on this:

```bash
mise app:deploy my-vm dev whoami v1.2.0 ./docker-compose.yml
```

That's it. Behind the scenes it:
1. Figures out all the naming and configuration
2. Spins up your containers with the right labels
3. Connects Traefik so traffic actually gets there
4. Cleans up the mess from last time

Real example that actually works:

```bash
# Deploy v1.2.0 to dev
mise app:deploy my-vm dev whoami v1.2.0 ./compose.yml

# You get:
# - Stack: whoami-dev-v1.2.0
# - Main app: http://v1.2.0-whoami.dev.example.com
# - API endpoint: http://api.v1.2.0-whoami.dev.example.com
```

## The Deployment Dance

Here's how deployments actually flow through the system:

### 1. First Time Setup (Do This Once)

```bash
# Create the environment configs
mise env:create whoami dev dev.example.com

# Push them to Traefik
mise env:deploy my-vm whoami dev
```

This sets up all the Traefik routing magic. You do this once and forget about it.

### 2. Deploy to Preview (Where QA Lives)

```bash
mise app:deploy my-vm dev whoami v1.2.0 compose.yml
# Test at: v1.2.0-whoami.dev.example.com
```

Every version gets its own URL. This is huge because:
- You can test 5 different versions at once without them fighting
- Send the PM a link to review without touching production
- That broken version from last week? Still there for debugging

Deploy from wherever makes sense:
- Every PR gets a preview
- Main branch deploys automatically
- That emergency fix at 2 AM

### 3. Promote to Production (But Not Really Yet)

```bash
mise app:promote my-vm dev whoami v1.2.0 100%
```

This moves your deployment to the inactive slot. Now it's using the production URL but not getting traffic yet. Smart, right?

What happens:
- Preview URL goes away (`v1.2.0-whoami.dev.example.com` stops working)
- Now responds to production URL (`whoami.dev.example.com`)
- But only gets traffic if health checks pass
- Failed health checks? Traefik ignores it completely

This is your safety net - even if you promote broken code, users never see it.


## The Network Connectivity Magic

This took me forever to figure out. Every deployment needs its own network (for isolation) but Traefik needs to reach all of them (for routing).

The deployment script handles this automatically:

```bash
# Figure out the stack name
stack_name="whoami-dev-v1.2.0"

# Deploy your app
docker compose -p "$stack_name" up -d

# Here's the magic - Traefik joins YOUR network
docker network connect "${stack_name}_default" traefik
```


```nomnoml
#direction:right
#.frame: direction=right

[World] <--> [Traefik]
[<frame>Stack1 Network|
  [Traefik] <--> [Stack1:App Container]
  [Stack1:Db Container]
  [Stack1:Worker Container]
]
[<frame>Stack2 Network|
  [Traefik] <--> [Stack2:App Container]
  [Stack2:Db Container]
  [Stack2:Worker Container]
]
[Traefik] --> [Stack1 Network]
[Traefik] --> [Stack2 Network]
```

Why this matters:
- Each app lives in its own network bubble
- Apps can't accidentally talk to each other
- But Traefik can reach everything

Most tutorials get this backwards - they tell you to connect your apps to Traefik's network. That's how you end up with apps seeing each other's databases at 3 AM. No thanks.

## The Cleanup Problem (Or: Why My Disk Is Full)

Here's a dirty secret - I don't auto-cleanup old deployments. On purpose.

Why? Two reasons:
1. **Instant rollbacks** - That version from last week? Still running, ready to switch back
2. **Post-mortem debugging** - "Why did v1.1.3 break?" Good thing it's still there to check

But yeah, eventually you need to clean house:

```bash
# See what's eating your disk
docker ps -a | grep whoami-dev

# Kill old versions
docker compose -p whoami-dev-v1.1.0 down
```

Future me will probably add:
- Keep last 5 versions, nuke the rest
- Auto-cleanup when disk hits 80%
- Delete anything older than a month

But for now, manual cleanup works fine.

## When Things Go Wrong (Rollback Time)

This is where the system shines. Something broke in production? No problem:

```bash
# Crap, green is broken! Switch back to blue!
mise env:rollback my-vm whoami dev

# Check what's actually running
mise env:status my-vm whoami dev
```

Boom. Traffic switches instantly. No redeployment, no waiting for containers to start. The old version was already running, just not getting traffic.

This saved my ass more times than I can count.


## Why This Actually Works

After using this for months, here's what makes it worth the setup:

### For Developers
- One command to deploy (not a 10-page runbook)
- Same process everywhere (dev, staging, prod)
- You can actually understand what's happening

### For Not Breaking Things
- Every deployment gets tested before users see it
- Rollback is instant (like, actually instant)
- Deployments can't mess with each other

### For Ops People
- Zero downtime (users don't even notice)
- Run multiple versions simultaneously (A/B testing anyone?)
- When automation fails, you can still fix things manually

## What's Next

Now that we can deploy without crying, time to automate everything:

- **[Part 6: CI/CD and Not Breaking Production](/b/2025-09-01-blue-green-with-traefik-part-6-cicd-production)** - GitHub Actions, monitoring, and lessons from breaking production (so you don't have to)

This mise setup turned my theoretical blue-green architecture into something my team actually uses. And likes. Which honestly surprised everyone, including me.