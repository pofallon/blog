# Tasks: Deterministic Slug Preservation

**Input**: Design documents from `/specs/004-preserve-slugs/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓, quickstart.md ✓

**Tests**: Not explicitly requested - test tasks excluded.

**Organization**: Tasks grouped by user story (P1, P2, P3) for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- File paths relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, TypeScript configuration, and dependency installation

- [X] T001 Create directory structure `src/lib/slug/` and `src/cli/` per plan.md
- [X] T002 Install `slugify` package with TypeScript types (`npm install slugify @types/slugify`)
- [X] T003 [P] Configure TypeScript strict mode in `tsconfig.json` for new source files
- [X] T004 [P] Copy type definitions from `specs/004-preserve-slugs/contracts/slug-api.ts` to `src/lib/slug/types.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core slug library that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Implement `normalizeForSlug()` function in `src/lib/slug/normalize.ts` applying rules from data-model.md (lowercase, hyphenation, ASCII transliteration via slugify)
- [X] T006 Implement `generateSlug()` function in `src/lib/slug/index.ts` that validates path structure and calls normalize
- [X] T007 Implement `ContentStructureError` and `SlugCollisionError` classes in `src/lib/slug/types.ts` per contracts/slug-api.ts
- [X] T008 Export all public APIs from `src/lib/slug/index.ts` barrel file
- [X] T008.1 Generate initial `slug-manifest.json` by scanning existing `content/blog/` and capturing current slugs (required for FR-003)

**Checkpoint**: Slug library ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Preserve Existing Blog URLs (Priority: P1) 🎯 MVP

**Goal**: Ensure slug generation reproduces all existing Gatsby blog URLs without breaking historic links

**Independent Test**: Run `npm run verify-slugs` against all `content/blog` entries; all slugs match manifest with zero mismatches

### Implementation for User Story 1

- [X] T009 [US1] Implement `enumerateContentFiles()` function in `src/lib/slug/enumerate.ts` to scan `content/blog/` directory
- [X] T010 [US1] Add path structure validation in `enumerateContentFiles()` enforcing `{collection}/index.md` pattern (FR-007)
- [X] T011 [US1] Implement `loadManifest()` function in `src/lib/slug/manifest.ts` to read `specs/004-preserve-slugs/slug-manifest.json`
- [X] T012 [US1] Implement `verifySlug()` comparison logic in `src/lib/slug/verify.ts` returning VerificationDetail per file
- [X] T013 [US1] Implement `generateVerificationReport()` in `src/lib/slug/verify.ts` aggregating results into VerificationReport
- [X] T014 [US1] Add slug collision detection in `generateVerificationReport()` to fail on duplicate slugs (SlugCollisionError)

**Checkpoint**: User Story 1 complete - existing URLs are preserved and verifiable

---

## Phase 4: User Story 2 - Author New Posts with Predictable Slugs (Priority: P2)

**Goal**: Enable content editors to create posts with deterministic, predictable slugs based on folder structure

**Independent Test**: Create a new post following documented folder template, run `npm run slug:preview`, confirm slug matches path structure

### Implementation for User Story 2

- [X] T015 [US2] Create `src/cli/preview-slug.ts` CLI command that accepts a relative path and outputs the generated slug
- [X] T016 [US2] Add `slug:preview` npm script in `package.json` running `ts-node src/cli/preview-slug.ts`
- [X] T017 [US2] Implement user-friendly error messages in preview CLI for invalid path structures
- [X] T018 [US2] Create content folder structure documentation in `docs/content-structure.md` per quickstart.md naming rules

**Checkpoint**: User Story 2 complete - editors can preview slugs before publishing

---

## Phase 5: User Story 3 - Automate Slug Regression Checks (Priority: P3)

**Goal**: Provide CI/CD verification command that blocks builds when slugs deviate from canonical manifest

**Independent Test**: Run `npm run verify-slugs` in isolation; it reports matches/mismatches and exits non-zero on discrepancies

### Implementation for User Story 3

- [X] T019 [US3] Create `src/cli/verify-slugs.ts` CLI command implementing VerifySlugsFn from contracts
- [X] T020 [US3] Add JSON output format to verify-slugs CLI for programmatic CI/CD consumption
- [X] T021 [US3] Add human-readable console summary output to verify-slugs CLI (file counts, mismatches, guidance)
- [X] T022 [US3] Implement exit code logic: 0 for all match, 1 for mismatches (SC-002: <60s execution)
- [X] T023 [US3] Add `verify-slugs` npm script in `package.json` running `ts-node src/cli/verify-slugs.ts`
- [X] T024 [US3] Add `prebuild` npm script in `package.json` calling `npm run verify-slugs` per research.md decision
- [X] T025 [US3] Implement `updateManifest()` function in `src/lib/slug/manifest.ts` for FR-006 (explicit approval workflow)
- [X] T026 [US3] Create `src/cli/update-manifest.ts` CLI command for `npm run slug:update-manifest`
- [X] T027 [US3] Add `slug:update-manifest` npm script in `package.json`

**Checkpoint**: User Story 3 complete - CI/CD blocks builds on slug deviations

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, validation, and cleanup across all stories

- [X] T028 [P] Update `docs/content-structure.md` with troubleshooting section from quickstart.md
- [X] T029 [P] Add JSDoc comments to all exported functions in `src/lib/slug/`
- [X] T030 Run quickstart.md validation scenarios end-to-end (preview, verify, update-manifest workflow)
- [X] T031 Verify SC-002: Execution time <60 seconds for full content set
- [X] T032 Update repository README.md with link to slug documentation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational (Phase 2) completion
  - Stories can proceed in parallel if staffed
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Foundational (Phase 2) only
- **User Story 2 (P2)**: Depends on Foundational (Phase 2); uses slug library from US1
- **User Story 3 (P3)**: Depends on Foundational (Phase 2); uses enumerate/verify from US1

### Within Each User Story

- Core functions before CLI commands
- Validation before output formatting
- Story complete before moving to next priority

### Parallel Opportunities

- T003, T004 can run in parallel (Setup phase)
- T028, T029 can run in parallel (Polish phase)
- User stories can be worked on in parallel after Foundational phase completes

---

## Parallel Example: Setup Phase

```bash
# Launch in parallel after T001, T002:
Task T003: "Configure TypeScript strict mode in tsconfig.json"
Task T004: "Copy type definitions from contracts/slug-api.ts to src/lib/slug/types.ts"
```

## Parallel Example: Multiple Developers

```bash
# After Foundational (Phase 2) completes:
Developer A: User Story 1 (T009-T014) - Core verification
Developer B: User Story 2 (T015-T018) - Preview CLI + docs
Developer C: User Story 3 (T019-T027) - CI/CD integration
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Run verification manually, confirm 0 mismatches for existing content
5. Deploy if ready - existing URLs preserved ✓

### Incremental Delivery

1. Setup + Foundational → Slug library ready
2. Add User Story 1 → Verify existing posts → MVP complete
3. Add User Story 2 → Preview slugs → Editor workflow ready
4. Add User Story 3 → CI/CD integration → Full automation
5. Polish → Documentation and validation

### Success Criteria Mapping

| Task(s) | Success Criteria |
|---------|------------------|
| T013-T014 | SC-001: 0 slug mismatches for 100% of existing posts |
| T022 | SC-002: Verification <60 seconds |
| T018, T028 | SC-004: Content folder documentation published |
| T015-T17 | SC-003: 95% of new posts require zero manual overrides |

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [US#] label maps task to specific user story
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- `slugify` package selected per research.md decision (20M+ weekly downloads, TypeScript types)
