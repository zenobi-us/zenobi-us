---
date: 2025-08-22
title: "Blue Green with Traefik 4: Traefik Dynamic"
stage: published
---

This post is where things get interesting - the actual blue-green magic with Traefik. If you want the full story of how I got here (spoiler: it involved pain), check out:

- [Part 1: My libvirt networking nightmare](/b/2025-08-02-blue-green-with-traefik-part-1-libvirt-networking)
- [Part 2: Proxmox saves the day](/b/2025-08-15-blue-green-with-traefik-part-2-proxmox-pivot)
- [Part 3: Making mise do the heavy lifting](/b/2025-08-20-blue-green-with-traefik-part-3-container-orchestration)

## What I Actually Wanted to Build

After all that infrastructure wrestling, here's what I was after:

- **Preview URLs for everything**: Deploy v1.2.0? Boom, it's at `v1.2.0-app.dev.example.com`
- **Instant traffic switching**: Click a button (or run a command) to switch versions
- **Rollback without sweating**: Something broke? Switch back in seconds, no redeployment
- **Containers that mind their own business**: Each version in its own network, no cross-talk
- **One Docker Compose file**: Not separate blue/green services - that way lies madness

The non-negotiables:
- Traefik needs to reload configs without restarting (dynamic configuration FTW)
- One service definition that works everywhere
- Wildcard DNS because I'm not updating DNS for every deployment
- It has to be scriptable - no clicking around in UIs

## How the Magic Actually Works

Alright, so here's where Traefik earns its keep. The whole thing revolves around weighted routing - basically telling Traefik "send X% of traffic here, Y% there".


**Making Hostnames Work Without Going Crazy**

Each environment gets a config file with templates. When you deploy, these templates get filled in:

```yaml
# infra/traefik/whoami_dev.config.yaml
main:
  web:
    router: whoami-dev-web
    service: whoami-dev-web
  api:
    router: whoami-dev-api
    service: whoami-dev-api

stack:
  hostname_pattern: "{{version}}-whoami.dev.example.com"
  web:
    hostname_pattern: "{{version}}-whoami.dev.example.com"
  api:
    hostname_pattern: "api.{{version}}-whoami.dev.example.com"
```

That `{{version}}` gets swapped out for the real version number. So you get:
- Preview: `v1.2.0-whoami.dev.example.com` (for testing)
- Production: `whoami.dev.example.com` (what users hit)

**The Secret Sauce - Weighted Routing**

This is where it gets cool. Traefik can split traffic between multiple backends:

```yaml
http:
  routers:
    whoami-dev-web:
      rule: Host(`whoami.dev.example.com`)
      service: whoami-dev-web

  services:
    # Main router with weighted blue/green split
    whoami-dev-web:
      weighted:
        services:
          - name: whoami-dev-web_green@file
            weight: 100
          - name: whoami-dev-web_blue@file
            weight: 0

    # Individual slot services (populated by deployments)
    whoami-dev-web_green:
      loadBalancer:
        servers: []
    whoami-dev-web_blue:
      loadBalancer:
        servers: []
```

Start with green getting 100%, blue getting 0%. Want to switch? Just flip those numbers. No containers restart, no downtime, traffic just starts flowing to the other color.

**Two Ways Traffic Gets to Your App**

1. **Production traffic**: Hits `whoami.dev.example.com`, goes through the weighted router
2. **Preview/testing**: Goes straight to `v1.2.0-whoami.dev.example.com`, bypasses the weights

**Making Docker Compose Play Along**

Here's the trick - use environment variables for everything so the same compose file works everywhere:

```yaml
services:
  web:
    image: traefik/whoami:v1.11
    environment:
      - STACK_NAME=${STACK_NAME}
      - STACK_HOSTNAME=${STACK_HOSTNAME}
      - STACK_VERSION=${STACK_VERSION}
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.web-${STACK_NAME}.rule=Host(`${STACK_HOSTNAME}`)"
      - "traefik.http.services.web-${STACK_NAME}.loadbalancer.server.port=80"
      - "stackenv.version=${STACK_VERSION}"

  api:
    image: reachfive/fake-api-server:0.1.1
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.api-${STACK_NAME}.rule=Host(`api.${STACK_HOSTNAME}`)"
      - "traefik.http.services.api-${STACK_NAME}.loadbalancer.server.port=1090"
```

When this runs in preview mode, it only responds to `v1.2.0-whoami.dev.example.com`. But promote it to blue or green? Now it's also getting traffic from the main `whoami.dev.example.com` URL (assuming health checks pass - we're not barbarians).

**The Network Connectivity Trick Nobody Tells You**

Every deployment creates its own Docker network. But Traefik needs to reach all of them. Here's the magic:

```bash
# After deploying your app, connect Traefik to its network
docker network connect "${stack_name}_default" traefik
```

This flips the usual pattern on its head. Most tutorials tell you to connect your apps to Traefik's network.

```nomnoml
#direction:down
#.frame: direction=right

[World] <--> [Traefik] <--> [Traefik Network]
[<frame>Traefik Network|
 [Traefik] <--> [Stack1:App Container]
 [Traefik] <--> [Stack2:App Container]
]
[<frame>Stack1 Network|
  [Stack1:App Container]
  [Stack1:Db Container]
  [Stack1:Worker Container]

]
[<frame>Stack2 Network|
  [Stack2:App Container]
  [Stack2:Db Container]
  [Stack2:Worker Container]
]
[Stack1 Network] --> [Traefik Network]
[Stack2 Network] --> [Traefik Network]

```

But that's dumb - now all your apps can see each other!

Instead, I make Traefik join each app's network. Your apps stay isolated, Traefik can still route to them. Security people love this one weird trick.


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

For those of you who are over confident in your ability to secure your system or too naive to know that it's not a matter of "if" but a matter of "when" your system will be compromised. So you really want to be doing everything you can to isolate things.

## Next Up

Now we've got the architecture, but how do you actually use this thing day-to-day? Check out:

- **[Part 5: Deployment Workflows](/b/2025-08-25-blue-green-with-traefik-part-5-deployment-workflows)** - Making deployments not suck with mise
- **[Part 6: CI/CD Integration](/b/2025-09-01-blue-green-with-traefik-part-6-cicd-production)** - Hooking this up to GitHub Actions and not breaking production

This setup gives you instant rollbacks, zero-downtime deployments, and preview URLs for everything. And it actually works, which is more than I can say for my first 10 attempts.
