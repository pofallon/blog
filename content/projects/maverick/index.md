---
name: Maverick
order: 2
status: in-progress
summary: Point your AI agents at a task list and let them fly. Maverick orchestrates implementation, code review, fixes, and PR creation — the full development lifecycle on autopilot.
tags:
  - python
  - cli
  - ai-agents
  - claude-ai
  - workflow-automation
  - code-review
  - developer-tools
links:
  - label: GitHub
    url: https://github.com/get2knowio/maverick
    type: primary
hero:
  src: maverick_banner.jpg
  alt: Maverick robot mascot - a sleek blue-gray humanoid robot with brass accents, surrounded by workflow and AI automation icons
---

## Your Agents Need a Flight Plan

AI coding agents can write code, but they can't run your development process. You still prompt them one at a time, babysit validation, manually re-run after lint failures, coordinate reviews, and stitch it all together into a PR. You've automated the typing but not the workflow.

Maverick fixes this. Define your workflow in YAML, point it at your task list, and step back. Maverick flies through implementation, validation, code review, fixes, and PR creation — with agents that recover from failures, retry with context, and keep going until the work is done.

This is what development on autopilot looks like.

## Come Fly With Me

But autopilot isn't just about speed. It's about letting go of the controls.

Queue up a dozen features before lunch. Come back to find them implemented, reviewed, and committed. Batch-fix tech debt across your codebase without coordinating a single change manually. Let the review-and-fix loop catch what you'd miss on your fourth cup of coffee.

Maverick doesn't just run agents — it choreographs them. Implementers hand off to reviewers. Reviewers surface findings. Fixers resolve them. Validators confirm the fix. The cycle repeats until everything passes or there's nothing left to try.

From a spec to a stack of clean commits. From a backlog to a branch ready to push. **#ComeFlyWithMe**

## How It Works

Install, set your API key, and fly:

```bash
uv tool install maverick
export ANTHROPIC_API_KEY=your-key
maverick fly
```

Maverick picks up your next ready bead, runs it through the full development cycle, and moves on to the next. Your terminal shows the flight log — what's done, what's in progress, and what's queued.

```text
  Maverick — Flight Log
  ---------------------

  ✓ bead-001  Add user model         implemented · reviewed · committed
  ✓ bead-002  Add auth middleware     implemented · reviewed · committed
  ⟳ bead-003  Add login endpoint     implementing...
    bead-004  Add session management  queued
```

## What You Get

Every Maverick workflow comes loaded:

- **Declarative YAML workflows** — Define multi-step workflows with conditional execution, parallel steps, checkpoints, and composition. No Python required.
- **Autonomous AI agents** — Specialized agents for implementation, code review, and fixing. Each scoped to exactly the tools it needs, following least-privilege principles.
- **Review-and-fix loops** — Automatic cycles run format, lint, typecheck, and test stages. Failures trigger a fixer agent that retries with full context. Rinse and repeat until clean.
- **Accountability tracking** — Every review finding is tracked to resolution. Fixers must report on every issue — no silent skipping, no hand-waving. Unresolved items become tech-debt issues.
- **Workflow discovery** — Three-tier precedence (project → user → built-in) lets teams override any workflow by dropping modified YAML in `.maverick/workflows/`.
- **Checkpointing** — Workflows save state to disk. Get interrupted? Resume from exactly where you left off.

## The Flight Plan

Every project follows three phases. Refuel loads the work. Fly executes it. Land ships it.

**Refuel** parses your spec into beads — atomic units of work with dependencies wired up and ready to go.

```bash
maverick refuel speckit .specify/features/my-feature
```

**Fly** picks up the next ready bead and runs the full cycle: implement, validate, review, fix, commit. When one bead lands, it grabs the next. Failures get retried. Review findings get addressed. You don't have to watch.

```bash
maverick fly
```

**Land** curates your commits into clean history and pushes. An AI curator reorganizes the work into logical, reviewable changesets.

```bash
maverick land
```

## Why Not Just Prompt an Agent?

Because prompting is the easy part. The hard part is everything around it.

You can ask Claude to implement a feature. But who validates the output? Who runs the linter, the type checker, the tests? Who reads the review findings and decides what to fix? Who commits with a clean message, who pushes, who creates the PR? Who handles it when the tests fail and the agent needs to try again with different context?

That's orchestration. That's what Maverick does. It turns "ask an agent to write code" into a complete, repeatable development workflow — with the same rigor you'd expect from a human team, but without the manual coordination.

And because workflows are YAML, not Python, anyone on your team can read, modify, and share them.

## Install

```bash
uv tool install maverick
```

That's it. `maverick` lands on your PATH in its own isolated environment.

## Getting Started

Set your API key, load some work, and fly:

```bash
# Set your Anthropic API key
export ANTHROPIC_API_KEY=your-key

# Create beads from a SpecKit specification
maverick refuel speckit .specify/features/my-feature

# Implement, validate, review, and commit
maverick fly

# Curate history and push
maverick land
```

All you need is an API key and a task list.
