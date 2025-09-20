---
date: 2025-08-15
title: "Blue Green with Traefik 2: Proxmox Pivot"
stage: published
---

This is part 2 of my blue-green deployment journey. After that [libvirt networking nightmare](/b/2025-08-02-blue-green-with-traefik-part-1-libvirt-networking), I needed something that would actually work.

Here's the thing - I just wanted to test provisioning a VM as my Docker host. Once I got it working locally, I could use the same approach with Terraform on DigitalOcean or AWS. But first I needed something that wasn't actively fighting me.

## Enter Proxmox (My Savior)

So I remembered I had these two Lenovo P930s sitting in another room running Proxmox. Why was I torturing myself with libvirt when I had actual virtualization infrastructure just... sitting there?

Time to pivot. I threw together a repo with:

- A Terraform manifest to spin up VMs on Proxmox
- An Ansible playbook to configure them (because who wants to SSH in and install Docker manually?)
- Some mise tasks to tie it all together (more on that later)

**Finally, Infrastructure That Just Works**

The difference was night and day. With Proxmox, here's I started with:

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

**Pulling your github public keys during install**

Okay, this is actually pretty slick - instead of copying SSH keys around like a caveman, I just pull them from GitHub:

```hcl
data "curl" "github_public_ssh_keys" {
  http_method = "GET"
  uri         = "https://github.com/${var.github_username}.keys"
}

locals {
  ssh_public_keys = split("\n", trimspace(data.curl.github_public_ssh_keys.response))
}
```

Boom. Any VM I spin up automatically has all my GitHub SSH keys. No more "oh crap, which key did I use for this server?"

>
> ⚠️ Dogma dictates (yes), that you should probably be intentional about which keys
> you use for which servers. But this is my home lab, so I'm lazy.

**Cloud-Init Does the Heavy Lifting**

Remember all that NetworkManager/systemd-resolved nonsense from Part 1? Cloud-init just... handles it:

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

**Making Terraform and Ansible Play Nice**

A blank VM is useless - I need Docker, Traefik, and all my tools installed. The Ansible provider runs automatically after the VM is created. If you're old enough to remember Vagrant, it's basically that but actually works:

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

**Let's Compare the Pain Levels**

The libvirt approach (aka "why am I doing this to myself"):
- Manually creating bridge interfaces while NetworkManager fights you
- Debugging DNS resolution for 3 hours
- Configuring VM networking by hand
- Copying SSH keys around like it's 2005
- Nothing works the first time (or the fifth)

The Proxmox approach (aka "oh, this is nice"):
- Write one Terraform file
- Run `terraform apply`
- Go get coffee
- Come back to a working VM with Docker installed

I went from spending 80% of my time fighting infrastructure to actually working on what I wanted to build.

And yeah, having dedicated Proxmox servers helps. Those Lenovo P930s in my spare room are finally earning their keep.

## What's Next

Cool, so now I had VMs that actually worked. But I still needed to figure out the actual deployment stuff - you know, the whole reason I started this journey. The rest of the series covers:

- **[Part 3: Container Orchestration with mise Beyond Terraform](/b/2025-08-20-blue-green-with-traefik-part-3-container-orchestration)** - Moving beyond Terraform for deployments
- **[Part 4: Dynamic Configuration Architecture](/b/2025-08-22-blue-green-with-traefik-part-4-architecture)** - Core Traefik blue-green setup
- **[Part 5: Deployment Workflows and mise Integration](/b/2025-08-25-blue-green-with-traefik-part-5-deployment-workflows)** - Production deployment workflows
- **[Part 6: CI/CD Integration and Production Considerations](/b/2025-09-01-blue-green-with-traefik-part-6-cicd-production)** - Complete automation pipeline