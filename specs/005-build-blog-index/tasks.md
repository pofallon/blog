# Tasks: Minimal Blog Index

**Input**: Design documents from `/specs/005-build-blog-index/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Not explicitly requested - test tasks omitted per template guidelines.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md, this is a Next.js monorepo with site-shell:

- Source: `apps/site-shell/`
- Components: `apps/site-shell/components/`
- Library: `apps/site-shell/lib/`
- Content: `content/posts/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project structure verification and type definitions

- [ ] T001 Add BlogIndexEntry and BlogIndexOptions types to apps/site-shell/lib/mdx/types.ts
- [ ] T002 [P] Create blog components directory structure at apps/site-shell/components/blog/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 Implement generateExcerpt utility function in apps/site-shell/lib/mdx/loader.ts
- [ ] T004 Implement transformToBlogIndexEntry function in apps/site-shell/lib/mdx/loader.ts
- [ ] T005 Implement getAllPostsForIndex function with sorting and filtering in apps/site-shell/lib/mdx/loader.ts
- [ ] T006 Export new functions and types from apps/site-shell/lib/mdx/index.ts (if exists)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Scan Latest Posts (Priority: P1) 🎯 MVP

**Goal**: Display reverse-chronological post listing with metadata on `/blog`

**Independent Test**: Load `/blog` with at least three posts having distinct dates and confirm the list renders, is sorted newest-first, and exposes required metadata (title, human-readable date, short summary).

### Implementation for User Story 1

- [ ] T007 [US1] Create BlogPostCard component in apps/site-shell/components/blog/BlogPostCard.tsx
- [ ] T008 [US1] Create EmptyState component for zero posts in apps/site-shell/components/blog/EmptyState.tsx
- [ ] T009 [US1] Update blog index page to use getAllPostsForIndex in apps/site-shell/app/blog/page.tsx
- [ ] T010 [US1] Add semantic HTML structure (main, section, article) with accessible markup in apps/site-shell/app/blog/page.tsx
- [ ] T011 [US1] Add page heading and aria-label for blog posts section in apps/site-shell/app/blog/page.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional - `/blog` displays posts sorted newest-first with title, formatted date, and summary

---

## Phase 4: User Story 2 - Jump Into a Post (Priority: P2)

**Goal**: Enable navigation from listing to canonical post URL

**Independent Test**: From `/blog`, click each listing and verify the browser navigates to the canonical slug-generated URL without 404s or duplicate URLs.

### Implementation for User Story 2

- [ ] T012 [US2] Wrap BlogPostCard content in Next.js Link component to post.url in apps/site-shell/components/blog/BlogPostCard.tsx
- [ ] T013 [US2] Ensure entire card is keyboard-focusable with single interactive target in apps/site-shell/components/blog/BlogPostCard.tsx
- [ ] T014 [US2] Verify post URLs use /posts/{slug} pattern matching existing routes in apps/site-shell/app/blog/page.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - visitors can scan posts and click to navigate

---

## Phase 5: User Story 3 - Content Team Confidence (Priority: P3)

**Goal**: Ensure new MDX files automatically appear on `/blog` without manual configuration

**Independent Test**: Add a new MDX file with frontmatter metadata, rebuild, and confirm the listing shows it in the right order with accurate metadata.

### Implementation for User Story 3

- [ ] T015 [US3] Verify getAllPostsForIndex dynamically reads from content/posts/ directory in apps/site-shell/lib/mdx/loader.ts
- [ ] T016 [US3] Implement title fallback to "Untitled Post" when frontmatter.title missing in apps/site-shell/lib/mdx/loader.ts
- [ ] T017 [US3] Implement alphabetical secondary sort (A→Z) for same-date posts in apps/site-shell/lib/mdx/loader.ts
- [ ] T018 [US3] Add build-time console warning for posts with missing optional metadata in apps/site-shell/lib/mdx/loader.ts

**Checkpoint**: All user stories should now be independently functional - new posts auto-surface correctly

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T019 [P] Implement future-date filtering to hide scheduled posts in apps/site-shell/lib/mdx/loader.ts
- [ ] T020 [P] Add empty state display "No posts yet. Check back soon!" in apps/site-shell/app/blog/page.tsx
- [ ] T021 Verify page load performance meets <1 second target via manual testing
- [ ] T022 Run quickstart.md validation scenarios manually

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can proceed sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Can integrate with any completed user story

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after US1 (builds on BlogPostCard component)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Tests auto-surfacing behavior

### Within Each User Story

- Core implementation before integration
- Components before page assembly
- Story complete before moving to next priority

### Parallel Opportunities

- T001 and T002 can run in parallel (different files)
- T019 and T020 can run in parallel (different files)
- US3 tasks (T015-T018) are in same file, must be sequential

---

## Parallel Example: Phase 1 Setup

```bash
# Launch both setup tasks together:
Task: "Add BlogIndexEntry and BlogIndexOptions types to apps/site-shell/lib/mdx/types.ts"
Task: "Create blog components directory structure at apps/site-shell/components/blog/"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test `/blog` displays posts sorted newest-first
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (clickable posts)
4. Add User Story 3 → Test independently → Deploy/Demo (auto-surfacing)
5. Each story adds value without breaking previous stories

### Key Files Modified

| File | Changes |
|------|---------|
| `apps/site-shell/lib/mdx/types.ts` | Add BlogIndexEntry, BlogIndexOptions types |
| `apps/site-shell/lib/mdx/loader.ts` | Add generateExcerpt, transformToBlogIndexEntry, getAllPostsForIndex |
| `apps/site-shell/components/blog/BlogPostCard.tsx` | NEW - Post listing card component |
| `apps/site-shell/components/blog/EmptyState.tsx` | NEW - Empty state component |
| `apps/site-shell/app/blog/page.tsx` | UPDATE - Use new loader, render post list |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- No new dependencies required - uses existing next-mdx-remote, gray-matter, zod
