# Feature Specification: Blog Post Page Route

**Feature Branch**: `006-blog-post-route`  
**Created**: 2025-12-15  
**Status**: Draft  
**Input**: User description: "Implement the blog post page route (/blog/[slug]) that renders the MDX body and associated metadata (title, date, description). Include correct not-found handling for unknown slugs. Styling may be minimal; functional rendering is the primary goal. USE 006 AS THE SPEC ID -- DO NOT AUTO-INCREMENT!"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read Full Post Context (Priority: P1)

As a site visitor who clicks a blog teaser, I want `/blog/[slug]` to load the full article with its title, publish date, and short description so I have the right context before reading the MDX body.

**Why this priority**: If the canonical post page does not render correctly, all inbound traffic from the index, social links, and search will appear broken, eliminating the blog’s core value.

**Independent Test**: Open a known slug from the blog index and verify the title, human-readable date, description, and MDX body render above the fold without relying on any other route.

**Acceptance Scenarios**:

1. **Given** an MDX post with complete frontmatter, **When** a user loads `/blog/<slug>`, **Then** the page displays the title, formatted publish date, description, and the entire MDX-rendered body in that order.
2. **Given** MDX content that uses custom components (quotes, embeds, etc.), **When** the page renders, **Then** those components appear using the site’s shared MDX component mappings without breaking layout or readability.

---

### User Story 2 - Trust Shared Permalinks (Priority: P2)

As a reader who arrives from an external link or saved bookmark, I need the slug I use to resolve to the exact canonical article with consistent metadata so I can trust and share the permalink.

**Why this priority**: Organic traffic, SEO, and social sharing rely on durable URLs; any inconsistency erodes trust and hurts discoverability.

**Independent Test**: Paste a canonical slug into a fresh browser session (or curl request) and confirm the response status is 200, the canonical slug in the page matches the requested slug, and metadata exposes the same title/description as the index card.

**Acceptance Scenarios**:

1. **Given** a slug generated from the existing slug-preservation rules, **When** a user or bot requests `/blog/<slug>`, **Then** the response body and metadata reflect that exact slug with no redirects or duplicates.
2. **Given** a request from a social preview crawler, **When** it fetches `/blog/<slug>`, **Then** the HTML head exposes the post title and description so previews stay accurate.

---

### User Story 3 - Handle Missing Content Gracefully (Priority: P3)

As a visitor who follows an outdated or mistyped slug, I want to see a clear not-found state with a path back to `/blog` so I am not left in a dead end.

**Why this priority**: Friendly 404s reduce frustration, protect brand perception, and help reclaim traffic from stale links by pointing readers to live content.

**Independent Test**: Request a slug that does not exist and confirm the route returns the site-wide 404 experience (or equivalent) plus a link back to the blog index.

**Acceptance Scenarios**:

1. **Given** `/blog/<slug>` does not map to any MDX file, **When** the route resolves, **Then** the system renders the standard not-found page and provides navigation back to `/blog` within the 404 content.

---

### Edge Cases

- Slugs that differ only by case or trailing slashes must normalize to a single canonical slug so duplicate content is not exposed.
- Posts missing optional metadata (e.g., description) must still render with sensible fallbacks without crashing the page or omitting the body.
- Requests served during static generation and on-demand rendering must both honor the same not-found contract to prevent inconsistent behavior between build-time and runtime.
- Very long MDX bodies with multiple embeds must stream or paginate gracefully so the page does not block rendering or exceed reasonable load times.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The `/blog/[slug]` route MUST resolve each request to a single MDX post using the existing slug-preservation rules, rejecting duplicate or ambiguous slugs before rendering.
- **FR-002**: For every valid slug, the page MUST surface the post’s title, formatted publish date, and description in a consistent header region before the MDX body.
- **FR-003**: The route MUST render the complete MDX body with the shared component mappings so any shortcodes, embeds, or custom callouts behave as intended without extra per-post configuration.
- **FR-004**: If the slug cannot be matched to content, the route MUST return the platform’s standard not-found response (status + page copy) and include guidance back to `/blog`.
- **FR-005**: The response MUST expose canonical SEO metadata (title, description, canonical url) sourced from the post’s frontmatter so that search engines and social crawlers receive accurate previews.
- **FR-006**: When required metadata is missing or malformed, the system MUST log or surface a build warning, fall back to safe display values (e.g., “Untitled Post”, “Unknown Date”), and continue rendering the body instead of failing silently.
- **FR-007**: The page MUST provide at least one visible navigation path (e.g., breadcrumb or button) back to the `/blog` index to keep readers moving through content.

### Key Entities *(include if feature involves data)*

- **BlogPostDocument**: Source content object containing the canonical slug, MDX body, and frontmatter fields (`title`, `date`, `description`, optional media). Serves as the single source of truth for the route.
- **BlogPostPageModel**: View-ready structure that augments the document with formatted date strings, sanitized description snippets, canonical URL, and any navigation links needed by the page template.

## Assumptions

- All published blog posts live in MDX files that already participate in the slug-preservation pipeline delivered by prior specs.
- Every MDX file includes `title`, `date`, and `description` frontmatter; when a field is missing, editorial teams agree the application may auto-generate placeholder text and report the omission during builds.
- The global 404/not-found experience already exists and can be invoked by this route without additional design work.
- Search and social bots respect the metadata exposed by this page; no extra integration work is required beyond setting correct meta tags.

## Dependencies

- Depends on **004-preserve-slugs** for canonical slug generation and legacy URL guarantees.
- Consumes the content source and indexing work from **005-build-blog-index** to ensure consistent metadata between list and detail views.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of MDX posts present in the repository respond at `/blog/<slug>` with matching metadata compared against the blog index during release certification.
- **SC-002**: 95% of first-time visits to `/blog/<slug>` render above-the-fold content (title, date, description) in under 1.5 seconds on staging measurements, ensuring the page feels instantaneous.
- **SC-003**: At least 99% of invalid slug requests return the not-found experience with a visible link to `/blog` within 500 ms, as measured by synthetic monitoring.
- **SC-004**: Link-check scans across two consecutive releases report zero mismatched or duplicate slugs between `/blog` listings and detail pages, indicating permalink stability.
