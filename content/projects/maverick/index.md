---
name: Maverick
order: 2
status: in-progress
summary: AI-powered development workflow orchestration that uses autonomous Claude agents to implement features, fix issues, run code reviews, and create PRs from declarative YAML definitions.
tags:
  - python
  - claude-ai
  - workflow-automation
  - cli
  - tui
  - developer-tools
links:
  - label: GitHub
    url: https://github.com/get2knowio/maverick
    type: primary
  - label: Documentation
    url: https://get2knowio.github.io/maverick/
  - label: Training Slides
    url: https://get2knowio.github.io/maverick/slides/
hero:
  src: maverick_banner.jpg
  alt: Maverick robot mascot - a sleek blue-gray humanoid robot with brass accents, surrounded by workflow and AI automation icons
---

## Overview

Maverick is a Python CLI/TUI application that orchestrates complete development workflows using the Claude Agent SDK. It automates the full development lifecycle—from implementing features defined in task lists, through code review and validation, to PR creation—using autonomous AI agents that make decisions and recover from failures. Unlike traditional CI/CD tools that run static scripts, Maverick's agents dynamically adapt to errors, retry with fixes, and handle complex multi-phase implementations.

## Key Features

- **Declarative YAML Workflows** - Define multi-step workflows with conditional execution, parallel steps, checkpoints, and sub-workflow composition. The DSL supports expression evaluation, iteration, and type-safe inputs.
- **Autonomous AI Agents** - Specialized agents (ImplementerAgent, CodeReviewerAgent, FixerAgent) execute tasks using Claude, with built-in tool permission scoping and structured result extraction.
- **Validation-Fix Loops** - Automatic retry cycles run format/lint/typecheck/test stages, then invoke a fixer agent to resolve failures before retrying.
- **Interactive TUI** - Real-time Textual-based interface shows agent operations, validation progress, review findings, and workflow state.
- **Workflow Discovery & Customization** - Three-tier discovery (project → user → built-in) lets teams override any workflow by placing modified YAML in `.maverick/workflows/`.
- **Checkpointing & Resumption** - Workflows can checkpoint state to disk, enabling resumption from any checkpoint if interrupted.

## Use Cases

Maverick excels at automating development workflows that would otherwise require manual coordination:

- Implementing features from spec files with automatic validation and PR creation
- Batch processing tech-debt issues with parallel fixes and individual PRs
- Single-issue quick fixes with automatic commit and push
- AI-powered code review for architecture and convention compliance
- Validation pipelines with automatic fix attempts on failure
- Custom team workflows composed from reusable fragments

## Technical Highlights

Built on the Claude Agent SDK with a clean layered architecture: CLI (Click) → Workflow DSL (YAML parsing, step execution, checkpointing) → Agent layer (system prompts, tool selection) → Tool layer (MCP servers for GitHub/Git). The YAML DSL supports eight step types including python, agent, validate, parallel, subworkflow, branch, and checkpoint. All agents receive explicit allowed_tools following least-privilege principles, and all workflows are fully async with structured logging via structlog.

## Getting Started

Install with `uv sync` after cloning the repository, then set your `ANTHROPIC_API_KEY`. Run `maverick workflow list` to see available workflows, or execute with `maverick fly feature -i branch_name=my-feature`. Customize by copying any built-in workflow YAML to `.maverick/workflows/` and modifying it.
