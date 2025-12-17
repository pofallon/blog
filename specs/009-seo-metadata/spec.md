# Feature Specification: SEO Metadata Framework (Spec 009)

**Feature Branch**: `009-seo-metadata`  
**Created**: 2025-12-15  
**Status**: Draft  
**Input**: User description: "Use spec ID 009. Create a feature specification for implementing SEO metadata in the Next.js site. Requirements: (1) define global default metadata applied site-wide, (2) allow per-page overrides consuming frontmatter for blog posts, (3) ensure blog posts emit OpenGraph and Twitter metadata derived from frontmatter, (4) canonical URLs and share images must work correctly during server rendering without using browser-only globals. Include scope, acceptance criteria, dependencies, risks, and any other relevant sections."

## Scope

### In Scope
- Establish a single source of truth for global SEO defaults (title, description, canonical host, default share image, locale, site name).
- Apply metadata during Next.js server rendering for every route, including static and dynamic blog pages.
- Provide a deterministic override path so page-level configs (frontmatter or config objects) can replace any default field.
- Derive OpenGraph and Twitter card tags for blog posts from required frontmatter fields (title, summary, hero image, publication data).
- Generate canonical URLs and share-image URLs as absolute links without referencing browser-only globals (e.g., `window`).

### Out of Scope
- Building new CMS authoring interfaces; authors will continue using existing Markdown/frontmatter tooling.
- Automated generation of social share artwork beyond selecting referenced assets.
- Analytics or SEO reporting dashboards (handled separately).

## Assumptions
- Every blog post already maintains frontmatter keys for `title`, `description`/`excerpt`, `slug`, `publishedDate`, and `heroImage` (or an equivalent field); missing values fall back to defaults noted here.
- A site-wide configuration file or environment values can provide canonical host, default title suffix, and fallback social image without additional infrastructure.
- Social share images are stored in the repository or CDN with publicly accessible URLs at build time.
- Share image URLs must originate from the canonical host domain or pre-approved CDN origins; external URLs are not permitted.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Blog post publishes with social-ready metadata (Priority: P1)
Content editors need every published blog post to carry accurate OpenGraph/Twitter information derived from the post they authored so that shares look correct on social platforms.

**Why this priority**: Social previews drive the majority of referral traffic, so incorrect metadata directly impacts campaign results.

**Independent Test**: Publish a single blog post with complete frontmatter, trigger a production build, and inspect the rendered HTML head to confirm OG/Twitter tags mirror the post content without relying on other site changes.

**Acceptance Scenarios**:

1. **Given** a blog post with `title`, `description`, and `heroImage` in frontmatter, **When** the page is rendered on the server, **Then** the resulting HTML contains OpenGraph meta tags whose content matches those fields.
2. **Given** the same post, **When** a Twitter card validator requests the page, **Then** the markup exposes valid `twitter:card`, `twitter:title`, `twitter:description`, and `twitter:image` tags using frontmatter values.
3. **Given** a blog post slug, **When** a canonical URL is generated, **Then** it is an absolute URL combining the configured site host and slug without referencing browser globals.

---

### User Story 2 - Marketing sets global defaults once (Priority: P2)
The marketing manager wants confidence that all non-blog pages inherit brand-approved metadata without touching code in multiple places.

**Why this priority**: Consistent metadata across static pages protects brand voice and simplifies future campaigns.

**Independent Test**: Update the global metadata config once, rebuild the site, and verify that a random static page reflects the new default title suffix and description without additional edits.

**Acceptance Scenarios**:

1. **Given** an updated global description, **When** any static marketing page without overrides is rendered, **Then** the new description value appears in the page `<meta name="description">` and equivalent OG/Twitter fallbacks.
2. **Given** a configured default share image, **When** a page omits a per-page image, **Then** the default image URL surfaces in both OpenGraph and Twitter tags.

---

### User Story 3 - Developer adds a custom page with targeted SEO (Priority: P3)
A developer building a new campaign landing page needs to override only specific metadata fields while inheriting the rest automatically.

**Why this priority**: Minimizes engineering time while ensuring campaign-specific SEO copy is accurate.

**Independent Test**: Create a new page component that supplies overrides for title and description, leave other fields blank, and confirm the rendered head mixes override values with defaults without warnings.

**Acceptance Scenarios**:

1. **Given** a new page component providing a metadata override object, **When** the page renders, **Then** the overrides replace the corresponding defaults while untouched fields still display default values.
2. **Given** the same page, **When** the canonical URL is computed, **Then** it reflects the new route path automatically without manual strings.

---

### Edge Cases
- Blog post missing `heroImage` must fall back to the default share image while logging a build-time warning (non-blocking) for authors.
- Blog post with invalid or inaccessible `heroImage` must be treated identically: log warning, substitute default share image, continue build.
- Draft or future-dated posts should not emit canonical URLs that collide with published posts; the generator must use full slug paths.
- Relative paths supplied in frontmatter (e.g., `/images/share.png`) must resolve to absolute URLs using the canonical host before insertion.
- Pages rendered client-side after hydration must not double-append metadata tags; server-rendered head output is the source of truth.

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: System MUST centralize global SEO defaults (title template, description, canonical host, locale, default share image, site name) in a single configuration consumable during server rendering.
- **FR-002**: System MUST apply the global defaults to every route during Next.js server-side rendering, ensuring metadata exists even when no overrides are provided.
- **FR-003**: System MUST allow any page component to supply a structured metadata override object that selectively replaces default fields while inheriting unspecified values.
- **FR-004**: Blog post pages MUST read frontmatter fields and map them to OpenGraph (`og:title`, `og:description`, `og:image`, `og:url`, `og:type=article`) values.
- **FR-005**: Blog post pages MUST emit Twitter card tags (`twitter:card=summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`) derived from the same frontmatter values and default fallbacks.
- **FR-006**: Canonical URLs MUST be generated as absolute URLs using the configured host plus the request path or slug, and the computation MUST execute without referencing browser-only globals (e.g., no `window.location`).
- **FR-007**: Share-image URLs MUST resolve to absolute, publicly accessible links at build time; the build MUST validate URL accessibility (HTTP HEAD/GET) with a 5-second timeout per URL, concurrent validation of up to 10 URLs in parallel, with validation errors displayed in CI logs. URLs MUST originate from the canonical host domain or pre-approved CDN origins only; URLs from other origins MUST be rejected at build time. **Validation severity**: Invalid origin → ERROR (fail build); Unreachable URL → ERROR (fail build); Missing hero image → WARNING (use default, continue build).
- **FR-008**: The build/deploy process MUST flag (via console warning or CI log) any blog post missing mandatory frontmatter keys used for metadata.
- **FR-009**: Metadata generation MUST support localization-ready fields (e.g., site locale) by reading the value from the global config for every page.
- **FR-010**: Documentation MUST describe how authors and developers supply overrides (frontmatter schema, config shape) so stakeholders can self-serve.

### Key Entities
- **Global Metadata Profile**: Stores brand-wide defaults such as site name, base title, base description, canonical host, locale, and default share image.
- **Page Metadata Override**: Optional object a page can provide containing fields like `title`, `description`, `canonicalPath`, and `image` to supersede defaults.
- **Blog Post Frontmatter**: Source of truth for post-specific metadata (title, description/excerpt, slug, hero image, author, publish date) feeding OG/Twitter tags.
- **Share Asset**: Image referenced either in frontmatter or defaults; must expose URL, width/height, and alternative text for accessibility.

## Dependencies
- Existing Markdown/frontmatter parsing pipeline that surfaces metadata fields to the page components.
- Next.js server-rendering lifecycle (e.g., layouts or metadata helpers) capable of injecting head tags without client-side hacks.
- CDN or static asset hosting that guarantees public availability of referenced share images at build/deploy time.

## Risks
- **Incomplete frontmatter**: Missing or malformed fields could yield generic metadata; mitigated by build-time warnings and default fallbacks.
- **Asset drift**: Default share images becoming outdated or deleted would break previews; requires asset monitoring.
- **Canonical misconfiguration**: Incorrect host values could cause duplicate-content penalties; needs environment-specific validation.
- **Scope creep**: Pressure to add analytics or CMS UI changes could delay delivery; explicitly excluded in scope.

## Acceptance Criteria Summary
1. Every route renders server-side metadata that includes a title, description, canonical URL, and share image without using browser globals.
2. Blog posts source OG/Twitter values from frontmatter, falling back to defaults only when fields are truly absent, and emit build-time warnings when fallbacks are used.
3. Global defaults can be updated in a single configuration location and propagate to all pages on rebuild without manual edits elsewhere.
4. Documentation clearly explains override mechanisms for both authors (frontmatter) and developers (page-level overrides).

## Clarifications

### Session 2025-12-17
- Q: Which Twitter card type should blog posts use? → A: `summary_large_image`
- Q: How should the build handle a missing or invalid heroImage in blog post frontmatter? → A: Log warning at build time, use default share image, continue
- Q: How should the build validate share image URLs? → A: Validate image URL accessibility at build time; fail build on broken URLs
- Q: What timeout and concurrency should URL validation use? → A: 5-second timeout per URL, concurrent validation (max 10 parallel)
- Q: Which URL origins should be allowed for share images? → A: Canonical host domain and pre-approved CDN origins only

## Success Criteria *(mandatory)*

### Measurable Outcomes
- **SC-001**: 100% of published blog posts include valid OpenGraph and Twitter metadata as verified by automated HTML inspection during CI.
- **SC-002**: 0 pages ship with relative canonical URLs; absolute URLs are confirmed across staging and production smoke tests.
- **SC-003**: Marketing can update global metadata defaults once and see changes reflected across all static pages within a single build/deploy cycle.
- **SC-004**: Social share preview validation (Facebook/Twitter cards) passes for at least 95% of sampled blog posts without manual edits per release.
