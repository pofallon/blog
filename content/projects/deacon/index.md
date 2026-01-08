---
name: Deacon
order: 3
status: in-progress
summary: A fast, lightweight Rust implementation of the DevContainer CLI for reproducible development environments.
tags:
  - rust
  - devcontainers
  - docker
  - cli
  - developer-tools
  - oci
links:
  - label: GitHub
    url: https://github.com/get2knowio/deacon
    type: primary
  - label: Documentation
    url: https://github.com/get2knowio/deacon/tree/main/docs
  - label: containers.dev Spec
    url: https://containers.dev
hero:
  src: deacon_banner.jpg
  alt: Deacon robot mascot - a tall elegant silver robot, surrounded by Rust and container icons
---

## Overview

Deacon is a production-ready Rust implementation of the Development Containers CLI, following the containers.dev specification. It provides DevOps teams and developers with a fast, cross-platform tool for managing containerized development environments without requiring Node.js. With a startup time under 100ms and a ~40MB binary, Deacon brings the full power of DevContainers to CI/CD pipelines and teams seeking lightweight, reproducible workflows.

## Key Features

- **Container Lifecycle Management** - Full `up`/`exec`/`down` commands with all lifecycle phases (onCreate, postCreate, postStart, postAttach), idempotent operations, and container state persistence.
- **Configuration Resolution** - Complete `devcontainer.json` parsing with variable substitution, extends chains for layered configurations, and Docker Compose multi-service orchestration.
- **OCI Feature System** - Install, test, package, and publish reusable features via OCI registries with dependency resolution, parallel installation, and lockfile support for reproducible builds.
- **Template Management** - Create and publish parameterized project templates with scaffolding options, metadata generation, and registry publication for team sharing.
- **Container Image Building** - Dockerfile-based builds from devcontainer configs with BuildKit integration for secrets, SSH forwarding, caching, and multi-architecture support.
- **System Diagnostics** - Built-in `doctor` command validates Docker availability, disk space, CPU, and memory requirements with JSON output for automation.

## Use Cases

Deacon excels in these scenarios:

- Standardizing team development environments with version-controlled configurations
- CI/CD pipeline integration with fast startup and JSON output modes
- Open-source project onboarding with single-command setup
- Feature development, testing, and publishing to OCI registries
- Multi-platform container builds with BuildKit integration
- Migrating from VS Code Dev Containers to CLI-first workflows

## Technical Highlights

Built in Rust (Edition 2021) using tokio for async I/O, reqwest with rustls for OCI registry operations, and clap for CLI parsing. The architecture separates the CLI binary from the core domain library, with abstractions like `ContainerRuntime` (Docker/Podman), `ConfigLoader` (extends chain resolution), and `FeatureInstaller` (OCI installation with dependency resolution). Performance optimizations include container environment probe caching and parallel feature installation.

## Getting Started

Install via curl: `curl -fsSL https://get2knowio.github.io/deacon/install.sh | bash`. Run `deacon up --workspace-folder .` in any directory with a `.devcontainer/devcontainer.json` to start a development container. Use `deacon exec -- <command>` to run commands inside, and `deacon doctor --json` for system diagnostics.
