---
date: 2025-08-20
title: "Blue Green with Traefik: Container Orchestration with mise Beyond Terraform"
stage: published
---

This is part 3 of my blue-green deployment journey. After setting up [Proxmox infrastructure with Terraform](/posts/2025-08-15-blue-green-with-traefik-part-2-proxmox-pivot), I needed to manage the actual application deployments and blue-green switching logic.

## Container Orchestration Evolution

Now I had infrastructure, but I still needed to manage the actual application deployments and blue-green switching logic.

**Why Terraform Wasn't Right for Container Management:**

Terraform lacks control structures like loops or conditionals, making it awkward for operational tasks that need dynamic logic. Container orchestration often requires "if this, then that" decision making that Terraform simply can't handle elegantly.

It also wasn't obvious if using terraform here would destroy any running containers or networks in the pursuit of idempotency. I wanted a tool that could manage the lifecycle of containers without risking unintended deletions.

**The mise Task System:**

I'd been using [mise](https://mise.jdx.dev/) for a while now. Most people use it as a replacement for ASDF, but a little known feature is it's sibling projects [usage](https://usage.jdx.dev/).

Combine this with File Tasks, and mise quickly becomes a nicely scalable task runner.

Here I aim to organise the deployment workflow into distinct phases:

- **Environment creation**: `mise env:create whoami dev dev.example.com`
  - Creates Traefik configuration files for the environment
- **Environment deployment**: `mise env:deploy context-name whoami dev`
  - Pushes the router configs to the running Traefik instance
- **Application deployment**: `mise app:deploy context-name dev whoami v1.2.0`
  - Deploys containers with proper labels for preview URLs
- **Application promotion**: `mise app:promote context-name whoami dev v1.2.0`
  - Moves a deployment to the inactive blue/green slot
- **Slot switching**: `mise env:switch context-name whoami dev`
  - Flips traffic between blue and green slots
- **Status checking**: `mise env:status context-name whoami dev`
  - Shows current active/inactive slots and deployments

**Modular Helper Architecture:**

The mise tasks use modular bash helpers for reusability:

```bash
# .mise/helpers/stack-operations - naming and config functions
# .mise/helpers/traefik - Traefik configuration management
# .mise/helpers/docker-network - network connectivity
# .mise/helpers/docker-volume - volume management
```

Each helper has a single responsibility and can be tested independently.

**Environment-Based Deployment System:**

The key insight was treating each deployment as a unique stack:

1. **Preview deployments** get their own URL: `v1.2.0-whoami.dev.example.com`
2. **Blue/green slots** share the main URL: `whoami.dev.example.com`
3. **Inactive slot testing** via: `vnext-whoami.dev.example.com`

**Stack Naming Convention:**

Every deployment follows `app-env-version` naming:
- `whoami-dev-v1.2.0` (Docker Compose project name)
- Creates network: `whoami-dev-v1.2.0_default`
- Maps to hostname: `v1.2.0-whoami.dev.example.com`

This ensures no naming conflicts and makes deployments easily identifiable.

## What's Next

Now I had the orchestration system, but I needed the actual blue-green routing implementation. The remaining posts cover:

- **[Part 4: Dynamic Configuration Architecture](/posts/2025-08-22-blue-green-with-traefik-part-4-architecture)** - Core Traefik blue-green routing setup
- **[Part 5: Deployment Workflows and mise Integration](/posts/2025-08-25-blue-green-with-traefik-part-5-deployment-workflows)** - Complete deployment workflows
- **[Part 6: CI/CD Integration and Production Considerations](/posts/2025-09-01-blue-green-with-traefik-part-6-cicd-production)** - GitHub Actions and production lessons