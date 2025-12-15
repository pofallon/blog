---
description: "Task list for pausing AWS Amplify builds"
---

# Tasks: Pause AWS Amplify Build Automation

**Input**: Design documents in `/specs/001-pause-amplify-builds/` (plan.md, spec.md, research.md, data-model.md, quickstart.md, contracts/pause-builds.openapi.yaml)  
**Prerequisites**: AWS Amplify app connected to GitHub, placeholder `amplify-paused` branch, engineers with AWS CLI + Amplify CLI access

## Format Reminder

`- [ ] [TaskID] [P?] [Story?] Description with file path`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish documentation structure, prerequisites, and environment scaffolding.

- [X] T001 Create runbook directory skeleton (`specs/001-pause-amplify-builds/runbooks/README.md`) that links pause/resume/verification artifacts.
- [X] T002 Capture Amplify CLI / AWS CLI / IAM prerequisite matrix under **Technical Context** in `specs/001-pause-amplify-builds/plan.md`.
- [X] T003 Add environment variable export snippet for `APP_ID`, `PROD_BRANCH`, `PLACEHOLDER_BRANCH` at the top of `specs/001-pause-amplify-builds/quickstart.md`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core governance artifacts that every user story depends on.

- [X] T004 Map Amplify App, Production Branch, Placeholder Branch, Verification Checklist, and Communication Packet entities to user stories inside `specs/001-pause-amplify-builds/data-model.md`.
- [X] T005 Document `/amplify/pause` and `/amplify/resume` request/response field mappings plus story ownership in `specs/001-pause-amplify-builds/contracts/README.md`.
- [X] T006 Add freeze/resume stakeholder communication templates (initiate + lift) to `specs/001-pause-amplify-builds/plan.md#Communication`.

**Checkpoint**: Governance artifacts approved; proceed to user stories.

---

## Phase 3: User Story 1 - Ops pauses builds without downtime (Priority: P1) 🎯 MVP

**Goal**: Provide a reversible procedure that retargets the Amplify app to the `amplify-paused` branch without disturbing the live deployment.  
**Independent Test**: Execute the runbook in a sandbox Amplify app and confirm no new builds appear while production traffic remains stable.

### Tests for User Story 1

- [X] T007 [US1] Document sandbox rehearsal validation (list-branches + list-jobs outputs) under **Phase A – Pause builds** in `specs/001-pause-amplify-builds/quickstart.md`.

### Implementation for User Story 1

- [X] T008 [P] [US1] Write CLI branch-switch procedure (disable `main`, create/attach `amplify-paused`) with guardrail notes in `specs/001-pause-amplify-builds/runbooks/pause-builds-cli.md`.
- [X] T009 [P] [US1] Capture Amplify Console navigation steps with screenshot callouts in `specs/001-pause-amplify-builds/runbooks/pause-builds-console.md`.
- [X] T010 [US1] Synthesize CLI + console flows and placeholder branch governance inside `specs/001-pause-amplify-builds/runbooks/pause-builds.md`.
- [X] T011 [US1] Embed notification + evidence capture workflow (FR-004, FR-006) referencing Communication Packet fields inside `specs/001-pause-amplify-builds/runbooks/pause-builds.md`.

#### Parallel Execution Example (US1)

- Run T008 (CLI runbook) and T009 (Console runbook) in parallel because each targets a distinct file with no shared dependencies.
- T010 consolidates the parallel outputs, while T007 and T011 wait for the supporting documentation (quickstart + communications) to be ready.

---

## Phase 4: User Story 2 - Runbook for re-enabling builds (Priority: P2)

**Goal**: Deliver console and CLI runbooks that restore monitoring to the production branch within 10 minutes.  
**Independent Test**: Follow the resume runbook in a test Amplify app until a new commit to the production branch triggers an automatic build.

### Tests for User Story 2

- [X] T012 [US2] Add dry-run validation (resume + commit trigger) steps to **Phase C – Resume builds** in `specs/001-pause-amplify-builds/quickstart.md`.

### Implementation for User Story 2

- [X] T013 [P] [US2] Author CLI resume procedure (update-branch commands + `/amplify/resume` contract fields) in `specs/001-pause-amplify-builds/runbooks/resume-builds-cli.md`.
- [X] T014 [P] [US2] Detail Amplify Console resume steps (toggle auto-build on `main`, disable placeholder monitoring) in `specs/001-pause-amplify-builds/runbooks/resume-builds-console.md`.
- [X] T015 [US2] Document placeholder branch retirement safeguards and alerts inside `specs/001-pause-amplify-builds/runbooks/resume-builds.md`.
- [X] T016 [US2] Add `resumeAck` approval gate instructions (link checklist IDs + approval timestamps) to the decision checkpoint section of `specs/001-pause-amplify-builds/runbooks/resume-builds.md`.

#### Parallel Execution Example (US2)

- T013 (CLI runbook) and T014 (Console runbook) can proceed simultaneously because they touch different files.
- T012 consumes the finished procedures, T015 consolidates the outputs, and T016 references the consolidated runbook before tying into the checklist artifacts defined in T004.

---

## Phase 5: User Story 3 - Verify pause state and site health (Priority: P3)

**Goal**: Provide a repeatable verification checklist proving builds remain paused while the site stays healthy.  
**Independent Test**: Run the checklist immediately after pausing and record evidence (build history, curl hash, Playwright snapshot, hourly re-check).

### Tests for User Story 3

- [X] T017 [P] [US3] Create `specs/001-pause-amplify-builds/verification-checklist.md` template with fields for build snapshots, curl hash, Playwright evidence, hourly follow-up, and resumeAck.

### Implementation for User Story 3

- [X] T018 [US3] Embed build-history + hosting-status capture commands and evidence storage instructions in **Phase B – Verification checklist** of `specs/001-pause-amplify-builds/quickstart.md`.
- [X] T019 [US3] Add curl + SHA hash procedure plus sample output snippets to `specs/001-pause-amplify-builds/quickstart.md`.
- [X] T020 [P] [US3] Scaffold `specs/001-pause-amplify-builds/scripts/verify-pause.spec.ts` with Playwright DOM snapshot steps referenced by the checklist.

#### Parallel Execution Example (US3)

- T017 (checklist template) and T020 (Playwright script) can be developed concurrently because they live in different files.
- T018 and T019 follow once the template fields exist so the quickstart references the finalized evidence schema.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Tighten documentation cohesion and audit readiness.

- [X] T021 Cross-link plan.md, runbooks, quickstart, data-model, and contracts via a documentation index in `specs/001-pause-amplify-builds/plan.md`.
- [X] T022 Record end-to-end dry-run results (timestamps, approvers, evidence links) in `specs/001-pause-amplify-builds/runbooks/dry-run-log.md` and surface summary bullets in `specs/001-pause-amplify-builds/plan.md`.

---

## Dependencies & Execution Order

1. **Phase Graph**: `Setup → Foundational → US1 (P1) → US2 (P2) → US3 (P3) → Polish`.
2. **Story Dependencies**:
   - US1 depends on Phase 1–2 completion; unlocks MVP.
   - US2 depends on US1 artifacts (pause runbook references) plus contracts mapping.
   - US3 depends on US1 (evidence of pause) and informs US2 via `resumeAck`.
3. **Validation**: Each story includes its own independent test criteria (quickstart Phases A–C + verification checklist) ensuring tasks remain independently testable before proceeding.

---

## Parallel Execution Opportunities

- Setup: T002 and T003 can run after T001 scaffolds directories.
- Foundational: T005 and T006 execute concurrently while T004 finalizes entity mappings.
- Cross-story: After Foundational, US1–US3 can advance in parallel by different contributors as long as dependencies above are honored.

---

## Implementation Strategy

### MVP First (Deliver US1)

1. Complete Phases 1–2 to lock prerequisites.
2. Finish Phase 3 (US1) and run sandbox validation per T007.
3. Capture evidence in quickstart + checklist, then pause for stakeholder review before touching other stories.

### Incremental Delivery

1. Deploy MVP (US1) runbook to ops team.
2. Layer US2 resume procedures next so deploys can resume on demand.
3. Finalize US3 verification artifacts to provide audit evidence and monitoring guardrails.
4. Use Phase 6 to polish documentation and record dry-run outputs.

### Parallel Team Strategy

1. Shared team completes Setup + Foundational tasks collaboratively.
2. Assign US1 to the engineer documenting pause procedures, US2 to the engineer focused on resume operations, and US3 to the reliability engineer capturing verification tooling.
3. Sync through the dependency graph to ensure checklist IDs and communication packets stay consistent across stories.

---

## Notes

- Tests highlighted in each story are documentation-based validations sourced from quickstart.md and verification-checklist.md (per spec requirements).
- All tasks include absolute file paths so each increment remains actionable without extra context.
- Maintain evidence artifacts (screenshots, CLI outputs, Playwright snapshots) alongside the checklist to satisfy FR-005 through FR-007.
