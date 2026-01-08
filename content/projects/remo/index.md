---
name: Remo
order: 1
status: ready
summary: A CLI tool that spins up fully-configured development environments in minutes with DevContainer support, persistent sessions, and flexible deployment to Hetzner Cloud or local Incus containers.
tags:
  - cli
  - devcontainers
  - cloud-development
  - hetzner
  - incus
  - remote-dev
  - homelab
  - infrastructure-as-code
links:
  - label: GitHub
    url: https://github.com/get2knowio/remo
    type: primary
hero:
  src: remo_banner.jpg
  alt: Remo robot mascot - a bronze industrial robot holding a holographic display, surrounded by cloud infrastructure icons
---

## Overview

Remo is a command-line tool that provisions fully-configured remote development environments in minutes. It supports both cloud-based VMs on Hetzner and lightweight Incus containers on your own hardware, enabling developers to maintain persistent coding sessions accessible via SSH. With simple CLI commands, you get a complete environment with Docker, DevContainers, an interactive project menu, and terminal multiplexing.

## Deployment Options

### Hetzner Cloud (Remote)
- Internet-accessible via DuckDNS hostname (~€4/month)
- Persistent `/home/remo` volume survives server teardown
- SSH-only firewall for secure access
- Ideal for always-on remote development

### Incus Container (Local/Homelab)
- Runs on personal hardware with minimal electricity cost
- Containers obtain LAN IP addresses via DHCP
- Hostname-accessible from any machine on your network
- Better suited for local testing and homelab environments

## Key Features

- **Simple CLI** - Subcommands for `create`, `destroy`, `list`, and `bootstrap` operations on both Hetzner and Incus targets
- **Interactive Project Menu** - An fzf-powered menu displays available projects from `~/projects` upon login, with arrow key navigation and number shortcuts (1-9)
- **Zellij Session Persistence** - Terminal multiplexer maintains your work state even after SSH disconnection—detach with `Ctrl+o d` and reconnect to resume exactly where you left off
- **DevContainer Integration** - Automatically launches and manages Docker-based development containers for projects with DevContainer configurations
- **Pre-installed Tooling** - Every environment includes Docker with Compose, Node.js 24 LTS, GitHub CLI, Dev Containers CLI, and terminal utilities

## Use Cases

Remo excels in these specific scenarios:

- **Remote-First Development** - Work from any machine with only an SSH client, accessing your persistent development environment
- **Homelab Development** - Run development containers on your own hardware with near-native performance
- **Multi-Project Workflows** - Use the interactive project menu to quickly switch between DevContainer-based projects
- **Temporary High-Power Needs** - Spin up cloud servers for intensive tasks, destroy when done
- **Team Onboarding** - New members provision identical environments without complex local tooling

## Getting Started

**Prerequisites:** Python 3.8+ and an SSH key pair. For Hetzner: API token and DuckDNS account. For Incus: bootstrapped Incus host.

**Hetzner Cloud:**
```
git clone https://github.com/get2knowio/remo.git && cd remo
./remo init
vim .env  # Configure credentials
./remo hetzner create
ssh remo@your-subdomain.duckdns.org
```

**Incus:**
```
./remo incus create dev1 --host incus-host --user youruser
ssh remo@dev1
```
