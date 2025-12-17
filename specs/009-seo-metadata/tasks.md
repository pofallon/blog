# Tasks: SEO Metadata Framework

**Input**: Design documents from `/specs/009-seo-metadata/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: NOT requested - no test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Project type**: Web application (monorepo with Next.js app at `apps/site-shell/`)
- **Source**: `apps/site-shell/`
- **Content**: `content/blog/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and SEO module scaffolding

- [X] T001 Create SEO module directory structure at `apps/site-shell/lib/seo/`
- [X] T002 [P] Create types file with GlobalSEOConfig, PageMetadataOverride, ShareImageMeta, and validation types in `apps/site-shell/lib/seo/types.ts`
- [X] T003 [P] Create public exports barrel file in `apps/site-shell/lib/seo/index.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Implement GlobalSEOConfig constant with environment variable integration in `apps/site-shell/lib/seo/config.ts`
- [X] T005 Implement getGlobalSEOConfig() function in `apps/site-shell/lib/seo/config.ts`
- [X] T006 [P] Implement buildCanonicalUrl() function in `apps/site-shell/lib/seo/url-builder.ts`
- [X] T007 [P] Implement resolveShareImageUrl() function in `apps/site-shell/lib/seo/url-builder.ts`
- [X] T008 Update lib/seo/index.ts exports to include config and url-builder functions

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Blog Post Social-Ready Metadata (Priority: P1) 🎯 MVP

**Goal**: Every published blog post carries accurate OpenGraph/Twitter information derived from frontmatter so social shares display correctly.

**Independent Test**: Publish a single blog post with complete frontmatter, build the site, and inspect the rendered HTML head to confirm OG/Twitter tags mirror the post content.

### Implementation for User Story 1

- [X] T009 [US1] Implement buildBlogPostMetadata() function mapping frontmatter to OG/Twitter tags in `apps/site-shell/lib/seo/metadata.ts`
- [X] T010 [US1] Add hero image fallback logic to buildBlogPostMetadata() when hero is missing in `apps/site-shell/lib/seo/metadata.ts`
- [X] T011 [US1] Update generateMetadata() in `apps/site-shell/app/blog/[slug]/page.tsx` to use buildBlogPostMetadata()
- [X] T012 [US1] Update lib/seo/index.ts exports to include metadata.ts functions
- [X] T013 [US1] Verify blog post renders with og:title, og:description, og:image, og:url, og:type=article tags
- [X] T014 [US1] Verify blog post renders with twitter:card, twitter:title, twitter:description, twitter:image tags

**Checkpoint**: User Story 1 complete - blog posts have social-ready metadata independently testable

---

## Phase 4: User Story 2 - Global Defaults for Marketing (Priority: P2)

**Goal**: Marketing manager can update global metadata config once and have all non-blog pages inherit brand-approved metadata without touching code in multiple places.

**Independent Test**: Update the global metadata config, rebuild the site, and verify that a static page reflects the new default title suffix and description.

### Implementation for User Story 2

- [X] T015 [US2] Implement buildPageMetadata() function merging globals with overrides in `apps/site-shell/lib/seo/metadata.ts`
- [X] T016 [US2] Update root layout metadata to use getGlobalSEOConfig() in `apps/site-shell/app/layout.tsx`
- [X] T017 [US2] Add Twitter card tags to root layout metadata in `apps/site-shell/app/layout.tsx`
- [X] T018 [US2] Update blog index page metadata to use buildPageMetadata() in `apps/site-shell/app/blog/page.tsx`
- [X] T019 [US2] Verify static pages inherit global defaults including description and share image

**Checkpoint**: User Story 2 complete - global metadata defaults propagate to all pages

---

## Phase 5: User Story 3 - Custom Page SEO Overrides (Priority: P3)

**Goal**: Developers can override specific metadata fields on custom pages while inheriting the rest automatically.

**Independent Test**: Create a new page component that supplies overrides for title and description, leave other fields blank, and confirm the rendered head mixes override values with defaults.

### Implementation for User Story 3

- [X] T020 [US3] Add support for noIndex option in buildPageMetadata() in `apps/site-shell/lib/seo/metadata.ts`
- [X] T021 [US3] Add support for canonicalPath override in buildPageMetadata() in `apps/site-shell/lib/seo/metadata.ts`
- [X] T022 [US3] Add support for custom shareImage override in buildPageMetadata() in `apps/site-shell/lib/seo/metadata.ts`
- [X] T023 [US3] Verify override mechanism: title/description overrides merge with inherited defaults
- [X] T024 [US3] Verify canonical URL reflects route path automatically when not explicitly overridden

**Checkpoint**: User Story 3 complete - page-level overrides work seamlessly with global defaults

---

## Phase 6: Build Validation (FR-007, FR-008)

**Purpose**: Build-time validation to catch SEO issues before deployment

- [X] T025 Implement validateShareImageUrl() with origin check and HTTP HEAD in `apps/site-shell/lib/seo/image-validator.ts`
- [X] T026 Implement validateAllShareImages() with 10-concurrent validation limit in `apps/site-shell/lib/seo/image-validator.ts`
- [X] T027 Create SEO validation script in `apps/site-shell/scripts/validate-seo.ts`
- [X] T028 Add validate:seo npm script to `apps/site-shell/package.json`
- [X] T029 Update lib/seo/index.ts exports to include image-validator functions
- [X] T030 Verify validation script logs warnings for missing description or hero image
- [X] T031 Verify validation script fails build on invalid image origin or unreachable URL

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Documentation and final refinements

- [X] T032 [P] Extend SiteMetadata type with SEO fields if needed in `apps/site-shell/lib/types.ts`
- [X] T033 [P] Extend BlogPostFrontmatter with explicit SEO field documentation in `apps/site-shell/lib/mdx/blog-post-types.ts`
- [X] T034 Run quickstart.md validation (manual verification of documented workflows)
- [X] T035 Verify all metadata renders without browser globals (server-side only)
- [X] T036 [FR-009] Verify locale field from GlobalSEOConfig propagates to all generated OG/Twitter metadata output

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Build Validation (Phase 6)**: Can start after Phase 2, runs parallel to user stories
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Builds on US2 patterns but independently testable

### Within Each User Story

- Core implementation before integration with existing pages
- Verify rendered output after integration

### Parallel Opportunities

- Phase 1: T002, T003 can run in parallel
- Phase 2: T006, T007 can run in parallel (after T004, T005)
- Phase 3-5: All user stories can run in parallel after Phase 2
- Phase 6: Can run in parallel with user stories
- Phase 7: T032, T033 can run in parallel

---

## Parallel Example: Phase 2 (Foundational)

```bash
# Sequential (config must exist first):
Task T004: "Implement GlobalSEOConfig constant in lib/seo/config.ts"
Task T005: "Implement getGlobalSEOConfig() function in lib/seo/config.ts"

# Then parallel (different files):
Task T006: "Implement buildCanonicalUrl() in lib/seo/url-builder.ts"
Task T007: "Implement resolveShareImageUrl() in lib/seo/url-builder.ts"
```

---

## Parallel Example: User Stories

```bash
# After Phase 2 completes, all user stories can start in parallel:

# Developer A: User Story 1 (Blog Post Metadata)
Task T009-T014

# Developer B: User Story 2 (Global Defaults)
Task T015-T019

# Developer C: User Story 3 (Page Overrides)
Task T020-T024
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (3 tasks)
2. Complete Phase 2: Foundational (5 tasks)
3. Complete Phase 3: User Story 1 (6 tasks)
4. **STOP and VALIDATE**: Test blog post metadata independently
5. Deploy/demo if ready - blog posts will have proper social previews

### Incremental Delivery

1. Setup + Foundational → Foundation ready (8 tasks)
2. Add User Story 1 → Test independently → Deploy (MVP: social-ready blog posts)
3. Add User Story 2 → Test independently → Deploy (global defaults for all pages)
4. Add User Story 3 → Test independently → Deploy (custom page overrides)
5. Add Build Validation → Catch issues in CI
6. Polish → Final refinements and documentation

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (blog post metadata)
   - Developer B: User Story 2 (global defaults)
   - Developer C: User Story 3 (page overrides) OR Build Validation
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- FR references map to functional requirements in spec.md
