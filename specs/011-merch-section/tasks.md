# Tasks: Merch Section Scaffold

**Input**: Design documents from `/specs/011-merch-section/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: No tests explicitly requested in specification. Test tasks not included.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Project type**: Monorepo with `apps/site-shell/`
- **Components**: `apps/site-shell/components/merch/`
- **Library**: `apps/site-shell/lib/merch/`
- **Routes**: `apps/site-shell/app/merch/`
- **Content**: `content/merch/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create directory structure for `apps/site-shell/components/merch/`
- [X] T002 [P] Create directory structure for `apps/site-shell/lib/merch/`
- [X] T003 [P] Create directory structure for `apps/site-shell/app/merch/[slug]/`
- [X] T004 [P] Create directory structure for `content/merch/`
- [X] T005 [P] Create directory structure for `public/images/merch/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Create Zod schema with ProductStatus, ProductImage, Product, and ProductCatalog in `apps/site-shell/lib/merch/schema.ts`
- [X] T007 Create TypeScript types exported from Zod inference in `apps/site-shell/lib/merch/types.ts`
- [X] T008 [P] Copy JSON Schema to `content/merch/products.schema.json`
- [X] T009 Create product loader with validation (loadProductCatalog, loadProductBySlug) in `apps/site-shell/lib/merch/loader.ts`
- [X] T010 Create analytics event helpers (merch_index_view, merch_product_view) in `apps/site-shell/lib/merch/analytics.ts`
- [X] T011 Create placeholder product data with 4 products (varied statuses) in `content/merch/products.json`
- [X] T012 [P] Add placeholder hero images to `public/images/merch/` (4 product images)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Discover curated merch list (Priority: P1) 🎯 MVP

**Goal**: Visitors can open `/merch` to scan a merch collection with product name, short description, hero image, price display text, and availability badge.

**Independent Test**: Navigate to `/merch` and confirm the catalog renders at least four placeholder products with accurate schema-driven fields.

### Implementation for User Story 1

- [X] T013 [P] [US1] Create StatusBadge component with status-to-style mapping in `apps/site-shell/components/merch/StatusBadge.tsx`
- [X] T014 [P] [US1] Create ProductCard component with hero image, name, price, badge in `apps/site-shell/components/merch/ProductCard.tsx`
- [X] T015 [P] [US1] Create MerchEmptyState component with friendly messaging in `apps/site-shell/components/merch/MerchEmptyState.tsx`
- [X] T016 [P] [US1] Create CommerceInfoBlock component (index variant) in `apps/site-shell/components/merch/CommerceInfoBlock.tsx`
- [X] T017 [US1] Create merch index page with hero, product grid, commerce info in `apps/site-shell/app/merch/page.tsx`
- [X] T018 [US1] Add merch_index_view analytics event to index page in `apps/site-shell/app/merch/page.tsx`
- [X] T019 [US1] Add "Merch" navigation link in site navigation config

**Checkpoint**: User Story 1 complete - `/merch` index page fully functional and testable

---

## Phase 4: User Story 2 - Evaluate a specific product (Priority: P2)

**Goal**: Visitors can click any product tile to open `/merch/[product]`, review long description, swipe through images, view status-specific messaging and CTA.

**Independent Test**: From any product tile, follow the generated slug to `/merch/[product]` and verify all schema fields display including image gallery and status-dependent CTAs.

### Implementation for User Story 2

- [X] T020 [P] [US2] Create ProductGallery component with hero and lazy-loaded thumbnails in `apps/site-shell/components/merch/ProductGallery.tsx`
- [X] T021 [P] [US2] Create StatusCTA component with status-based actions in `apps/site-shell/components/merch/StatusCTA.tsx`
- [X] T022 [US2] Create product detail page with breadcrumb, gallery, details, CTA in `apps/site-shell/app/merch/[slug]/page.tsx`
- [X] T023 [US2] Implement generateStaticParams for SSG in `apps/site-shell/app/merch/[slug]/page.tsx`
- [X] T024 [US2] Add merch_product_view analytics event to detail page in `apps/site-shell/app/merch/[slug]/page.tsx`
- [X] T025 [US2] Add 404 handling for invalid slugs in `apps/site-shell/app/merch/[slug]/page.tsx`

**Checkpoint**: User Story 2 complete - `/merch/[slug]` detail pages fully functional

---

## Phase 5: User Story 3 - Update placeholder catalog content (Priority: P3)

**Goal**: Marketing can edit `products.json` to add, remove, or reorder products and see changes reflected on rebuild without developer intervention.

**Independent Test**: Modify one product entry in the placeholder data file, rebuild the site, and confirm the updated copy, price display, and status render correctly.

### Implementation for User Story 3

- [X] T026 [US3] Add build-time validation script for products.json in `apps/site-shell/scripts/validate-merch.ts`. MUST test: missing required fields, invalid status enum (e.g., "Unavailable"), malformed JSON structure, duplicate slugs
- [X] T027 [US3] Add validate:merch npm script to package.json prebuild hook
- [X] T028 [US3] Add clear validation error messaging with field-level details in `apps/site-shell/scripts/validate-merch.ts`
- [X] T029 [US3] Document schema editing workflow in `specs/011-merch-section/quickstart.md` (verify complete)

**Checkpoint**: User Story 3 complete - content managers can safely edit products.json

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T030 [P] Verify WCAG 2.1 AA compliance: keyboard navigation on all merch components
- [X] T031 [P] Verify Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1 on merch pages
- [X] T032 [P] Add aria-labels and role attributes per component contracts
- [X] T033 Run quickstart.md validation scenarios manually
- [X] T034 Code cleanup and remove any console.log debugging statements

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can proceed sequentially in priority order (P1 → P2 → P3)
  - US1 and US2 share components; US3 is independent
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational - Uses StatusBadge and CommerceInfoBlock from US1, but can develop in parallel if interfaces are stable
- **User Story 3 (P3)**: Can start after Foundational - Fully independent, validation script only

### Within Each User Story

- Components before pages (ProductCard before index page)
- Core layout before enhancements (page structure before analytics)
- Commit after each task or logical group

### Parallel Opportunities

**Phase 1 (Setup)**:
- T002, T003, T004, T005 can all run in parallel

**Phase 2 (Foundational)**:
- T008 and T012 can run in parallel with T006-T007

**Phase 3 (US1)**:
- T013, T014, T015, T016 can all run in parallel (different component files)

**Phase 4 (US2)**:
- T020 and T021 can run in parallel (different component files)

**Phase 6 (Polish)**:
- T030, T031, T032 can all run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all components for User Story 1 together:
Task T013: "Create StatusBadge component in apps/site-shell/components/merch/StatusBadge.tsx"
Task T014: "Create ProductCard component in apps/site-shell/components/merch/ProductCard.tsx"
Task T015: "Create MerchEmptyState component in apps/site-shell/components/merch/MerchEmptyState.tsx"
Task T016: "Create CommerceInfoBlock component in apps/site-shell/components/merch/CommerceInfoBlock.tsx"

# Then sequentially:
Task T017: "Create merch index page" (depends on T013-T016)
Task T018: "Add analytics event" (depends on T017)
Task T019: "Add navigation link" (depends on T017)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test `/merch` index page independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test `/merch` → Deploy/Demo (MVP!)
3. Add User Story 2 → Test `/merch/[slug]` → Deploy/Demo
4. Add User Story 3 → Test validation workflow → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (index page)
   - Developer B: User Story 2 components (ProductGallery, StatusCTA)
3. Merge and integrate detail page when US1 complete

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Zod 3.x used for schema validation (check package.json for exact version)
- Hero images eager-load, gallery images lazy-load (per NFR-003)
- All components must meet WCAG 2.1 AA (per NFR-001)
