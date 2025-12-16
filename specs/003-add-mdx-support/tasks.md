# Tasks: MDX Content Pipeline

**Input**: Design documents from `/specs/003-add-mdx-support/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓

**Tests**: Not explicitly requested in specification - omitting test tasks per template guidelines.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Exact file paths included in descriptions

## Path Conventions

Based on plan.md structure:
- **App code**: `apps/site-shell/`
- **Content**: `content/posts/` (monorepo root)
- **Specs**: `specs/003-add-mdx-support/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency installation

- [X] T001 Install MDX dependencies (next-mdx-remote, gray-matter, zod) in apps/site-shell/package.json
- [X] T002 Create MDX utility directory structure at apps/site-shell/lib/mdx/
- [X] T003 [P] Create MDX components directory at apps/site-shell/components/mdx/
- [X] T004 [P] Create content directory at content/posts/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core MDX infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Create TypeScript type definitions in apps/site-shell/lib/mdx/types.ts (ImageMeta, FrontmatterMetadata, MDXEntry, ValidationResult, MDXBuildSummary)
- [X] T006 [P] Implement Zod frontmatter schema in apps/site-shell/lib/mdx/validator.ts (FrontmatterSchema, ImageMetaSchema)
- [X] T007 [P] Create component whitelist registry in apps/site-shell/components/mdx/index.ts (mdxComponents export)

**Checkpoint**: Foundation ready - MDX types, validation, and component registry in place

---

## Phase 3: User Story 1 - Publish a new MDX article (Priority: P1) 🎯 MVP

**Goal**: Enable content editors to drop an MDX file with frontmatter into content directory and have the site render it as a page without code changes.

**Independent Test**: Place a correctly formatted MDX file in `/content/posts/`, run build, verify new URL renders content with metadata displayed.

### Implementation for User Story 1

- [X] T008 [US1] Implement frontmatter parser in apps/site-shell/lib/mdx/parser.ts (parseFrontmatter function using gray-matter)
- [X] T009 [US1] Implement MDX file loader in apps/site-shell/lib/mdx/loader.ts (getAllPosts, getPostBySlug functions with slug derivation from filename)
- [X] T010 [US1] Implement duplicate slug detection in apps/site-shell/lib/mdx/loader.ts (fail build on conflicts per FR-002)
- [X] T011 [US1] Create MDXContent renderer component in apps/site-shell/components/mdx/MDXContent.tsx (using next-mdx-remote/rsc)
- [X] T012 [US1] Create dynamic route page at apps/site-shell/app/posts/[slug]/page.tsx (with generateStaticParams and metadata)
- [X] T013 [US1] Implement generateStaticParams in apps/site-shell/app/posts/[slug]/page.tsx (load all slugs from content directory)

**Checkpoint**: User Story 1 complete - MDX files in /content/posts/ render as pages at /posts/[slug]

---

## Phase 4: User Story 2 - Validate metadata contract (Priority: P2)

**Goal**: Ensure build fails with actionable errors when MDX files have missing/invalid frontmatter fields.

**Independent Test**: Add MDX file with missing required field or invalid date format, confirm build fails with error message containing file path and field name.

### Implementation for User Story 2

- [X] T014 [US2] Integrate Zod validation into parser in apps/site-shell/lib/mdx/parser.ts (call FrontmatterSchema.safeParse)
- [X] T015 [US2] Implement actionable error messages in apps/site-shell/lib/mdx/validator.ts (format: [filePath] Missing required field: fieldName)
- [X] T016 [US2] Implement date format validation in apps/site-shell/lib/mdx/validator.ts (YYYY-MM-DD regex + valid calendar date check)
- [X] T017 [US2] Implement build summary logging in apps/site-shell/lib/mdx/loader.ts (FR-008: total files, pass/fail counts, warnings)
- [X] T018 [US2] Add unrecognized component warning in apps/site-shell/components/mdx/MDXContent.tsx (log warning for components not in whitelist)

**Checkpoint**: User Story 2 complete - Invalid MDX files halt build with clear error messages

---

## Phase 5: User Story 3 - Demo MDX page consumption (Priority: P3)

**Goal**: Site visitor can access /posts/demo-mdx and see body content, metadata, and optional image rendered with design tokens.

**Independent Test**: Navigate to /posts/demo-mdx, confirm page displays title, formatted date, description, body content, and optional image (or graceful fallback).

### Implementation for User Story 3

- [X] T019 [P] [US3] Create demo MDX file at content/posts/demo-mdx.mdx (valid frontmatter with title, date, description; optional image example)
- [X] T020 [US3] Implement metadata display in apps/site-shell/app/posts/[slug]/page.tsx (render title, formatted date, description)
- [X] T021 [US3] Implement optional image handling in apps/site-shell/app/posts/[slug]/page.tsx (render hero image with alt text if present, graceful fallback if absent)
- [X] T022 [US3] Verify demo page renders at /posts/demo-mdx with all frontmatter fields and MDX body content

**Checkpoint**: User Story 3 complete - Demo entry proves end-to-end pipeline works

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation and final validation

- [X] T023 [P] Update quickstart.md with actual implementation paths in specs/003-add-mdx-support/quickstart.md
- [X] T024 [P] Add editor documentation (FR-006) in README or docs explaining how to add MDX files
- [X] T025 Verify existing blog routes not regressed (FR-007)
- [X] T026 Validate build time increase <10% from baseline (SC-004)
- [X] T027 Run quickstart.md validation scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Phase 2, integrates with US1 parser/loader
- **User Story 3 (P3)**: Can start after Phase 2, depends on US1 route and US2 validation being functional

### Within Each User Story

- Parser/loader utilities before components
- Components before route pages
- Core implementation before integration

### Parallel Opportunities

- T003, T004 can run in parallel (different directories)
- T006, T007 can run in parallel (different files)
- T019 can run in parallel with other US3 tasks (content file independent of code)
- T023, T024 can run in parallel (different documentation files)

---

## Parallel Example: Phase 2 Foundational

```bash
# Can run in parallel after T005 completes:
Task T006: "Implement Zod frontmatter schema in apps/site-shell/lib/mdx/validator.ts"
Task T007: "Create component whitelist registry in apps/site-shell/components/mdx/index.ts"
```

## Parallel Example: User Story 3

```bash
# Can run in parallel:
Task T019: "Create demo MDX file at content/posts/demo-mdx.mdx"
# T019 is independent of code implementation
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T007)
3. Complete Phase 3: User Story 1 (T008-T013)
4. **STOP and VALIDATE**: Test by adding MDX file and verifying page renders
5. Deploy/demo if ready - basic MDX support working

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → MVP delivered (publish MDX articles)
3. Add User Story 2 → Test independently → Validation protection
4. Add User Story 3 → Test independently → Demo entry proves pipeline
5. Polish → Documentation and performance validation

### Sequential Single Developer

Execute in strict order: T001 → T002 → T003 → ... → T027

---

## Task-to-Requirement Mapping

| Task | Requirements | User Story |
|------|--------------|------------|
| T001 | - | Setup |
| T002-T004 | - | Setup |
| T005 | FR-001 | Foundation |
| T006 | FR-001, FR-002 | Foundation |
| T007 | Edge Case (whitelist) | Foundation |
| T008-T009 | FR-003 | US1 |
| T010 | Edge Case (duplicates) | US1 |
| T011-T012 | FR-004 | US1 |
| T013 | FR-003 | US1 |
| T014-T016 | FR-002 | US2 |
| T017 | FR-008 | US2 |
| T018 | Edge Case (components) | US2 |
| T019-T022 | FR-005 | US3 |
| T023-T024 | FR-006 | Polish |
| T025 | FR-007 | Polish |
| T026 | SC-004 | Polish |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Content directory path: Use `path.join(process.cwd(), '../../content/posts')` from apps/site-shell or monorepo root detection
