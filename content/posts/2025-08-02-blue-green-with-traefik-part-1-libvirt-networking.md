---
date: 2025-08-02
title: "Blue Green with Traefik 1: LibVirtD"
stage: published
---

This is part 1 of my blue-green deployment journey. So I had this idea - I wanted to play around with blue-green deployments, and figured I'd just spin up a quick VM on my Fedora box to test things out. 

How hard could it be, right?

## What I Was Trying To Do

I wanted to mess around with blue-green deployments - you know, having two versions of your app where you can instantly switch traffic between them. Plus I wanted preview environments where every PR gets its own URL. Cool stuff.

The plan seemed simple: spin up a VM, get Docker and Traefik running on it, and boom - local testing environment. I just needed the VM to be accessible from my host machine with working DNS.

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


## Then Everything Went Wrong

Here's where I entered what I now call **Struggle Town:**
- Fedora uses NetworkManager, which sounds great until you try to set DNS on a bridge interface. `nmcli c modify br0 ipv4.dns 10.0.1.1` looks like it works but... nope, does absolutely nothing.
  
- Oh wait, Fedora ALSO uses resolvectl for DNS. So you actually need `resolvectl dns br0 10.0.1.1`. Found that out after about 2 hours of head-banging.

- Libvirt on Fedora defaults to "userland networking" - which is a fancy way of saying your VMs are completely isolated and can't talk to your host or anything else on your network. Useless for what I needed.
  
- To fix this mess, you have to manually create a bridge interface and connect your VM to it. But wait, there's more - the VM has to be created with `sudo virt-install` (not Gnome Boxes!) and you have to explicitly set the network interface to use the bridge.

After a lot of trial and error (and some creative swearing), I ended up with this script:

```sh
#!/bin/bash

# So here's the thing about Gnome Boxes - it uses libvirt under the hood,
# but sets up this useless virbr0 network that doesn't actually bridge to 
# your real network. Your VMs end up in their own little isolated world.
# We need to create a proper bridge interface (br0) that actually connects
# to your real network.

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

At this point I had to delete the VM I'd made with Gnome Boxes. Yeah, the one I'd just spent time setting up. Turns out Gnome Boxes hard-codes that useless userland networking and you can't change it.

Next up: creating a bridge network that libvirt would actually use.

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

Finally, I could create a new VM. This time using virt-install (because apparently that's the only way to specify the network properly):

```sh
sudo virt-install \
  --vcpus=1 \
  --memory=2048 \
  --cdrom=/path/to/iso/ubuntu-22.04-server.iso \
  --disk size=20 \
  --os-variant=ubuntu22.04 \
  --network network=bridged-network
```

Success! The VM was running! I could SSH into it using the IP address!

But then... plot twist.

I couldn't resolve the VM by hostname. Like, at all. 

`ping docker-host.local` just sat there, mocking me.

## What This Mess Taught Me

**Why Hostname Resolution Broke:**

So here's what was happening - the VM couldn't be reached by hostname because modern Linux has about 5 different systems fighting over who gets to handle DNS. My bridge interface wasn't talking to any of them properly.

The VM had its IP (10.0.1.200) but `docker-host.local` meant nothing to my system because:
- The bridge wasn't registered with the DNS resolver
- NetworkManager thought it knew better
- systemd-resolved was doing its own thing
- And libvirt was just sitting there, not helping

**The Real Problem: Too Many Cooks**

Remember when Linux networking was simple? Yeah, me neither, but it used to be simpler. Now on Fedora you've got:

- **NetworkManager** - supposedly managing your network but really just getting in the way of DNS settings
- **systemd-resolved** - handling DNS but needs you to explicitly tell it about every custom domain
- **libvirt** - creating its own networks that live in their own universe, completely disconnected from your actual network

These weren't built to work together. It's like they're from different planets and you're the translator trying to get them to play nice.

**Old Way vs New Way (Spoiler: Both Suck)**

The old way that doesn't work anymore:
```bash
# This will just make NetworkManager angry
brctl addbr br0
ifconfig br0 10.0.1.100/24
```

The new way that sometimes works if you're lucky:
```bash
# NetworkManager's way - when it feels like cooperating
nmcli c add type bridge ifname br0 con-name br0
```

Here's the thing I learned the hard way: you can't fight the modern networking stack. You have to sweet-talk NetworkManager into doing what you want, or it'll just silently ignore you and do whatever it wants anyway.

## Time to Give Up (On This Approach)

After all this, I realized I was spending more time fighting Linux networking than actually working on blue-green deployments. This libvirt setup was becoming a full-time job.

So I said "screw it" and looked for something better. The rest of this series covers how I actually got this working:

- **[Part 2: From libvirt to Proxmox Infrastructure as Code](/b/2025-08-15-blue-green-with-traefik-part-2-proxmox-pivot)** - Moving to Proxmox with Terraform
- **[Part 3: Container Orchestration with mise Beyond Terraform](/b/2025-08-20-blue-green-with-traefik-part-3-container-orchestration)** - Deployment automation
- **[Part 4: Dynamic Configuration Architecture](/b/2025-08-22-blue-green-with-traefik-part-4-architecture)** - Traefik blue-green setup
- **[Part 5: Deployment Workflows and mise Integration](/b/2025-08-25-blue-green-with-traefik-part-5-deployment-workflows)** - Production workflows
- **[Part 6: CI/CD Integration and Production Considerations](/b/2025-09-01-blue-green-with-traefik-part-6-cicd-production)** - Complete CI/CD pipeline