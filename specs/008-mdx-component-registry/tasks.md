# Tasks: Custom MDX Component Registry

**Input**: Design documents from `/specs/008-mdx-component-registry/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Test tasks are NOT included as they were not explicitly requested in the specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md, this is a monorepo web application:
- **Components**: `apps/site-shell/components/mdx/registry/`
- **Lib**: `apps/site-shell/lib/mdx/`
- **Types**: `apps/site-shell/components/mdx/registry/types.ts`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create project structure and registry foundation

- [X] T001 Create registry directory structure at `apps/site-shell/components/mdx/registry/`
- [X] T002 [P] Create registry types in `apps/site-shell/components/mdx/registry/types.ts` (copy from contracts/registry-types.ts)
- [X] T003 [P] Create validation utilities in `apps/site-shell/components/mdx/registry/validation.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core registry infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Create component registry Map in `apps/site-shell/components/mdx/registry/registry.ts` with getComponent() and registeredComponents exports
- [X] T005 Create FallbackPlaceholder component in `apps/site-shell/components/mdx/registry/FallbackPlaceholder.tsx` for unknown/invalid components
- [X] T006 Create credential policy configuration in `apps/site-shell/components/mdx/registry/credentials.ts` with YOUTUBE_API_KEY policy
- [X] T007 Update MDX component exports in `apps/site-shell/components/mdx/index.ts` to export registry utilities
- [X] T008 Create structured logging utility in `apps/site-shell/components/mdx/registry/logger.ts` with logComponentEvent function

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Insert Registered Components (Priority: P1) 🎯 MVP

**Goal**: Content authors can reference registered React components by name in MDX without code changes

**Independent Test**: Create a draft MDX post referencing a registered component, verify it builds and renders correctly

### Implementation for User Story 1

- [X] T009 [US1] Extend MDXContent.tsx Proxy handler at `apps/site-shell/components/mdx/MDXContent.tsx` to validate against registry and emit structured warnings
- [X] T010 [US1] Update blog-post-components.tsx at `apps/site-shell/lib/mdx/blog-post-components.tsx` to merge registry exports with existing component map
- [X] T011 [US1] Create prop validation wrapper in `apps/site-shell/components/mdx/registry/withValidation.tsx` that applies Zod schema validation and defaults
- [X] T012 [US1] Add build-time validation logging for unknown components in `apps/site-shell/components/mdx/registry/registry.ts`
- [X] T013 [US1] Implement deprecation notice display in FallbackPlaceholder for deprecated components

**Checkpoint**: Registry framework complete. Authors can reference registered components with validation and fallback handling.

---

## Phase 4: User Story 2 - PlaylistEmbed Parity (Priority: P2)

**Goal**: Readers see PlaylistEmbed component in MDX posts that mirrors current playlist-style embed behavior

**Independent Test**: Publish a post with PlaylistEmbed component and verify controls, track sequencing, and styling match existing behavior

### Implementation for User Story 2

- [X] T014 [P] [US2] Create PlaylistEmbed component directory at `apps/site-shell/components/mdx/registry/PlaylistEmbed/`
- [X] T015 [P] [US2] Create PlaylistEmbed types in `apps/site-shell/components/mdx/registry/PlaylistEmbed/types.ts` (copy from contracts/playlist-embed.ts)
- [X] T016 [US2] Implement basic YouTube iframe embed in `apps/site-shell/components/mdx/registry/PlaylistEmbed/YouTubeEmbed.tsx`
- [X] T017 [US2] Implement PlaylistEmbed component in `apps/site-shell/components/mdx/registry/PlaylistEmbed/index.tsx` with prop validation
- [X] T018 [US2] Create fallback state handling in `apps/site-shell/components/mdx/registry/PlaylistEmbed/Fallback.tsx` for invalid IDs and errors
- [X] T019 [US2] Register PlaylistEmbed in registry at `apps/site-shell/components/mdx/registry/registry.ts`
- [X] T020 [US2] Replace Playlist placeholder in `apps/site-shell/lib/mdx/blog-post-components.tsx` with registered PlaylistEmbed
- [X] T021 [US2] Add lazy loading (loading="lazy") and performance optimization to YouTubeEmbed component

**Checkpoint**: PlaylistEmbed component fully functional with core embed features

---

## Phase 5: User Story 3 - Safe Credential Handling (Priority: P3)

**Goal**: Builds stay green and UI degrades gracefully when optional API credentials are missing

**Independent Test**: Remove YOUTUBE_API_KEY from environment, rebuild site, verify pages render with fallback messaging

### Implementation for User Story 3

- [X] T022 [US3] Implement credential availability check in `apps/site-shell/components/mdx/registry/credentials.ts` with hasCredential() function
- [X] T023 [US3] Add credential validation on component init in PlaylistEmbed at `apps/site-shell/components/mdx/registry/PlaylistEmbed/index.tsx`
- [X] T024 [US3] Implement enhanced metadata fetch (with API key) in `apps/site-shell/components/mdx/registry/PlaylistEmbed/api.ts`
- [X] T025 [US3] Create enhanced PlaylistEmbed view with metadata display in `apps/site-shell/components/mdx/registry/PlaylistEmbed/EnhancedEmbed.tsx`
- [X] T026 [US3] Add credential status logging at startup in `apps/site-shell/components/mdx/registry/credentials.ts`
- [X] T027 [US3] Implement automatic re-enable when credentials reintroduced by checking at render time

**Checkpoint**: Credential handling complete. Builds never fail due to missing credentials.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, optimization, and governance support

- [X] T028 [P] Generate author documentation in `docs/mdx-components.md` from registry metadata
- [X] T029 [P] Add usage analytics logging in registry.ts for FR-009 governance tracking
- [X] T030 Measure and validate LCP impact (must be ≤500ms per Risk #2) using Lighthouse
- [X] T031 Run quickstart.md validation scenarios from `specs/008-mdx-component-registry/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - US1 (Phase 3) can start immediately after Foundational
  - US2 (Phase 4) can start in parallel with US1 (different files)
  - US3 (Phase 5) depends on US2 completion (extends PlaylistEmbed)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1
- **User Story 3 (P3)**: Depends on US2 completion (extends PlaylistEmbed credential handling)

### Within Each User Story

- Models/types before components
- Core implementation before enhancements
- Validation before registration
- Registration before usage in blog-post-components

### Parallel Opportunities

- T002, T003 can run in parallel (different files in setup)
- T014, T015 can run in parallel (directory and types for US2)
- T028, T029 can run in parallel (different files in polish)
- US1 and US2 can be worked on in parallel by different developers

---

## Parallel Example: User Story 2

```bash
# Launch PlaylistEmbed setup tasks together:
Task: "Create PlaylistEmbed component directory at apps/site-shell/components/mdx/registry/PlaylistEmbed/"
Task: "Create PlaylistEmbed types in apps/site-shell/components/mdx/registry/PlaylistEmbed/types.ts"

# After setup, implement components:
Task: "Implement basic YouTube iframe embed in apps/site-shell/components/mdx/registry/PlaylistEmbed/YouTubeEmbed.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test component registry with a simple test component
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Registry framework ready
2. Add User Story 1 → Test registry mechanics → Deploy/Demo (MVP!)
3. Add User Story 2 → Test PlaylistEmbed → Deploy/Demo
4. Add User Story 3 → Test credential fallbacks → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:
1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (registry framework)
   - Developer B: User Story 2 (PlaylistEmbed)
3. After US2: Developer B continues to US3 (credentials)
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Existing `Playlist: PlaceholderComponent` in blog-post-components.tsx will be replaced in US2
- YouTube iframe embeds are stateless, require no API key for basic functionality
- Enhanced features (metadata, thumbnails) require optional YOUTUBE_API_KEY
