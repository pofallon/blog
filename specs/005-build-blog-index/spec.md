# Feature Specification: Minimal Blog Index

**Feature Branch**: `005-build-blog-index`  
**Created**: 2025-12-15  
**Status**: Draft  
**Input**: User description: "Build the /blog index page that lists blog posts newest-first using metadata parsed from MDX frontmatter. Each entry must link to the correct post URL based on the preserved slug rules. Keep the UI minimal and focus on correct data flow and routing."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Scan Latest Posts (Priority: P1)

As a site visitor, I want the `/blog` page to immediately show the most recent posts with clear metadata so I can find something fresh to read without digging through older content.

**Why this priority**: The index page is the discovery entry point; if it fails, the blog appears empty or outdated, hurting traffic and trust.

**Independent Test**: Load `/blog` with at least three posts having distinct dates and confirm the list renders, is sorted newest-first, and exposes required metadata (title, human-readable date, short summary).

**Acceptance Scenarios**:

1. **Given** at least one published MDX post with title, date, and description in frontmatter, **When** a visitor opens `/blog`, **Then** the page lists that post with its title, formatted date, and description snippet.
2. **Given** multiple posts with different frontmatter dates, **When** `/blog` loads, **Then** entries appear sorted descending by date regardless of file creation order.

---

### User Story 2 - Jump Into a Post (Priority: P2)

As a reader who finds an interesting teaser, I want to click anywhere on that listing to open the full post at its canonical slug-generated URL so deep links remain consistent.

**Why this priority**: Accurate routing and slug preservation protect SEO equity and user bookmarks.

**Independent Test**: From `/blog`, click each listing and verify the browser navigates to the canonical slug generated from the post’s file path rules without 404s or duplicate URLs.

**Acceptance Scenarios**:

1. **Given** a post whose slug is generated from its file path (e.g., `/blog/playlist-reinvent-2019/`), **When** I click the listing entry, **Then** I land on that exact slug and the detail page renders.
2. **Given** previously shared links that rely on legacy slug rules, **When** the index is rebuilt, **Then** those slugs are unchanged and still routable from the listing.

---

### User Story 3 - Content Team Confidence (Priority: P3)

As a content editor adding new MDX files, I want new posts to surface automatically on `/blog` with correct metadata so I do not have to edit multiple files to publish.

**Why this priority**: Eliminates manual sync errors and ensures new content is discoverable as soon as it is merged.

**Independent Test**: Add a new MDX file with frontmatter metadata, rebuild, and confirm the listing shows it in the right order with accurate metadata without extra configuration.

**Acceptance Scenarios**:

1. **Given** a newly added MDX file committed to the repository, **When** the site rebuilds, **Then** the `/blog` list includes it without editing the index by hand.
2. **Given** posts sharing the same publish date, **When** the page renders, **Then** alphabetical ordering by title (A→Z) keeps the list stable between builds.

---

### Edge Cases

- Empty state when no MDX posts qualify displays static text: "No posts yet. Check back soon!" instead of a spinner or blank page.
- Posts missing optional metadata (e.g., description) should fall back to an auto-generated excerpt from the first ~160 characters of post body without breaking layout.
- Future-dated posts should be excluded entirely from the index until their publish date is reached (posts hidden until date arrives).
- Slug mismatch between a frontmatter override and the canonical slug derived from file paths should fail a build-time check before deployment.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The `/blog` route MUST display a reverse-chronological list of MDX blog posts using `frontmatter.date` to determine order, with alphabetical sorting by title (A→Z) as a deterministic tiebreaker when multiple posts share the same date.
- **FR-002**: Each list item MUST render the post title, a human-friendly date (e.g., “May 2, 2020”), and a short summary sourced from `frontmatter.description` or, if absent, the first ~160 characters of body content.
- **FR-003**: Each list item MUST be wrapped in a single interactive target that routes to the post’s canonical slug defined by the current slug-generation rules, ensuring legacy URLs remain unchanged.
- **FR-004**: Data fetching MUST rely on the centralized MDX content source that already powers individual post pages so that adding or editing MDX files automatically updates the index without hand-maintaining content arrays.
- **FR-005**: The index MUST guard against missing or malformed frontmatter by providing sensible fallbacks (e.g., “Untitled Post”, default date label) and logging any missing required metadata during build.
- **FR-006**: The page MUST load with a lightweight, accessible layout (semantic list or section headings, keyboard-focusable links) to satisfy the “minimal UI” constraint while keeping the emphasis on content.
- **FR-007**: The implementation MUST keep routing consistent with existing slug preservation rules by avoiding manual string concatenation or overrides that could change legacy URLs.

### Key Entities *(include if feature involves data)*

- **BlogPost**: Represents a single MDX node with frontmatter fields (`title`, `date`, `description`, optional `image`) and its canonical slug. Serves as the source of truth for metadata presented on the index.
- **BlogIndexEntry**: View-model combining the BlogPost metadata plus derived display properties (formatted date string, truncated summary, link target) used by the UI layer.

## Clarifications

### Session 2025-12-16

- Q: How should future-dated posts be handled on the /blog index? → A: Exclude future-dated posts entirely (hidden until date is reached)
- Q: What deterministic secondary sort should be used when posts share the same publish date? → A: Alphabetical by title (A→Z)
- Q: What message should display when no posts are available (empty state)? → A: Static text: "No posts yet. Check back soon!"
- Q: What should the fallback summary strategy be when `frontmatter.description` is absent? → A: Auto-excerpt from first ~160 characters of post body
- Q: How should slug mismatches between frontmatter override and canonical file-path slug be handled? → A: Hard failure: block deployment until resolved

## Assumptions

- All blog content lives in MDX (or MD with MDX processing) under the existing content directories and already has canonical slugs generated from their directory structure.
- Frontmatter dates are ISO-formatted and represent publish intent; future-dated posts are excluded from the index until their date is reached (build-time filtering).
- There is no pagination requirement for the first iteration; showing the entire list is acceptable until volume necessitates pagination or filtering.
- Images referenced in frontmatter are optional for the index and can be introduced later without blocking this work.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of existing MDX posts appear on `/blog` with correct titles and dates after the first build (verified via automated snapshot or content audit).
- **SC-002**: Clicking any listing entry navigates to its detail page in under 1 second on a cold load for 95% of attempts (measured in staging).
- **SC-003**: Content editors report zero manual steps outside committing an MDX file to surface new posts, confirmed across two consecutive releases.
- **SC-004**: No 404 errors or slug regressions are detected in link-check scans run against `/blog` and linked detail pages before release.
