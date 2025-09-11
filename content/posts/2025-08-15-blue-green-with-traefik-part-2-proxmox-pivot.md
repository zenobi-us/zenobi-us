---
date: 2025-08-15
title: "Blue Green with Traefik: From libvirt to Proxmox Infrastructure as Code"
stage: published
---

This is part 2 of my blue-green deployment journey. After struggling with [libvirt bridge networking on Fedora](/posts/2025-08-02-blue-green-with-traefik-part-1-libvirt-networking), I decided to try a different approach with Proxmox.

My main goal here was to be able to test out provisioning a VM to be my docker host. Once the kinks are worked out, I would switch to using Terraform to provision DigitalOcean or AWS EC2 instances.

## The Proxmox Pivot

After struggling with libvirt bridge networking, I decided to try a different approach. I put together a repo with the following parts to manage a setup like this:

- A terraform manifest to create a VM on proxmox.
- An ansible playbook to configure the VM.
- Some mise tasks written in bash to manage the lifecycle of the server (more on this in the next section)

**OpenTofu/Terraform Proxmox Configuration:**

The beauty of moving to Proxmox is the infrastructure-as-code approach becomes much cleaner. Here's the core Terraform setup:

```hcl
terraform {
  required_providers {
    proxmox = {
      source = "bpg/proxmox"
      version = "0.81.0"
    }
    curl = {
      source  = "anschoewe/curl"
      version = "1.0.2"
    }
    ansible = {
      source = "ansible/ansible"
      version = "1.3.0"
    }
  }
}

provider "proxmox" {
  endpoint  = var.proxmox_api_url
  insecure  = true # Self-signed certificates
}
```

**Automated SSH Key Management:**

One of the coolest features is automatically pulling SSH keys from GitHub:

```hcl
data "curl" "github_public_ssh_keys" {
  http_method = "GET"
  uri         = "https://github.com/${var.github_username}.keys"
}

locals {
  ssh_public_keys = split("\n", trimspace(data.curl.github_public_ssh_keys.response))
}
```

This means no more manually copying SSH keys around - the VM automatically gets configured with all your GitHub SSH keys.

**Cloud-Init Integration:**

The VM bootstrap process uses cloud-init, which is infinitely cleaner than manual setup:

```hcl
resource "proxmox_virtual_environment_vm" "docker_server" {
  name      = "docker-host"
  node_name = var.proxmox_instance_name

  initialization {
    ip_config {
      ipv4 {
        address = "10.0.1.200/24"
        gateway = "10.0.1.1"
      }
    }

    user_account {
      username = "ubuntu"
      keys     = local.ssh_public_keys
    }

    dns {
      domain = "local"
    }
  }

  # VM specs...
}
```

**Terraform → Ansible Integration:**

A vm by itself isn't useful to me, so I use the Ansible provider that runs the playbook automatically after VM creation. For those of you familiar with a world before docker, you might be familiar with this pattern from your use of Vagrant.

```hcl
resource "ansible_playbook" "playbook" {
  playbook   = "./infra/ansible/playbook.yml"
  name       = "${proxmox_virtual_environment_vm.docker_server.name}.local"
  groups     = ["docker_servers"]
  tags       = ["docker", "traefik"]
  replayable = true
  extra_vars = {
    ansible_user                 = "ubuntu",
    ansible_ssh_private_key_file = "~/.ssh/id_ed25519",
    ansible_python_interpreter   = "/usr/bin/python3",
  }
}
```

**Complexity Comparison:**

libvirt approach:
- Manual bridge interface creation
- NetworkManager wrestling
- DNS resolution debugging
- VM networking configuration
- Manual SSH key setup

Proxmox approach:
- Single Terraform file
- Declarative VM configuration
- Automatic SSH key deployment
- Built-in cloud-init support
- Seamless Ansible integration

The Proxmox approach eliminates about 80% of the manual networking complexity while providing better reproducibility and automation.

But this is mainly because I'm actually running Proxmox on two Lenovo P930s I have in another room.

## What's Next

Now I had infrastructure, but I still needed to manage the actual application deployments and blue-green switching logic. The rest of the series covers:

- **[Part 3: Container Orchestration with mise Beyond Terraform](/posts/2025-08-20-blue-green-with-traefik-part-3-container-orchestration)** - Moving beyond Terraform for deployments
- **[Part 4: Dynamic Configuration Architecture](/posts/2025-08-22-blue-green-with-traefik-part-4-architecture)** - Core Traefik blue-green setup
- **[Part 5: Deployment Workflows and mise Integration](/posts/2025-08-25-blue-green-with-traefik-part-5-deployment-workflows)** - Production deployment workflows
- **[Part 6: CI/CD Integration and Production Considerations](/posts/2025-09-01-blue-green-with-traefik-part-6-cicd-production)** - Complete automation pipeline