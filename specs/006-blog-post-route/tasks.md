# Tasks: Blog Post Page Route

**Input**: Design documents from `/specs/006-blog-post-route/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓, quickstart.md ✓

**Tests**: No tests explicitly requested in the specification. Tests are NOT included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependencies, and basic directory structure

- [x] T001 Install next-mdx-remote and gray-matter dependencies via `npm install next-mdx-remote gray-matter`
- [x] T002 Create directory structure `src/app/blog/[slug]/`
- [x] T003 [P] Create directory structure `src/components/blog-post/`
- [x] T004 [P] Create directory structure `src/lib/mdx/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types and utility infrastructure that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create type definitions in src/lib/mdx/types.ts (BlogPostDocument, BlogPostFrontmatter, BlogPostPageModel, BlogPostParams, ProcessedImage)
- [x] T006 Implement getPostBySlug() function in src/lib/mdx/loader.ts (loads MDX file, parses frontmatter, returns BlogPostDocument or null)
- [x] T007 Implement getAllPostSlugs() function in src/lib/mdx/loader.ts (enumerates content/blog directories for generateStaticParams)
- [x] T008 Implement transformToPageModel() function in src/lib/mdx/loader.ts (converts BlogPostDocument to BlogPostPageModel with date formatting, MDX compilation, canonicalUrl)
- [x] T009 [P] Create MDX component mappings in src/lib/mdx/components.tsx (custom components for quotes, embeds, images with loading="lazy")

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Read Full Post Context (Priority: P1) 🎯 MVP

**Goal**: Render `/blog/[slug]` with title, formatted date, description, and MDX body

**Independent Test**: Open a known slug from the blog index and verify the title, human-readable date, description, and MDX body render above the fold without relying on any other route

### Implementation for User Story 1

- [x] T010 [P] [US1] Create BlogPostHeader component in src/components/blog-post/BlogPostHeader.tsx (displays title, formatted date, description, optional hero image)
- [x] T011 [P] [US1] Create BlogPostBody component in src/components/blog-post/BlogPostBody.tsx (renders MDX content with component mappings using next-mdx-remote)
- [x] T012 [P] [US1] Create BlogPostNav component in src/components/blog-post/BlogPostNav.tsx (back link to /blog)
- [x] T013 [US1] Implement dynamic route page in src/app/blog/[slug]/page.tsx (async component with getPostBySlug, transformToPageModel, renders Header/Body/Nav)
- [x] T014 [US1] Implement generateStaticParams() in src/app/blog/[slug]/page.tsx (uses getAllPostSlugs for SSG pre-rendering)
- [x] T015 [US1] Add fallback handling for missing metadata in src/lib/mdx/loader.ts (console.warn for missing title/date, use "Untitled Post"/"Unknown Date" defaults per FR-006)
- [x] T016 [US1] Apply Tailwind prose classes for typography in src/app/blog/[slug]/page.tsx and components

**Checkpoint**: User Story 1 complete - blog posts render with full content at /blog/[slug]

---

## Phase 4: User Story 2 - Trust Shared Permalinks (Priority: P2)

**Goal**: Expose canonical SEO metadata so search engines and social crawlers receive accurate previews

**Independent Test**: Paste a canonical slug into a fresh browser session (or curl request) and confirm the response status is 200, the canonical slug in the page matches the requested slug, and metadata exposes the same title/description as the index card

### Implementation for User Story 2

- [x] T017 [US2] Implement generateMetadata() function in src/app/blog/[slug]/page.tsx (returns title, description, canonical URL from frontmatter)
- [x] T018 [US2] Add OpenGraph metadata in generateMetadata() (og:title, og:description, og:type=article, og:url, og:image if hero exists)
- [x] T019 [US2] Add Twitter card metadata in generateMetadata() (twitter:card, twitter:title, twitter:description)
- [x] T020 [US2] Implement URL normalization middleware in src/middleware.ts (301 redirect uppercase→lowercase and trailing slash removal per edge case spec)
- [x] T021 [US2] Configure middleware matcher for /blog/:path* routes in src/middleware.ts

**Checkpoint**: User Story 2 complete - SEO metadata accurate, non-canonical URLs redirect to canonical

---

## Phase 5: User Story 3 - Handle Missing Content Gracefully (Priority: P3)

**Goal**: Show clear 404 state with navigation back to /blog when slug doesn't exist

**Independent Test**: Request a slug that does not exist and confirm the route returns the site-wide 404 experience plus a link back to the blog index

### Implementation for User Story 3

- [x] T022 [US3] Create not-found page in src/app/blog/[slug]/not-found.tsx (404 UI with "Post Not Found" message and Link back to /blog)
- [x] T023 [US3] Add notFound() call in src/app/blog/[slug]/page.tsx (trigger 404 when getPostBySlug returns null)
- [x] T024 [US3] Ensure 404 response returns proper HTTP status < 500ms (verify notFound() from next/navigation returns 404 status; measure response time with curl or Lighthouse)
- [x] T025 [US3] Style not-found page with Tailwind classes matching site design in src/app/blog/[slug]/not-found.tsx

**Checkpoint**: User Story 3 complete - invalid slugs show friendly 404 with navigation to /blog

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, performance, and final validation

- [x] T026a [P] Implement proper heading hierarchy in BlogPostHeader.tsx (single h1 for title, h2+ for content sections)
- [x] T026b [P] Add aria-label to BlogPostNav back link and ensure focus ring visibility in src/components/blog-post/BlogPostNav.tsx
- [x] T026c [P] Verify WCAG 2.1 AA compliance using Lighthouse accessibility audit on sample blog post
- [x] T027 [P] Add loading="lazy" to images and iframes in MDX component mappings (src/lib/mdx/components.tsx) per edge case spec
- [x] T028 [P] Verify LCP < 1.5s goal by testing with Lighthouse on sample blog post
- [x] T029 Run quickstart.md validation: build, test valid slug, test 404, test redirect

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (T001-T004) - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (T005-T009) completion
- **User Story 2 (Phase 4)**: Depends on Foundational (T005-T009) completion; builds on page from US1
- **User Story 3 (Phase 5)**: Depends on Foundational (T005-T009) completion; extends page from US1
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational - Adds metadata to page created in US1
- **User Story 3 (P3)**: Can start after Foundational - Adds 404 handling to page created in US1

### Within Each User Story

- Models/types before loader functions
- Loader functions before components
- Components before page integration
- Core implementation before polish

### Parallel Opportunities

- T002, T003, T004 (directory creation) can run in parallel
- T005, T009 (types and components) can run in parallel after dependencies installed
- T010, T011, T012 (blog-post components) can run in parallel
- T017, T018, T019 (metadata tasks within US2) are sequential but on same file
- T026, T027, T028 (polish tasks) can run in parallel

---

## Parallel Example: Phase 2 & Phase 3 Components

```bash
# Launch directory creation in parallel:
Task T002: Create directory structure src/app/blog/[slug]/
Task T003: Create directory structure src/components/blog-post/
Task T004: Create directory structure src/lib/mdx/

# Launch all blog-post components in parallel (after T005 types complete):
Task T010: Create BlogPostHeader component in src/components/blog-post/BlogPostHeader.tsx
Task T011: Create BlogPostBody component in src/components/blog-post/BlogPostBody.tsx
Task T012: Create BlogPostNav component in src/components/blog-post/BlogPostNav.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T009)
3. Complete Phase 3: User Story 1 (T010-T016)
4. **STOP and VALIDATE**: Blog posts render at /blog/[slug]
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Test: posts render → Deploy (MVP!)
3. Add User Story 2 → Test: SEO metadata correct → Deploy
4. Add User Story 3 → Test: 404 handling works → Deploy
5. Each story adds value without breaking previous stories

### Recommended Sequence for Solo Developer

```
T001 → T002/T003/T004 → T005 → T006 → T007 → T008 → T009
     ↓
T010/T011/T012 → T013 → T014 → T015 → T016 (US1 MVP Complete)
     ↓
T017 → T018 → T019 → T020 → T021 (US2 Complete)
     ↓
T022 → T023 → T024 → T025 (US3 Complete)
     ↓
T026/T027/T028 → T029 (Polish Complete)
```

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Dependencies on 004-preserve-slugs: normalizeForSlug() used in middleware (T020)
- Dependencies on 005-build-blog-index: BlogIndexEntry compatible with BlogPostPageModel fields
