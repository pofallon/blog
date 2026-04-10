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

Maverick fixes this. Load your work as beads — atomic units of implementation with dependencies wired up — and step back. Maverick picks up each bead in order and flies it through implementation, validation, parallel code review, accountability-tracked fixes, and a clean commit. When one bead lands, it grabs the next. You don't have to watch.

This is what development on autopilot looks like.

## Come Fly With Me

But autopilot isn't just about speed. It's about letting go of the controls.

Queue up a dozen features before lunch. Come back to find them implemented, reviewed, and committed — each one validated by specialized agents that catch what you'd miss on your fourth cup of coffee. The completeness reviewer checks requirements coverage. The correctness reviewer audits quality, security, and style. The fixer addresses every finding with full accountability. No silent skipping, no hand-waving.

Maverick doesn't just run agents — it choreographs 26+ specialized agents across four workflows. Implementers hand off to validators. Validators trigger fixers on failure. Reviewers run in parallel. Fixers must report on every finding. The cycle repeats until everything passes or there's nothing left to try.

From a spec to a stack of clean commits. From a backlog to a branch ready to push. **#ComeFlyWithMe**

<MaverickInnovations />

## How It Works

<MaverickFlowDiagram />

Three phases. **Refuel** loads the work. **Fly** executes it. **Land** ships it.

**Plan** turns a PRD into a flight plan — objective, success criteria, scope boundaries — through a Pre-Flight Briefing Room of parallel agents.

```bash
maverick plan generate my-feature --from-prd spec.md
```

**Refuel** decomposes the flight plan into beads — atomic units of work with acceptance criteria, file scope, and dependencies wired up. New epics automatically chain behind existing open epics so work serializes safely while tasks within an epic parallelize.

```bash
maverick refuel my-feature
```

**Fly** picks up the next ready bead and runs the full cycle: implement, validate with retry, deterministic spec compliance check, parallel review, accountability-tracked fixes, commit via Jujutsu. When one bead lands, it grabs the next. All work happens in an isolated workspace — your repo stays untouched.

```bash
maverick fly --epic <epic-id> --auto-commit
```

**Land** curates your commits into clean history using an AI curator agent, then pushes and creates a PR.

```bash
maverick land
```

Your terminal shows the flight log:

```text
  Maverick — Flight Log
  ---------------------

  ✓ bead-001  Add user model         implemented · reviewed · committed
  ✓ bead-002  Add auth middleware     implemented · reviewed · committed
  ⟳ bead-003  Add login endpoint     implementing...
    bead-004  Add session management  queued
```

## The Agent Roster

Every phase is powered by specialized agents, each scoped to exactly the tools it needs.

- **Implementer** — Expert software engineer with full tool access (Read, Write, Edit, Bash, Glob, Grep). Follows TDD, writes tests first, implements to pass.
- **Completeness Reviewer** — Runs in parallel. Checks whether the implementation actually covers the requirements in the bead spec. No code quality opinions — just coverage.
- **Correctness Reviewer** — Runs in parallel. Audits code quality, security, performance, and style. Catches bugs the implementer missed.
- **Review Fixer** — Addresses every finding from both reviewers. Must report on each issue — no silent skipping. Invalid deferrals get re-sent. Unresolved items become tech-debt issues.
- **Validation Fixer** — Minimal-scope agent (Read, Write, Edit only) that fixes lint, typecheck, and test failures. Retries with full context until clean.
- **Curator** — Reorganizes your commit history into logical, reviewable changesets for landing. Plans jj operations without touching tools directly.

## The Briefing Room

Before a single line of code gets written, Maverick plans the work — and it doesn't trust one agent to do all the thinking.

The **Briefing Room** is a multi-agent deliberation pattern that runs before decomposition. Three domain-expert agents analyze the problem in parallel, each from a different angle. Then a fourth agent — the **Contrarian** — reads all three briefs and explicitly challenges their assumptions, identifies blind spots, and proposes simplifications. A deterministic synthesis step extracts the key insights into a single coherent document that feeds downstream.

This pattern appears twice in Maverick, tuned to different planning stages:

**Pre-Flight Briefing** (PRD → Flight Plan) runs when generating a flight plan from a product requirements document:

- **Scopist** — Analyzes what should be in and out of scope. Draws boundaries so the plan doesn't sprawl.
- **Codebase Analyst** — Maps PRD requirements to existing code. Identifies integration points, architectural patterns to follow, and complexity hotspots.
- **Criteria Writer** — Drafts measurable success criteria and a concise objective. Every criterion must be independently verifiable.
- **Pre-Flight Contrarian** — Reads all three briefs and challenges scope gaps, unmeasurable criteria, and missing edge cases. Silence is not agreement.

**Refuel Briefing** (Flight Plan → Work Units) runs when decomposing a flight plan into executable beads:

- **Navigator** — Proposes architecture decisions, module layout, and integration points. Documents alternatives considered.
- **Structuralist** — Designs data models, type contracts, and interfaces. Sketches entities and their relationships.
- **Recon** — Flags risks by severity, surfaces ambiguities, drafts a testing strategy, and identifies cross-plan dependencies.
- **Contrarian** — Challenges all three briefs. Proposes simplifications with explicit tradeoffs. Calls out where the group agrees so consensus is visible.

The result is a **flight plan** — a structured document with an objective, success criteria, scope boundaries, and constraints — that the Decomposer agent then breaks into ordered work units with dependency graphs, file scopes, and acceptance criteria traced back to success criteria.

Why not just ask one agent to plan everything? Because three independent perspectives catch more than one, the contrarian forces intellectual honesty, and the structured synthesis makes the reasoning auditable. You can read exactly which agent raised a concern and what the contrarian thought about it.

## What You Get

- **Bead-driven execution** — Atomic units of work with dependency ordering. Each bead is implemented, validated, reviewed, and committed independently. Resume from any checkpoint.
- **Parallel code review** — Completeness and correctness reviewers run concurrently, each focused on one dimension. No single reviewer trying to do everything.
- **Deterministic spec compliance** — A grep-based convention checker catches anti-patterns (like `unwrap()` in runtime code or blocking calls in async functions) before a reviewer ever sees the diff.
- **Accountability tracking** — Every review finding is tracked to resolution. Fixers must report on every issue. Deferred items need valid justification. Unresolved findings become GitHub issues.
- **Human-in-the-loop escalation** — When agents exhaust their fix attempts, they create an *assumption bead* with full escalation context and hand it to you. Approve, reject with guidance, or defer from `maverick review` — even from a phone terminal. Rejection spawns a correction bead back into the agent pipeline. The fly never gets stuck waiting for you.
- **Continuous fly mode** — `maverick fly --watch` polls for new beads as a long-running daemon, so you can keep planning and refueling in another terminal while fly drains the queue.
- **Cross-epic dependency wiring** — New epics automatically chain behind existing open ones, serializing big features while keeping tasks inside each epic parallelizable.
- **Post-flight aggregate review** — After all beads in an epic land, a cross-bead reviewer audits architectural coherence and dead code across the full diff, not just one bead at a time.
- **Multi-provider routing** — Distribute work across Claude, Copilot, and Gemini with per-actor provider/model overrides. Use a fast model for the implementer and a sharp one for the reviewer — your call.
- **Runway knowledge store** — Episodic records of bead outcomes, review findings, and fix attempts build up project-specific context over time. Agents discover this context progressively, and consolidation distills old records into semantic summaries.
- **Workspace isolation** — All fly work happens in a hidden Jujutsu workspace. Your repo stays clean. Jujutsu's snapshot/rollback model means every step is recoverable.
- **Validation retry loops** — Format, lint, typecheck, and test failures trigger a fixer agent that retries with full error context. The loop repeats until clean or max attempts.
- **Checkpointing** — Workflows save state after every significant step. Get interrupted? Resume from exactly where you left off.
- **Principle of least privilege** — Each agent gets only the tools it needs. The implementer gets Bash; the fixer doesn't. Reviewers are read-only.

## Why Not Just Prompt an Agent?

Because prompting is the easy part. The hard part is everything around it.

You can ask Claude to implement a feature. But who validates the output? Who runs the linter, the type checker, the tests? Who reads the review findings and decides what to fix? Who commits with a clean message? Who handles it when the tests fail and the agent needs to try again with different context?

That's orchestration. That's what Maverick does. It turns "ask an agent to write code" into a complete, repeatable development workflow — with the same rigor you'd expect from a human team, but without the manual coordination.

## Under the Hood: Actors, Mailboxes, and Schemas

Orchestrating agents reliably is harder than it looks. Most agent runners ask an LLM to produce structured JSON inside its text response, then frantically parse it with retries when the model wraps it in markdown, omits a field, or hallucinates a key. It's the architectural equivalent of duct tape, and it fails often enough that you stop trusting your own pipeline.

Maverick is built on a different pattern.

Every workflow runs as a system of **actors with mailboxes** — implementer, reviewer, validator, committer, decomposer — each in its own OS process, communicating only through structured messages. Sitting in the middle is a **supervisor** that routes those messages according to an explicit policy. There's no hidden chain or graph — the supervisor *is* an actor, and its message handler *is* its inbox. You can read the routing logic in one file and know exactly what happens next.

When an agent needs to deliver a result to the supervisor, it doesn't return JSON in text. It calls an **MCP tool** — `submit_implementation`, `submit_review`, `submit_outline` — whose schema is enforced by the protocol itself. Wrong shape? The agent gets a validation error and self-corrects. The protocol *is* the contract. There's no parsing layer to break.

And because every agent actor holds a **persistent ACP session** for the duration of a bead, the implementer remembers what the reviewer said in round one when it goes to fix things in round two. No context window reset. No re-explaining the original code. Review oscillation drops from ten or twelve rounds to one or two — not because the agents got smarter, but because they finally have a memory.

This isn't the part of Maverick you'll see in your first five minutes. It's the part that means Maverick is still working in your fifteenth hour.

## Install

```bash
uv tool install maverick-cli
```

That's it. `maverick` lands on your PATH in its own isolated environment.

## Getting Started

Set your API key, initialize the project, load some work, and fly:

```bash
# Set your Anthropic API key
export ANTHROPIC_API_KEY=your-key

# Initialize maverick.yaml and discover available providers
maverick init

# Seed the runway with a codebase analysis
maverick runway seed

# Generate a flight plan from a PRD
maverick plan generate my-feature --from-prd spec.md

# Decompose into beads
maverick refuel my-feature

# Implement, validate, review, and commit
maverick fly --epic <epic-id> --auto-commit

# Review any human escalations
maverick brief --human
maverick review <bead-id>

# Curate history and push
maverick land --yes
```

Or run fly continuously and keep adding work in another terminal:

```bash
# Terminal 1 — fly drains beads as they appear
maverick fly --watch --auto-commit

# Terminal 2 — keep planning and refueling
maverick plan generate feature-2 --from-prd feature-2.md
maverick refuel feature-2
```

All you need is an API key and a task list.
