---
name: Remo
order: 1
status: ready
summary: Fire up a coding agent, close your laptop, and walk away. Remo gives you persistent remote dev environments where your AI agents keep working even when you're not watching.
tags:
  - cli
  - devcontainers
  - cloud-development
  - aws
  - hetzner
  - incus
  - remote-dev
  - homelab
  - infrastructure-as-code
  - ai-agents
links:
  - label: GitHub
    url: https://github.com/get2knowio/remo
    type: primary
hero:
  src: remo_banner.jpg
  alt: Remo robot mascot - a bronze industrial robot holding a holographic display, surrounded by cloud infrastructure icons
---

## Your Agents Don't Need You Watching

AI coding agents are powerful, but they're tethered to your laptop. Close the lid, lose your Wi-Fi, or just walk away from your desk, and your agent dies mid-task.

Remo fixes this. It gives you a persistent remote environment where your agents keep running no matter what happens to your local machine. SSH in, kick off an agent, disconnect. Come back hours later and pick up exactly where things left off. Your Zellij session holds the full context: terminal output, running processes, everything.

This is what "set it and forget it" looks like for development.

## Where Will You Remo?

But "set it and forget it" is only half the story. The other half is checking back in — from *anywhere*.

Kick off a Claude Code session at your desk before lunch. Check the progress from your phone over SSH while you're waiting in line for coffee. Pick it back up on your iPad from the couch that evening. Or don't check in at all — your agent doesn't care. It's still going.

Remo decouples your development from any single device. Your agent runs on persistent infrastructure, and you connect to it on your terms — when it's convenient, from wherever you happen to be. The work doesn't stop when you step away, and it's always there when you come back.

From a standing desk. From a hammock. From a hotel lobby the night before a conference. **#WhereWillYouRemo**

## How It Works

Install with a single command, provision an environment, and connect:

```bash
curl -fsSL https://get2knowio.github.io/remo/install.sh | bash
remo hetzner create        # or: remo aws create / remo incus create
remo shell
```

You land in an interactive project menu. Pick a project, and you're in a persistent Zellij session with your DevContainer already running. Disconnect anytime — your session survives.

```text
  Remote Coding Server
  --------------------

> my-project - active
  another-project
  [Clone new repo]
  [Exit to shell]
```

## What You Get

Every Remo environment comes fully loaded:

- **Persistent sessions** — Zellij keeps your terminal state alive across disconnects. Detach with `Ctrl+d`, reconnect with `remo shell`, and resume exactly where you left off.
- **DevContainer integration** — Projects with a `.devcontainer` config auto-launch their Docker container when you select them. No manual setup.
- **Interactive project menu** — An fzf-powered launcher shows your projects from `~/projects`. Arrow keys, number shortcuts, or just type to filter.
- **Pre-installed tooling** — Docker + Compose, Dev Containers CLI, Node.js 24 LTS, GitHub CLI, Zellij, and fzf. Ready to go from the first SSH connection.
- **One-command updates** — `remo self-update` updates the CLI. `remo <platform> update` refreshes the dev tools on your environment.

## Pick Your Platform

Remo deploys to three platforms. Same dev workflow, same tooling, your choice of infrastructure.

| | Hetzner Cloud | AWS | LXC (Incus) |
|---|---|---|---|
| **Cost** | ~€4/month | ~$10/month (spot) | Your electricity |
| **Best for** | Budget EU/US hosting | Enterprise, spot savings | Local dev, homelab |
| **Storage** | Persistent block volume | EBS / root volume | Host mounts |
| **Access** | DuckDNS domain | SSM (zero open ports) or SSH | LAN hostname |

**Hetzner** is the simplest path: cheap EU/US VMs with DuckDNS for a memorable hostname and a persistent volume that survives server teardown.

**AWS** brings enterprise features: SSM Session Manager for zero-inbound-port access, spot instances for ~70% cost savings, stop/start to pause billing, multi-user namespacing, and Route53 DNS.

**LXC (via Incus)** runs on your own hardware. Lightweight system containers get LAN IPs via DHCP and are accessible by hostname from any machine on your network.

## Why Not Just Use a Cloud IDE?

Cloud IDEs lock you into a browser tab and a specific editor. Remo gives you a raw SSH environment. Use whatever editor, terminal, or workflow you want — VS Code Remote SSH, Neovim, Emacs, or a plain terminal. Your agent framework doesn't care where it runs as long as the session persists.

And because it's just a Linux box with Docker, anything that works locally works on Remo. No vendor lock-in, no proprietary APIs, no monthly seat fees.

## Install

```bash
curl -fsSL https://get2knowio.github.io/remo/install.sh | bash
```

That's it. `remo` lands in `~/.local/bin` and manages its own dependencies.

## Getting Started

Set your platform credentials as environment variables, then create and connect:

```bash
# Hetzner (cheapest cloud option)
export HETZNER_API_TOKEN=your-token
export DUCKDNS_TOKEN=your-token
export DUCKDNS_DOMAIN=your-subdomain
remo hetzner create
remo shell

# AWS (enterprise features, spot pricing)
export AWS_ACCESS_KEY_ID=your-key
export AWS_SECRET_ACCESS_KEY=your-secret
remo aws create --spot
remo shell

# LXC via Incus (your own hardware)
remo incus bootstrap --host myserver --user paul
remo incus create dev1 --host myserver --user paul
remo shell
```

All you need is an SSH key pair and credentials for your chosen platform.
