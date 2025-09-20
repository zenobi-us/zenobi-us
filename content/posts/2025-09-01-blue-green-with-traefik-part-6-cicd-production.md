---
date: 2025-09-01
title: "Blue Green with Traefik 6: Github Actions"
stage: published
---

Last post! This is where we hook everything up to CI/CD and I share all the ways I broke production so you don't have to.

The journey that got us here:
- [Part 1: NetworkManager ruined my week](/b/2025-08-02-blue-green-with-traefik-part-1-libvirt-networking)
- [Part 2: Proxmox actually works](/b/2025-08-15-blue-green-with-traefik-part-2-proxmox-pivot)
- [Part 3: mise is secretly amazing](/b/2025-08-20-blue-green-with-traefik-part-3-container-orchestration)
- [Part 4: Making Traefik do blue-green](/b/2025-08-22-blue-green-with-traefik-part-4-architecture)
- [Part 5: Workflows that don't suck](/b/2025-08-25-blue-green-with-traefik-part-5-deployment-workflows)

## Hooking Up GitHub Actions

Turns out, the mise commands work perfectly in CI/CD. Who would've thought?

### The Simplest Pipeline That Could Possibly Work

```yaml
name: Deploy Application
on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  deploy-preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup mise
        uses: jdx/mise-action@v2

      - name: Deploy Preview
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
        run: |
          # Extract version from Git
          VERSION=$(git describe --tags --always)

          # Deploy to preview environment
          mise app:deploy my-vm whoami dev $VERSION docker-compose.yml

          echo "Preview deployed: https://$VERSION-whoami.dev.example.com"
```

### Making Different Environments Do Different Things

Here's where it gets interesting - different Git events trigger different deployments:

```yaml
name: Multi-Environment Deployment

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  release:
    types: [published]

jobs:
  deploy-preview:
    if: github.event_name == 'pull_request'
    steps:
      - name: Deploy PR Preview
        run: |
          PR_NUMBER=${{ github.event.number }}
          mise app:deploy aws-docker-host whoami dev "pr-$PR_NUMBER" docker-compose.yml

          # Comment on PR with preview URL
          gh pr comment $PR_NUMBER --body "Preview: https://pr-$PR_NUMBER-whoami.dev.example.com"

  deploy-staging:
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Staging
        run: |
          VERSION=$(git rev-parse --short HEAD)
          mise app:deploy aws-docker-host whoami staging $VERSION docker-compose.yml
          mise app:promote aws-docker-host whoami staging $VERSION
          mise env:switch aws-docker-host whoami staging

  deploy-production:
    if: github.event_name == 'release'
    steps:
      - name: Deploy to Production
        run: |
          VERSION=${{ github.event.release.tag_name }}
          # Deploy to inactive slot first
          mise app:deploy prod-aws-docker-host whoami prod $VERSION docker-compose.yml
          mise app:promote prod-aws-docker-host whoami prod $VERSION

          # Manual approval required for production switch
          echo "Ready for production switch. Run: mise env:switch prod-aws-docker-host whoami prod"
```

### Naming Versions Without Going Insane

Figuring out what to call each deployment was harder than expected:

```bash
# What do we call this deployment?
generate_version() {
    if [[ -n "$GITHUB_REF_NAME" ]]; then
        echo "$GITHUB_REF_NAME"  # v1.2.3
    elif [[ -n "$GITHUB_PR_NUMBER" ]]; then
        echo "pr-$GITHUB_PR_NUMBER"  # pr-123
    else
        echo "$(git rev-parse --short HEAD)"  # abc123f
    fi
}

VERSION=$(generate_version)
STACK_NAME="whoami-dev-$VERSION"
```

Why this works:
- Every deployment has a unique name (no collisions!)
- You can trace any deployment back to Git
- URLs actually make sense: `pr-123-whoami.dev.example.com`

### Getting to Production Without Drama

The promotion pipeline has safety checks because I learned the hard way:

```yaml
name: Promote to Production

on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to promote'
        required: true
      environment:
        description: 'Target environment'
        required: true
        default: 'production'

jobs:
  promote:
    runs-on: ubuntu-latest
    environment: ${{ github.event.inputs.environment }}

    steps:
      - name: Health Check Preview
        run: |
          VERSION="${{ github.event.inputs.version }}"
          PREVIEW_URL="https://$VERSION-whoami.dev.example.com/health"

          # Wait for health check to pass
          for i in {1..30}; do
            if curl -f "$PREVIEW_URL"; then
              echo "Health check passed"
              break
            fi
            echo "Waiting for health check... ($i/30)"
            sleep 10
          done

      - name: Deploy to Inactive Slot
        run: |
          VERSION="${{ github.event.inputs.version }}"
          mise app:promote my-vm whoami prod $VERSION

          # Test inactive slot
          sleep 5
          curl -f https://vnext-whoami.prod.example.com/health

      - name: Switch Traffic (Manual Approval Required)
        run: |
          echo "Ready to switch production traffic"
          echo "Current inactive slot: https://vnext-whoami.prod.example.com"
          echo "Will become: https://whoami.prod.example.com"

          # This step requires manual approval in GitHub Actions
          mise env:switch my-vm whoami prod
```

## Making Sure Things Actually Work

### Health Checks That Actually Check Health

Every service needs a real health endpoint (not just "return 200"):

```yaml
# docker-compose.yml
services:
  web:
    image: traefik/whoami:v1.11
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    labels:
      - "traefik.http.routers.web-${STACK_NAME}.rule=Host(`${STACK_HOSTNAME}`)"
      - "traefik.http.services.web-${STACK_NAME}.loadbalancer.healthcheck.path=/health"
```

### Traefik as Your Safety Net

Traefik watches your health checks and pulls unhealthy containers out of rotation:

```yaml
# Traefik configuration
http:
  services:
    whoami-prod-web_blue:
      loadBalancer:
        healthCheck:
          path: /health
          interval: 30s
          timeout: 5s
        servers:
          - url: "http://whoami-prod-v1.2.0_web_1"
```

### Making Sure Your Deployment Actually Deployed

I wrote this script after too many "wait, did it deploy?" moments:

```bash
#!/bin/bash
# post-deployment-check.sh

VERSION=$1
ENVIRONMENT=$2

# Check preview URL
PREVIEW_URL="https://$VERSION-whoami.$ENVIRONMENT.example.com"
echo "Checking preview: $PREVIEW_URL"

# Test health endpoint
if ! curl -f "$PREVIEW_URL/health"; then
    echo "Health check failed for preview"
    exit 1
fi

# Test application functionality
if ! curl -f "$PREVIEW_URL/api/version" | grep -q "$VERSION"; then
    echo "Version verification failed"
    exit 1
fi

# Check Traefik service registration
TRAEFIK_API="http://traefik.internal:8080/api/http/services"
if ! curl -s "$TRAEFIK_API" | jq -e ".[] | select(.name | contains(\"$VERSION\"))"; then
    echo "Service not registered with Traefik"
    exit 1
fi

echo "All checks passed for version $VERSION"
```

## What I Learned the Hard Way

### Stuff That Actually Worked

**Using Different Tools for Different Jobs**

I ended up with this stack that just works:
- **Terraform**: For the stuff that rarely changes (VMs, networks)
- **Ansible**: For installing software and configuring systems
- **mise**: For actually deploying applications

Why this split matters:
- Infrastructure changes maybe once a month
- System configs change weekly
- Apps deploy multiple times per day

Using one tool for everything is like using a hammer for everything - technically possible but painful.

**Keeping Infrastructure and Apps Separate**

Best decision I made. Here's why:
- Deploy apps without touching infrastructure
- Different teams can own different pieces
- Rolling back an app doesn't mess with your network config

**Speed Improvements That Shocked Me**
- Rollbacks happen in under a second (literally just changing weights)
- Can run 10 different versions at once without them fighting
- That network trick (Traefik joining app networks) cut latency in half

### Stuff That Failed Spectacularly

**Trying to Terraform Everything**

I tried managing containers with Terraform. Don't do this. Here's why:
- Every tiny change = 5 minute Terraform apply
- Container restarts randomly because Terraform
- "Let me rollback this app" *accidentally destroys database*

**The libvirt Nightmare**

Remember Part 1? Let me save you the pain:
- systemd-resolved and libvirt hate each other
- "Should I use user or system daemon?" (Answer: Neither, use Proxmox)
- Bridge networking that works 60% of the time, every time

I wasted two weeks on libvirt. Just use Proxmox or actual cloud VMs.

**DNS and Hostnames Are Always Harder Than Expected**

Wildcard DNS sounds simple until you actually try it:
- Dev environments need local DNS hacks
- Wildcard certs are great until they're not
- "Why is staging talking to production?" (spoiler: DNS)

What actually worked:
- Different domains for different environments (dev.example.com, staging.example.com)
- dnsmasq for local development (after trying 5 other things)
- Let's Encrypt DNS challenges (HTTP challenges are a trap)

### Should You Build This?

**Use This Approach When:**
- You deploy more than once a week
- Downtime costs real money
- Multiple devs are deploying different things
- You need preview environments for every PR

**Just Use Docker Compose When:**
- You deploy monthly
- It's a side project
- You're the only developer
- 30 seconds of downtime won't kill anyone

**What Your Team Needs to Know:**

The non-negotiables:
- How Docker networking actually works (not just docker-compose up)
- Basic Traefik debugging (you will need this at 3 AM)
- Enough Linux to SSH in and fix things
- How DNS works (wildcards aren't magic)

Ongoing maintenance reality:
- Certificates will expire (automate this or suffer)
- Old deployments eat disk space (cleanup script time)
- Security updates every month (or get hacked)
- Monitoring that actually tells you when things break

**When You Outgrow This Setup:**

This works great for 10-20 apps on one host. After that:

First signs of trouble:
- CPU/memory fights between apps
- Network getting weird and slow
- Disk I/O becomes the bottleneck
- Traefik config file is 10,000 lines

Time to level up to:
- Multiple hosts with a real load balancer
- Kubernetes (yeah, I know, but sometimes you need it)
- Service mesh if you hate yourself (kidding, Istio is fine)

## The Bottom Line

After all this work, here's what I ended up with:

- Zero-downtime deployments that actually have zero downtime
- Rollbacks that take literally one second
- Every PR gets its own preview URL automatically
- Production doesn't break (as much)

Was it worth it? Hell yes. The upfront pain of figuring all this out paid off the first time I rolled back production at 2 AM without waking anyone up.

The big revelation: stop trying to use one tool for everything. Infrastructure tools for infrastructure, deployment tools for deployments. Revolutionary, I know.

If you're deploying more than weekly and downtime makes people yell at you, build something like this. If not, stick with docker-compose and manual deployments - seriously, it's fine.

The real win isn't the technology - it's being able to deploy on Friday afternoon without fear. That's worth all the NetworkManager debugging in the world.