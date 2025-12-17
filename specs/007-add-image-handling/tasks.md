# Tasks: Blog Image Handling Enhancements

**Input**: Design documents from `/specs/007-add-image-handling/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓

**Tests**: Not explicitly requested in feature specification. Test tasks omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Monorepo structure**: `apps/site-shell/` for Next.js application
- **Content**: `content/images/<post-slug>/` for image assets
- **Components**: `apps/site-shell/components/blog/`
- **Library**: `apps/site-shell/lib/mdx/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and image directory structure

- [X] T001 Create image content directory structure at `content/images/`
- [X] T002 [P] Create image types file at `apps/site-shell/lib/mdx/image-types.ts`
- [X] T003 [P] Create image schemas file at `apps/site-shell/lib/mdx/image-schemas.ts`
- [X] T004 [P] Create image config file at `apps/site-shell/lib/mdx/image-config.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Implement image dimension loader utility in `apps/site-shell/lib/mdx/image-loader.ts`
- [X] T006 Implement image validation function `validatePostImages` in `apps/site-shell/lib/mdx/image-loader.ts`
- [X] T007 Extend existing frontmatter schema to support optional hero field in `apps/site-shell/lib/mdx/blog-post-types.ts`
- [X] T008 Update blog post loader to validate hero images in `apps/site-shell/lib/mdx/blog-post-loader.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Publish posts with optional hero art (Priority: P1) 🎯 MVP

**Goal**: Blog authors can add optional hero images to posts via frontmatter metadata

**Independent Test**: Create a draft post, add hero metadata, run the site locally, and confirm the hero renders with correct alt text and fallback behavior when metadata is removed.

### Implementation for User Story 1

- [X] T009 [US1] Create HeroImage component in `apps/site-shell/components/blog/HeroImage.tsx`
- [X] T010 [US1] Implement `loadHeroImage` function in `apps/site-shell/lib/mdx/image-loader.ts`
- [X] T011 [US1] Integrate HeroImage component into blog post page at `apps/site-shell/app/blog/[slug]/page.tsx`
- [X] T012 [US1] Implement empty state with theme-aware reserved space in HeroImage component
- [X] T013 [US1] Add caption rendering support to HeroImage component
- [X] T014 [US1] Add focalPoint (object-position) support to HeroImage component

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Embed inline images in MDX content (Priority: P2)

**Goal**: Authors can embed inline images in MDX content with predictable paths and responsive sizing

**Independent Test**: Author places two inline images in MDX, starts local dev, and verifies both images load with captions and responsive sizing; removing the underlying files should surface a meaningful warning.

### Implementation for User Story 2

- [X] T015 [US2] Create OptimizedImage component in `apps/site-shell/components/blog/OptimizedImage.tsx`
- [X] T016 [US2] Register OptimizedImage as `Image` MDX component in `apps/site-shell/lib/mdx/blog-post-components.tsx`
- [X] T017 [US2] Implement MDX content scanning for `<Image>` references in `apps/site-shell/lib/mdx/image-loader.ts`
- [X] T018 [US2] Add caption rendering with figcaption in OptimizedImage component
- [X] T019 [US2] Add build-time validation for missing inline images in `apps/site-shell/lib/mdx/image-loader.ts`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Readers view performant, accessible images (Priority: P3)

**Goal**: Readers experience fast-loading, accessible images with no layout shifts

**Independent Test**: Load three representative posts on staging, capture viewport rendering metrics, and confirm images include intrinsic dimensions, alt text, and lazy loading where appropriate.

### Implementation for User Story 3

- [X] T020 [US3] Configure responsive breakpoints (480/768/1200/1920px) in HeroImage component
- [X] T021 [P] [US3] Configure responsive breakpoints (480/768/1200/1920px) in OptimizedImage component
- [X] T022 [US3] Implement lazy loading with 200px viewport threshold in HeroImage component
- [X] T023 [P] [US3] Implement lazy loading with 200px viewport threshold in OptimizedImage component
- [X] T024 [US3] Add blur placeholder (blurDataURL) generation to `apps/site-shell/lib/mdx/image-loader.ts`
- [X] T025 [US3] Add alt text warning during build in `apps/site-shell/lib/mdx/image-loader.ts`
- [X] T026 [US3] Add external URL detection and warning in `apps/site-shell/lib/mdx/image-loader.ts`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, validation, and edge case handling

- [X] T027 [P] Create sample post with hero image in `content/images/` for validation
- [X] T028 [P] Add oversized image warning (>500KB, >2000px) in `apps/site-shell/lib/mdx/image-loader.ts`
- [X] T029 [FR-008] Create author workflow guide at `docs/authoring-images.md` covering: image organization, frontmatter syntax, inline image MDX usage, and troubleshooting common errors
- [X] T030 Run quickstart.md validation scenarios manually. **Done when**: All 3 user story acceptance scenarios pass in local dev
- [X] T031 Verify all edge cases from spec.md are handled. **Done when**: Checklist of 6 edge cases (spec.md L57-62) verified with test posts

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1
- **User Story 3 (P3)**: Depends on US1 and US2 components existing for performance optimization

### Within Each User Story

- Component creation before integration
- Core functionality before enhancements (caption, focalPoint)
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T002, T003, T004)
- T020/T021 and T022/T023 in US3 can run in parallel (different components)
- T027/T028 in Polish phase can run in parallel

---

## Parallel Example: Setup Phase

```bash
# Launch all type definition tasks together:
Task T002: "Create image types file at apps/site-shell/lib/mdx/image-types.ts"
Task T003: "Create image schemas file at apps/site-shell/lib/mdx/image-schemas.ts"
Task T004: "Create image config file at apps/site-shell/lib/mdx/image-config.ts"
```

## Parallel Example: User Story 3

```bash
# Launch responsive breakpoint tasks together (different files):
Task T020: "Configure responsive breakpoints in HeroImage component"
Task T021: "Configure responsive breakpoints in OptimizedImage component"

# Launch lazy loading tasks together (different files):
Task T022: "Implement lazy loading in HeroImage component"
Task T023: "Implement lazy loading in OptimizedImage component"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Hero images)
   - Developer B: User Story 2 (Inline images)
3. User Story 3 applies performance optimizations to both components
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Image directory structure: `content/images/<post-slug>/` per constitution
- No external CDN - all images stored in repository per spec assumptions
