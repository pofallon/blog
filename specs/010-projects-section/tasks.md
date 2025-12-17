# Tasks: Open Source Projects Section

**Input**: Design documents from `/specs/010-projects-section/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Not explicitly requested in spec - tests tasks are excluded.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Project Type**: Monorepo with `apps/site-shell/` for web app
- **Content**: `content/` at repository root
- **Source**: `apps/site-shell/` for Next.js app

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for projects feature

- [ ] T001 Create projects directory structure: `apps/site-shell/lib/projects/`, `apps/site-shell/components/projects/`, `apps/site-shell/app/projects/`
- [ ] T002 [P] Create TypeScript types in `apps/site-shell/lib/projects/types.ts` with Project, ProjectLink, ProjectImage, ProjectCardModel, ProjectDetailModel interfaces
- [ ] T003 [P] Create Zod validation schema in `apps/site-shell/lib/projects/schema.ts` with projectLinkSchema, projectImageSchema, projectSchema, projectsDataSchema, and validateUniqueSlugs function

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Create initial project data file `content/projects.json` with empty projects array structure
- [ ] T005 Implement project loader in `apps/site-shell/lib/projects/loader.ts` with getAllProjects(), getProjectBySlug(), and getAllProjectSlugs() functions including Zod validation and alphabetical sorting
- [ ] T006 [P] Create images directory `apps/site-shell/public/images/projects/` with .gitkeep placeholder

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Browse Open Source Catalog (Priority: P1) 🎯 MVP

**Goal**: Visitors can browse every highlighted open source project in one place to understand what this portfolio covers and where to click next.

**Independent Test**: Load `/projects` with populated data and confirm every project entry renders with the documented schema fields and links to its detail page.

### Implementation for User Story 1

- [ ] T007 [P] [US1] Create ProjectCard component in `apps/site-shell/components/projects/ProjectCard.tsx` displaying name, summary, up to 3 tags, and link to detail page
- [ ] T008 [P] [US1] Create ProjectTags component in `apps/site-shell/components/projects/ProjectTags.tsx` with optional maxDisplay prop for tag limiting
- [ ] T009 [P] [US1] Create ProjectEmptyState component in `apps/site-shell/components/projects/ProjectEmptyState.tsx` for zero-projects scenario
- [ ] T010 [US1] Create projects index page in `apps/site-shell/app/projects/page.tsx` with static metadata (title, description, OpenGraph tags per routes.md contract), getAllProjects() call, alphabetical rendering, and empty state handling
- [ ] T011 [US1] Add sample project to `content/projects.json` for validation and development testing (minimal entry; T018 expands to 2-3 for documentation completeness)

**Checkpoint**: At this point, User Story 1 should be fully functional - `/projects` renders all projects from data source

---

## Phase 4: User Story 2 - Evaluate Individual Project (Priority: P2)

**Goal**: A visitor chooses a project from the catalog to learn its purpose, contribution links, and metadata before deciding to engage.

**Independent Test**: Navigate to `/projects/[slug]` for a valid slug and confirm all schema fields display, links resolve, and navigation back to `/projects` works; repeat with an invalid slug to ensure graceful handling.

### Implementation for User Story 2

- [ ] T012 [P] [US2] Create ProjectDetail component in `apps/site-shell/components/projects/ProjectDetail.tsx` displaying full details, all tags, labeled links, image or placeholder, and primary CTA button
- [ ] T013 [P] [US2] Create ProjectNotFound component in `apps/site-shell/components/projects/ProjectNotFound.tsx` with friendly message and CTA back to `/projects`
- [ ] T014 [US2] Create project detail page in `apps/site-shell/app/projects/[slug]/page.tsx` with generateStaticParams(), generateMetadata(), getProjectBySlug() call, and soft 404 handling
- [ ] T015 [US2] Implement analytics event tracking for primary CTA click in ProjectDetail using existing site analytics library per FR-006 (prerequisite: verify analytics library exists in `apps/site-shell/` before implementing)
- [ ] T016 [US2] Add image placeholder/fallback styling in ProjectDetail for projects without images

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - full project browsing and detail viewing functional

---

## Phase 5: User Story 3 - Maintain Project Source Data (Priority: P3)

**Goal**: A maintainer curates the catalog by editing the local data source and relies on schema documentation to keep entries consistent.

**Independent Test**: Provide the schema doc and example entry to a new maintainer; they can add a project by editing the data file only, and validation prevents saving incomplete or duplicate entries.

### Implementation for User Story 3

- [ ] T017 [US3] Enhance loader validation in `apps/site-shell/lib/projects/loader.ts` to fail build with clear error messages for missing required fields, duplicate slugs, and invalid URLs
- [ ] T018 [US3] Add 2-3 sample projects to `content/projects.json` demonstrating all optional and required fields per quickstart.md example format
- [ ] T019 [US3] Verify quickstart.md documentation accuracy against final implementation - update if needed in `specs/010-projects-section/quickstart.md`

**Checkpoint**: All user stories should now be independently functional - maintainers can add projects via data file only

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T020 [P] Verify all edge cases: zero projects shows empty state, >5 tags wrap properly, missing image shows placeholder
- [ ] T021 [P] Run build validation: `npm run build` from `apps/site-shell/` succeeds with all routes generated
- [ ] T022 Perform manual QA using quickstart.md validation scenarios
- [ ] T023 [P] Clean up any placeholder/development content from `content/projects.json` if needed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Depends on T007 (ProjectCard) for navigation consistency but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Depends on loader from T005 but independently testable

### Within Each User Story

- Components before pages
- Models/services before UI integration
- Core implementation before polish
- Story complete before moving to next priority

### Parallel Opportunities

- T002 and T003 can run in parallel (different files in lib/projects/)
- T007, T008, T009 can run in parallel (different component files)
- T012 and T013 can run in parallel (different component files)
- T020, T021, T023 can run in parallel (different validation tasks)

---

## Parallel Example: User Story 1

```bash
# Launch all components for User Story 1 together:
Task: T007 "Create ProjectCard component in apps/site-shell/components/projects/ProjectCard.tsx"
Task: T008 "Create ProjectTags component in apps/site-shell/components/projects/ProjectTags.tsx"
Task: T009 "Create ProjectEmptyState component in apps/site-shell/components/projects/ProjectEmptyState.tsx"
```

## Parallel Example: User Story 2

```bash
# Launch all components for User Story 2 together:
Task: T012 "Create ProjectDetail component in apps/site-shell/components/projects/ProjectDetail.tsx"
Task: T013 "Create ProjectNotFound component in apps/site-shell/components/projects/ProjectNotFound.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T006)
3. Complete Phase 3: User Story 1 (T007-T011)
4. **STOP and VALIDATE**: Test `/projects` page independently
5. Deploy/demo if ready - visitors can browse the catalog

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP! - index page live)
3. Add User Story 2 → Test independently → Deploy/Demo (detail pages added)
4. Add User Story 3 → Test independently → Deploy/Demo (maintainer workflow validated)
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (index page)
   - Developer B: User Story 2 (detail pages)
   - Developer C: User Story 3 (validation/docs)
3. Stories complete and integrate independently

---

## File Summary

| Task Range | Directory | Files Created |
|------------|-----------|---------------|
| T001 | apps/site-shell/ | Directory structure |
| T002-T003 | apps/site-shell/lib/projects/ | types.ts, schema.ts |
| T004 | content/ | projects.json |
| T005 | apps/site-shell/lib/projects/ | loader.ts |
| T006 | apps/site-shell/public/images/projects/ | .gitkeep |
| T007-T009 | apps/site-shell/components/projects/ | ProjectCard.tsx, ProjectTags.tsx, ProjectEmptyState.tsx |
| T010 | apps/site-shell/app/projects/ | page.tsx |
| T012-T013 | apps/site-shell/components/projects/ | ProjectDetail.tsx, ProjectNotFound.tsx |
| T014 | apps/site-shell/app/projects/[slug]/ | page.tsx |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Analytics integration (T015) requires existing site analytics library - verify availability before implementing
