---
date: 2025-08-02
title: "Blue Green with Traefik 1: LibVirtD"
stage: published
---

This is part 1 of my blue-green deployment journey. I started by trying to set up a VM using libvirt on Fedora for testing blue-green deployments with Docker Compose and Traefik.

## Goal

I wanted to experiment with blue-green deployments, preview environments, and wildcard subdomains. This required setting up a VM that could be accessed from my host machine with proper DNS resolution.

```nomnoml
#direction: down
#edges: rounded
#bendSize: 0.6
#.promoted: stroke=hsl(var(--twc-text-positive))

[<frame>pr-125| compose.yml] -> [deploy] -> [<frame>preview(dev)|
  [pr-125 | c5d8a1f]
  [<promoted>pr-124 | d6e9b2c]
  [pr-123 | b4c9f2e]
]

[preview(dev)] -> [<promoted>promote|10%] -> [<frame>bluegreen(dev)|
  [<promoted>blue | d6e9b2c|app.dev.example.com|blue-app.dev.example.com|traffic: 10%]
  [green | b4c9f2e|app.dev.example.com|green-app.dev.example.com|traffic: 90%]
]
```


## The libvirt Bridge Networking Challenge

**Struggle Town:**
- fedora uses NetworkManager.
  - So `nmcli c modify br0 ipv4.dns 10.0.1.1` does not seem to do anything.
- fedora uses resolvectl.
  - So you need to use `resolvectl dns br0 10.0.1.1` to set the DNS server for the bridge interface.
- libvirt in fedora only provides userland networking by default, which means that VMs cannot communicate with the host or other devices on the local network.
  - So you need to create a bridge interface and connect your VM to it.
  - The vm needs to created with sudo virt-install, and the network interface needs to be set to the bridge interface.

```sh
#!/bin/bash

# Gnome Boxes uses libvirt under the hood.
# By default it is configured to use a virtual network interface `virbr0` which is not bridged to the host network. This means that VMs cannot communicate with the host or other devices on the local network.
# To fix this, you can create a bridge interface `br0` and connect your VM to it. This allows the VM to have a direct connection to the host network.

function create_new_bridge() {
    local interface

    interface="${1}"

    sudo nmcli c add type bridge \
        ifname br0 autoconnect yes con-name br0 stp off

    sudo nmcli c modify br0 \
        ipv4.addresses 10.0.1.100/24 \
        ipv4.method manual

    sudo nmcli c modify br0 \
        ipv4.gateway 10.0.1.1

    sudo nmcli c modify br0 \
        ipv4.dns 10.0.1.1

    sudo resolvectl dns br0 10.0.1.1
    sudo resolvectl domain local

    sudo nmcli c add type bridge-slave \
        autoconnect yes \
        con-name "$interface" \
        ifname "$interface" \
        master br0

    sudo systemctl restart NetworkManager

    uniquely_add_to_file /etc/sysctl.d/99-ipforward.conf \
        "net.ipv4.ip_forward = 1"

    sudo sysctl -p /etc/sysctl.d/99-ipforward.conf
}

function uniquely_add_to_file() {
    local file="$1"
    local line="$2"

    if ! grep -qF "$line" "$file"; then
        echo "$line" | sudo tee -a "$file" >/dev/null
    fi
}

function remove_old_bridge() {
    local interface

    interface="${1}"
    sudo nmcli connection delete "$interface" 2>/dev/null || true
    sudo nmcli connection delete "Wired connection 1" 2>/dev/null || true
}

# use fzf to display the full nmcli connection list but select it only by name
selected=$(nmcli connection show | tail -n +2 | grep -v '^  *\B--\B' | fzf -m | sed 's/^ *\*//' | awk '{print $1}')

remove_old_bridge "$selected"
create_new_bridge "$selected"
```

Then I needed to delete the VM made with gnome boxes.

> This is because it uses userland networking which won't let me use the bridge interface.

Then I needed to create a bridge network for libvirt.

```sh
sudo virsh net-define bridged-network.xml
sudo virsh net-start bridged-network
sudo virsh net-autostart bridged-network
```

Where `bridged-network.xml` looks like this:

```xml
<network>
    <name>bridged-network</name>
    <forward mode="bridge" />
    <bridge name="br0" />
</network>
```

Then I created a new VM with virt-manager, and selected the `br0` interface as the network interface.

```sh
sudo virt-install \
  --vcpus=1 \
  --memory=2048 \
  --cdrom=/path/to/iso/ubuntu-22.04-server.iso \
  --disk size=20 \
  --os-variant=ubuntu22.04 \
  --network network=bridged-network
```

Huzzah.

but.

Weird.
Weird.

Can't resolve the VM by hostname.

## What I learned:

**Hostname Resolution Issues:**

The VM couldn't resolve by hostname because the bridge interface wasn't properly registered with the local DNS resolver. Even though the VM had a static IP (10.0.1.200), the hostname `docker-host.local` wasn't being resolved. This is a common issue when mixing bridge networking with modern Linux DNS resolution systems.

The solution involves ensuring:
1. The bridge interface is properly configured in NetworkManager
2. The DNS server (10.0.1.1 in my case) knows about the VM's hostname
3. The local resolver configuration includes the `.local` domain

**Fedora + libvirt Bridge Networking Complexity:**
Traditional Linux networking used `/etc/network/interfaces` or simple bridge utilities. Fedora's modern approach layers multiple systems:

- **NetworkManager** manages connections but doesn't always apply DNS settings immediately
- **systemd-resolved** handles DNS resolution but needs explicit configuration for custom domains
- **libvirt** creates its own virtual networks that don't automatically bridge to physical networks

The complexity comes from these systems not being designed to work together seamlessly for custom bridge setups. Each layer needs explicit configuration.

**NetworkManager vs Traditional Configs:**
Old approach: Direct bridge creation with `brctl` and manual IP assignment
```bash
# Traditional method (doesn't work well on modern Fedora)
brctl addbr br0
ifconfig br0 10.0.1.100/24
```

Modern approach: Use NetworkManager's bridge management
```bash
# Works with systemd and modern Fedora
nmcli c add type bridge ifname br0 con-name br0
```

The key insight: Modern Linux distributions expect you to work *with* their networking stack, not around it. Fighting NetworkManager leads to inconsistent state and mysterious failures.

## What's Next

This libvirt setup was getting too complex for what I needed. The complete series covers:

- **[Part 2: From libvirt to Proxmox Infrastructure as Code](/b/2025-08-15-blue-green-with-traefik-part-2-proxmox-pivot)** - Moving to Proxmox with Terraform
- **[Part 3: Container Orchestration with mise Beyond Terraform](/b/2025-08-20-blue-green-with-traefik-part-3-container-orchestration)** - Deployment automation
- **[Part 4: Dynamic Configuration Architecture](/b/2025-08-22-blue-green-with-traefik-part-4-architecture)** - Traefik blue-green setup
- **[Part 5: Deployment Workflows and mise Integration](/b/2025-08-25-blue-green-with-traefik-part-5-deployment-workflows)** - Production workflows
- **[Part 6: CI/CD Integration and Production Considerations](/b/2025-09-01-blue-green-with-traefik-part-6-cicd-production)** - Complete CI/CD pipeline