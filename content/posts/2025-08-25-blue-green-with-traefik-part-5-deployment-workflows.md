---
date: 2025-08-25
title: "Blue Green with Traefik 5: Deployment Workflows"
stage: published
---

This post covers the practical deployment workflows that make the blue-green architecture from [Part 4](/posts/2025-08-22-blue-green-with-traefik-part-4-architecture) usable day-to-day. If you haven't read the architecture post, I recommend starting there.

Previous posts in this series:
- [Part 1: Setting up libvirt Bridge Networking on Fedora](/b/2025-08-02-blue-green-with-traefik-part-1-libvirt-networking)
- [Part 2: From libvirt to Proxmox Infrastructure as Code](/b/2025-08-15-blue-green-with-traefik-part-2-proxmox-pivot)
- [Part 3: Container Orchestration with mise Beyond Terraform](/b/2025-08-20-blue-green-with-traefik-part-3-container-orchestration)
- [Part 4: Dynamic Configuration Architecture](/b/2025-08-22-blue-green-with-traefik-part-4-architecture)

## The Challenge

Having the blue-green architecture was great, but I needed practical workflows that teams could actually use day-to-day. The architecture needed to support:

- **Easy deployments**: Simple commands for deploying any version
- **Safe testing**: Preview environments and inactive slot testing
- **Quick promotions**: Moving from preview to production
- **Instant rollbacks**: No redeployment needed for rollbacks

## The Mise Task System for App Deployment

The core deployment command handles the entire process:

```bash
mise app:deploy <docker-context-name> <env-name> <app-name> <version> <docker-compose-path>
```

Internally, this orchestrates several steps:

1. **Generate stack configuration** using environment templates
2. **Deploy containers** with proper environment variables
3. **Connect Traefik** to the new stack network
4. **Clean up resources** from previous deployments

Here's what a typical deployment looks like:

```bash
# Deploy whoami version v1.2.0 to dev environment
mise app:deploy my-vm whoami dev v1.2.0 ./.deployment/app/docker-compose.yml

# This creates:
# - Stack name: whoami-dev-v1.2.0
# - Preview URL: http://v1.2.0-whoami.dev.example.com
# - API URL: http://api.v1.2.0-whoami.dev.example.com
```

## Environment Creation and Promotion Workflows

The workflow follows a clear progression:

### 1. Environment Setup (One-time per app/environment)

```bash
mise env:create whoami dev dev.example.com
mise env:deploy my-vm whoami dev
```

This creates the Traefik configuration files and sets up the blue/green routing structure.

### 2. Application Deployment (QA Testing)

```bash
mise app:deploy my-vm whoami dev v1.2.0 compose.yml
# Test at: v1.2.0-whoami.dev.example.com
```

Every deployment gets its own preview URL with the version in the hostname. This allows for:
- **Parallel testing**: Multiple versions can be tested simultaneously
- **Stakeholder reviews**: Send specific version URLs for approval
- **Debugging**: Keep problematic versions accessible for investigation

Here you can allow for "deployments to preview" from:

- commits on PR branches
- merges to main branches
- manual triggers from CI/CD systems

### 3. Promotion to Inactive Slot

```bash
mise app:promote my-vm whoami dev v1.2.0 100%
```

This deployment takes the stack out of preview and promotes it to the inactive slot (blue or green).
- **Production-like testing**: Same hostname pattern as production
- **Integration testing**: Test with production-like routing
- **Final validation**: Last check before going live

When a promotion occurs, the stack no longer has the preview hostname (`v1.2.0-whoami.dev.example.com`) but instead uses the same hostname as production `whoami.dev.example.com`.

When it's healthchecks pass, then any weight rules start applying and traffic begins arriving.

If it's healthchecks fail, then Traefik never routes traffic to it.


## Automatic Docker Network Connectivity

One of the trickiest aspects was ensuring Traefik could route to all deployments while maintaining network isolation.

The deployment script automatically handles network connectivity:

```bash
# From the deployment script
stack_name=$(StackEnvCreateName "$app" "$env" "$version")

# Deploy the stack
docker compose -p "$stack_name" up -d

# Connect Traefik to the new network
traefik_container=$(docker ps --filter "label=traefik=true" --format "{{.Names}}")
docker network connect "${stack_name}_default" "$traefik_container"
```

This approach ensures:
- **Network isolation**: Each deployment gets its own isolated network
- **Traefik access**: Traefik can reach all deployments for routing
- **Security**: Applications can't accidentally communicate across deployments

> [!NOTE]
> Most tutorials suggest connecting your app container to the traefik network. This ends up allowing other app containers to see each other. Instead, I connect Traefik to each app's network. This keeps app containers isolated while still allowing Traefik to route traffic.

## Resource Cleanup Strategy

Currently the system doesn't automatically clean up after deployments.

This is intentional for two reasons:

1. **Instant rollbacks**: I want the ability to roll back to previous versions without redeployment
2. **Debugging capability**: Keep previous versions accessible for investigation

However, this means manual cleanup is needed periodically:

```bash
# List all stacks for an application
docker stack ls | grep whoami-dev

# Remove specific old deployment
docker stack rm whoami-dev-v1.1.0
```

Future improvements could include:
- **Retention policies**: Keep last N versions automatically
- **Storage monitoring**: Clean up when disk space is low
- **Time-based cleanup**: Remove versions older than X days

## Rollback Procedures and Blue-Green Switching

Rollback is as simple as switching again:

```bash
# Current: Green slot active, Blue slot has previous version
mise env:rollback my-vm whoami dev
# Result: Blue slot now active (rollback complete)

# Check current status
mise env:status my-vm whoami dev
# Shows which slot is active and what versions are in each slot
```

The beauty of this system is that rollback doesn't require redeploying anything - it's just a traffic routing change that happens immediately.


## Deployment Workflow Benefits

This workflow system provides several key advantages:

### Developer Experience
- **Single command deployments**: No complex deployment scripts
- **Consistent interface**: Same commands work across all environments
- **Clear progression**: Preview → QA → Production path is explicit

### Safety
- **Testing at every stage**: Preview, inactive slot, then production
- **Instant rollbacks**: No redeployment needed
- **Network isolation**: Deployments can't interfere with each other

### Operations
- **Zero-downtime deployments**: Blue-green switching with no traffic interruption
- **Multiple versions**: Keep several versions running simultaneously
- **Emergency procedures**: Direct access to Traefik configuration when needed

## What's Next

This workflow foundation enables powerful CI/CD integration and production monitoring. The next post covers:

- **[Part 6: CI/CD Integration and Production Considerations](/b/2025-09-01-blue-green-with-traefik-part-6-cicd-production)** - GitHub Actions integration, monitoring, and scaling considerations

The mise integration transforms the blue-green architecture from a proof-of-concept into a production-ready deployment system that teams can use confidently every day.