# Research: Open Source Projects Section

**Feature**: 010-projects-section  
**Date**: 2025-12-17  
**Status**: Complete

## Research Tasks

### 1. JSON Data Source Pattern

**Question**: How should the JSON data source be structured and loaded for static generation?

**Decision**: Use a single `content/projects.json` file with Zod schema validation at build time.

**Rationale**:
- Follows existing content location pattern (`content/blog/` for blog posts)
- JSON is simpler than MDX for structured data without rich content
- Zod provides TypeScript-native validation with clear error messages
- Build-time validation catches errors before deployment (FR-003)

**Alternatives Considered**:
- YAML files: Rejected - JSON is more widely supported and already used in the project
- Multiple JSON files per project: Rejected - increases complexity for ~10-50 projects
- MDX files: Rejected - overkill for structured data without rich prose content

### 2. URL Slug Handling

**Question**: How should slugs be validated and normalized for routing?

**Decision**: Slugs must be lowercase, alphanumeric with hyphens only. Validation enforced at build time.

**Rationale**:
- Constitution requires URL normalization with strict redirect handling
- Lowercase-only prevents case sensitivity issues
- Build-time slug uniqueness check prevents duplicate routes (Edge Case)

**Alternatives Considered**:
- Allow uppercase slugs with redirects: Rejected - unnecessary complexity
- Runtime slug validation: Rejected - build-time validation catches issues earlier

### 3. Soft 404 Implementation

**Question**: How should non-existent slugs be handled?

**Decision**: Return HTTP 200 with a custom `ProjectNotFound` component showing friendly message and CTA back to `/projects`.

**Rationale**:
- Spec requires "soft 404 UI component within the app (HTTP 200)"
- Follows similar pattern to existing `app/not-found.tsx`
- Better user experience than hard 404

**Alternatives Considered**:
- Hard 404 with redirect: Rejected - spec explicitly requires soft 404

### 4. Analytics Event Tracking

**Question**: How should outbound link clicks be tracked?

**Decision**: Fire analytics event on primary CTA click using existing site analytics library.

**Rationale**:
- NFR-001 requires using existing analytics library
- FR-006 requires analytics event for outbound link intent

**Alternatives Considered**:
- New analytics provider: Rejected - spec requires existing library

### 5. Data Loader Architecture

**Question**: How should the project loader be structured?

**Decision**: Create `/lib/projects/` module with `loader.ts`, `types.ts`, and `schema.ts`, mirroring `/lib/mdx/` patterns.

**Rationale**:
- Consistency with existing codebase architecture
- Separation of concerns (loading vs types vs validation)
- Easier testing of individual components

**Alternatives Considered**:
- Single file loader: Rejected - harder to test and maintain
- Inline schema in loader: Rejected - separation improves reusability

### 6. Static Generation Strategy

**Question**: How should pages be statically generated?

**Decision**: Use `generateStaticParams()` for `/projects/[slug]` routes, similar to blog post pattern.

**Rationale**:
- Matches existing blog post static generation
- Build-time generation ensures fast page loads
- Compatible with AWS Amplify static hosting

**Alternatives Considered**:
- Server-side rendering: Rejected - unnecessary for static content
- Incremental static regeneration: Rejected - data changes infrequently, full rebuild acceptable

### 7. Tag Display Handling

**Question**: How should many tags be displayed without breaking layout?

**Decision**: Show up to 3 tags on index cards (FR-004), full list on detail pages. Tags wrap naturally on detail page.

**Rationale**:
- FR-004 specifies "up to three tags" on index
- FR-005 specifies "complete tag list" on detail
- Edge case notes: "compress or wrap the tag list"

**Alternatives Considered**:
- Truncate with "..." and tooltip: Rejected - adds complexity
- Horizontal scroll: Rejected - poor mobile UX

### 8. Empty State Handling

**Question**: How should the index page display when no projects exist?

**Decision**: Show empty-state message component prompting maintainers to add entries.

**Rationale**:
- Edge case explicitly requires this behavior
- Better UX than blank page

**Alternatives Considered**:
- Hide the section entirely: Rejected - spec requires visible guidance

## Key Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.2+ | App Router, static generation |
| Zod | 4+ | Runtime schema validation |
| React | 18.3+ | UI components |
| Tailwind CSS | 3.4+ | Styling |

## Resolved Clarifications Summary

All items from Technical Context have been resolved:

- ✅ Data format: JSON file
- ✅ Loader pattern: Mirrors `/lib/mdx/` architecture
- ✅ Schema validation: Zod with build-time validation
- ✅ Routing: Static generation with `generateStaticParams()`
- ✅ 404 handling: Soft 404 component (HTTP 200)
- ✅ Analytics: Existing library event tracking
