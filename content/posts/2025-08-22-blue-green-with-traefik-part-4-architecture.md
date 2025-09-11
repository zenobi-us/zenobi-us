---
date: 2025-08-22
title: "Blue Green with Traefik Part 4: Dynamic Configuration Architecture"
stage: draft
---

This post shows the core blue-green architecture using Traefik's dynamic configuration system. If you want to understand the infrastructure journey that led here, check out the previous posts:

- [Part 1: Setting up libvirt Bridge Networking on Fedora](/posts/2025-08-02-blue-green-with-traefik-part-1-libvirt-networking)
- [Part 2: From libvirt to Proxmox Infrastructure as Code](/posts/2025-08-15-blue-green-with-traefik-part-2-proxmox-pivot)
- [Part 3: Container Orchestration with mise Beyond Terraform](/posts/2025-08-20-blue-green-with-traefik-part-3-container-orchestration)

For the deployment workflows and mise integration, see [Part 5: Deployment Workflows](/posts/2025-08-25-blue-green-with-traefik-part-5-deployment-workflows).

## Goal

I want to implement blue-green deployments with Docker Compose and Traefik that support:

- **Preview environments**: Every deployment gets its own subdomain (v1.2.0-app.dev.example.com)
- **Blue-green switching**: Seamless traffic switching between versions
- **Quick rollbacks**: Instant rollback capability without redeployment
- **Network isolation**: Each deployment runs in its own Docker network
- **Single service definition**: No blue/green services defined in docker-compose.yml

Requirements:
- Use Traefik dynamic configuration (not static files)
- Single service definition in Docker Compose
- Support for wildcard subdomains
- Automated deployment workflows

## The Blue-Green Architecture

After exploring different infrastructure approaches in the previous posts, we continue with the routing and deployment architecture.

The core blue-green implementation uses Traefik's dynamic configuration and weighted routing.


**Dynamic Hostname Pattern System:**

Each environment has a configuration file with hostname templates that get populated at deployment time:

```yaml
# infra/traefik/whoami_dev.config.yaml
main:
  web:
    router: whoami-dev-web
    service: whoami-dev-web
  api:
    router: whoami-dev-api
    service: whoami-dev-api

vnext:
  web:
    router: whoami-dev-web_vnext
    service: whoami-dev-web_vnext
  api:
    router: whoami-dev-api_vnext
    service: whoami-dev-api_vnext

stack:
  hostname_pattern: "{{version}}-whoami.dev.example.com"
  web:
    hostname_pattern: "{{version}}-whoami.dev.example.com"
  api:
    hostname_pattern: "api.{{version}}-whoami.dev.example.com"
```

During deployment, `{{version}}` gets replaced with the actual version:
- `v1.2.0-whoami.dev.example.com` (preview URL)
- `vnext-whoami.dev.example.com` (inactive slot testing)
- `whoami.dev.example.com` (main production URL)

**Traefik Weighted Routing Configuration:**

The blue-green switching happens through Traefik's weighted services in `whoami_dev.yaml`:

```yaml
http:
  routers:
    whoami-dev-web:
      rule: Host(`whoami.dev.example.com`)
      service: whoami-dev-web

    whoami-dev-web_vnext:
      rule: Host(`vnext-whoami.dev.example.com`)
      service: whoami-dev-web_vnext

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
    whoami-dev-web_vnext:
      loadBalancer:
        servers: []
    whoami-dev-web_green:
      loadBalancer:
        servers: []
    whoami-dev-web_blue:
      loadBalancer:
        servers: []
```

Initially, green has 100% traffic, blue has 0%. Switching flips these weights.

**Three Routing Patterns:**

1. **Production pattern**: `whoami.dev.example.com` - Uses weighted routing between blue/green slots
2. **Preview pattern**: `v1.2.0-whoami.dev.example.com` - Direct routing to specific deployment
3. **Testing pattern**: `vnext-whoami.dev.example.com` - Routes to inactive slot for testing

**Docker Compose with Traefik Labels:**

The application containers use environment variables for dynamic labeling:

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

**Automatic Network Connectivity:**

Each deployment creates its own Docker network, but Traefik needs to connect to route traffic:

```bash
# After deployment, connect Traefik to the new stack network
docker network connect "${stack_name}_default" "$(traefik_container_name)"
```

This happens automatically in the deployment script, ensuring Traefik can reach the new containers while maintaining network isolation between different deployments.

> [!NOTE]
> Most other tutorials suggest connecting your app container to the traefik network. This ends up allowing other app containers to see each other. Instead, I connect Traefik to each app's network. This keeps app containers isolated from each other while still allowing Traefik to route traffic.

## Next Steps

This architecture provides the foundation for blue-green deployments. The next posts in this series cover:

- **[Part 5: Deployment Workflows](/posts/2025-08-25-blue-green-with-traefik-part-5-deployment-workflows)** - The mise task system, environment management, and rollback procedures
- **[Part 6: CI/CD Integration](/posts/2025-09-01-blue-green-with-traefik-part-6-cicd-production)** - GitHub Actions integration and production considerations

The combination of Traefik's dynamic configuration and Docker's network isolation creates a powerful foundation for safe, fast deployments with instant rollback capabilities.
