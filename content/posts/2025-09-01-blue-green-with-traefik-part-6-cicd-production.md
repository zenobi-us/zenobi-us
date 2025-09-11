---
date: 2025-09-01
title: "Blue Green with Traefik Part 6: CI/CD Integration and Production Considerations"
stage: draft
---

This final post in the blue-green deployment series covers CI/CD integration, production monitoring, and lessons learned from implementing this system. If you haven't read the previous posts, I recommend starting with the architecture overview.

Complete series:
- [Part 1: Setting up libvirt Bridge Networking on Fedora](/posts/2025-08-02-blue-green-with-traefik-part-1-libvirt-networking)
- [Part 2: From libvirt to Proxmox Infrastructure as Code](/posts/2025-08-15-blue-green-with-traefik-part-2-proxmox-pivot)
- [Part 3: Container Orchestration with mise Beyond Terraform](/posts/2025-08-20-blue-green-with-traefik-part-3-container-orchestration)
- [Part 4: Dynamic Configuration Architecture](/posts/2025-08-22-blue-green-with-traefik-part-4-architecture)
- [Part 5: Deployment Workflows and mise Integration](/posts/2025-08-25-blue-green-with-traefik-part-5-deployment-workflows)

## GitHub Actions Integration

The mise deployment workflows integrate seamlessly with GitHub Actions, enabling fully automated CI/CD pipelines.

### Basic Deployment Pipeline

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
          mise app:deploy production-ssh whoami dev $VERSION docker-compose.yml

          echo "Preview deployed: https://$VERSION-whoami.dev.example.com"
```

### Environment-Based Deployment Triggers

Different environments trigger based on Git events:

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

### Stack Version Management with Unique Identifiers

The system uses semantic version tags combined with Git information for unique stack identification:

```bash
# Version generation strategy
generate_version() {
    if [[ -n "$GITHUB_REF_NAME" ]]; then
        # Tagged release
        echo "$GITHUB_REF_NAME"
    elif [[ -n "$GITHUB_PR_NUMBER" ]]; then
        # Pull request
        echo "pr-$GITHUB_PR_NUMBER"
    else
        # Main branch or feature branch
        echo "$(git rev-parse --short HEAD)"
    fi
}

VERSION=$(generate_version)
STACK_NAME="whoami-dev-$VERSION"
```

This ensures:
- **Unique identifiers**: No deployment collisions
- **Traceable versions**: Easy to map back to Git history
- **Readable URLs**: Semantic versions in hostnames when possible

### Promotion Workflow from Preview to Production

The automated promotion pipeline includes safety checks and approvals:

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
          mise app:promote production-ssh whoami prod $VERSION

          # Test inactive slot
          sleep 5
          curl -f https://vnext-whoami.prod.example.com/health

      - name: Switch Traffic (Manual Approval Required)
        run: |
          echo "Ready to switch production traffic"
          echo "Current inactive slot: https://vnext-whoami.prod.example.com"
          echo "Will become: https://whoami.prod.example.com"

          # This step requires manual approval in GitHub Actions
          mise env:switch production-ssh whoami prod
```

## Monitoring and Health Check Integration

### Application Health Checks

Each service includes health check endpoints that integrate with the deployment pipeline:

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

### Traefik Health Check Integration

Traefik automatically removes unhealthy containers from load balancing:

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

### Deployment Monitoring

Post-deployment monitoring ensures the system is working correctly:

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

## Lessons Learned

### What Worked Well

**The Hybrid Infrastructure Approach (Terraform + Ansible + mise):**
- **Terraform**: Perfect for infrastructure provisioning (VMs, networks, DNS)
- **Ansible**: Excellent for system configuration (Docker, Traefik, certificates)
- **mise**: Ideal for application deployment and runtime orchestration

This separation of concerns proved invaluable:
- **Infrastructure changes**: Rare, well-planned, version controlled
- **Application deployments**: Frequent, fast, automated
- **System configuration**: Occasional, documented, reproducible

**Infrastructure-as-Code + Runtime Orchestration Separation:**

The clear boundary between "infrastructure" (Terraform/Ansible) and "applications" (mise) eliminated many deployment issues:
- **Faster deployments**: No Terraform apply needed for app changes
- **Clearer responsibilities**: Infrastructure team vs. application teams
- **Better rollbacks**: Application rollbacks don't affect infrastructure

**Performance Benefits of the Automated Deployment System:**
- **Sub-second rollbacks**: Traffic switching via Traefik weight changes
- **Parallel deployments**: Multiple versions can coexist safely
- **Network efficiency**: Traefik connects to app networks instead of vice versa

### What Didn't Work

**Terraform Container Management Limitations:**

Initially I tried to manage Docker containers with Terraform, but this created several problems:
- **Slow applies**: Every container change required full Terraform apply
- **State management**: Container state changes outside Terraform broke plans
- **Rollback complexity**: Infrastructure rollbacks for application changes were overkill

**libvirt Complexity on Modern Linux Distributions:**

The original libvirt approach (Part 1) became problematic:
- **Networking conflicts**: Modern systemd-resolved conflicts with libvirt DNS
- **Permission issues**: User vs system libvirt daemon confusion
- **Bridge networking**: Complex setup for multi-VM scenarios

Moving to Proxmox (Part 2) solved these issues but required learning new tooling.

**Hostname Resolution Challenges:**

Wildcard DNS setup proved trickier than expected:
- **Development environments**: Need for local DNS overrides
- **Certificate management**: Wildcard certificates vs individual certificates
- **Testing isolation**: Ensuring test domains don't conflict with production

Solutions included:
- **Staging domains**: Use staging.example.com vs example.com
- **Local DNS**: dnsmasq configuration for development overrides
- **Certificate automation**: Let's Encrypt with DNS challenges for wildcards

### Final Recommendations

**When to Use This Approach vs Simpler Alternatives:**

This system is worthwhile when you have:
- **Multiple environments**: Development, staging, production deployments
- **Zero-downtime requirements**: Business-critical applications
- **Multiple applications**: Shared infrastructure with app isolation
- **Team collaboration**: Multiple developers deploying simultaneously

Consider simpler alternatives if you have:
- **Single application**: Docker Compose with manual deployments might suffice
- **Infrequent deployments**: Weekly/monthly releases don't justify the complexity
- **Small team**: 1-2 developers might not need the isolation and workflow overhead

**Required Expertise and Maintenance Overhead:**

Team members should be comfortable with:
- **Docker networking**: Understanding bridge networks and container communication
- **Traefik configuration**: Dynamic configuration, middleware, and debugging
- **Linux system administration**: SSH, systemd, and troubleshooting
- **DNS management**: Wildcard domains and certificate management

Maintenance requirements:
- **Certificate renewal**: Automated with proper monitoring
- **Resource cleanup**: Manual or scripted cleanup of old deployments
- **Security updates**: Regular updates to base images and host systems
- **Monitoring setup**: Health checks, logging, and alerting configuration

**Scaling Considerations for Multiple Applications:**

As you add applications, consider:

- **Resource isolation**: CPU and memory limits per deployment
- **Network segmentation**: VLANs or additional security layers
- **Storage management**: Persistent volumes and backup strategies
- **Load balancer scaling**: Traefik performance with many services

The system scales well to 10-20 applications on a single host, beyond that consider:
- **Multiple hosts**: Load balance across multiple deployment servers
- **Container orchestration**: Kubernetes for enterprise-scale deployments
- **Service mesh**: Istio or Linkerd for complex microservice communication

## Conclusion

This blue-green deployment system with Traefik and Docker Compose provides a robust foundation for safe, fast deployments. The combination of:

- **Dynamic configuration**: Flexible routing without restarts
- **Network isolation**: Secure separation between deployments
- **Workflow automation**: Consistent, repeatable processes
- **Emergency procedures**: Direct access when automation fails

Creates a system that teams can rely on for production workloads. While it requires upfront investment in learning and setup, the operational benefits of zero-downtime deployments, instant rollbacks, and parallel testing environments make it worthwhile for teams serious about deployment quality and velocity.

The key insight is treating infrastructure and applications as separate concerns, with appropriate tools for each layer. This separation enables the agility needed for modern development workflows while maintaining the reliability required for production systems.