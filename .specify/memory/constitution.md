<!--
Sync Impact Report (2025-12-17):
================================================================================
VERSION CHANGE: 1.0.0 → 1.1.0
BUMP RATIONALE: MINOR - Added new section (Architectural Decisions) capturing
migration learnings; expanded Technology Stack with concrete dependencies

MODIFIED PRINCIPLES: None (principles unchanged)

ADDED SECTIONS:
- Architectural Decisions (project structure, MDX integration, routing patterns,
  content location, testing strategy, key dependencies)

REMOVED SECTIONS: None

TEMPLATES REQUIRING UPDATES:
✅ plan-template.md - No updates needed (Constitution Check references principles)
✅ spec-template.md - No updates needed (requirements format unchanged)
✅ tasks-template.md - No updates needed (task structure unchanged)
✅ agent-file-template.md - No updates needed
✅ checklist-template.md - No updates needed

FOLLOW-UP TODOS: None
================================================================================
-->

# Get2Know Blog Constitution

## Core Principles

### I. Migration Integrity

**Rule**: All existing blog content, metadata, and functionality MUST be preserved during the GatsbyJS → Next.js migration. Breaking changes to URLs, content rendering, or user experience are NOT acceptable unless explicitly documented and approved.

**Rationale**: The blog has been operational since 2020 with established content and audience. URL structures, SEO rankings, and content accessibility must be maintained to preserve user trust and search engine standing.

### II. Type Safety & Modern Standards

**Rule**: All new code MUST be written in TypeScript with strict type checking enabled. React components MUST follow modern patterns (hooks, functional components). No `any` types except where explicitly justified in migration boundary layers.

**Rationale**: The migration from JavaScript/Gatsby to TypeScript/Next.js is an opportunity to establish type safety from the ground up, reducing runtime errors and improving maintainability for future development.

### III. Content Preservation

**Rule**: The migration MUST support existing MDX content files without requiring content rewrites. Markdown/MDX files in `content/blog/` are the source of truth. Image optimization, frontmatter metadata, and embedded components MUST continue to function.

**Rationale**: Content creation and maintenance effort represents significant investment. Requiring content rewrites would be costly and error-prone. The new system must adapt to existing content structure, not vice versa.

### IV. Progressive Enhancement

**Rule**: Features MUST be migrated incrementally with each increment being deployable and testable independently. Core blog functionality (post listing, individual posts, RSS feed) takes precedence over auxiliary features (analytics, comments, playlists).

**Rationale**: Incremental delivery reduces risk, enables faster feedback, and ensures a minimal viable product can be deployed early. This approach allows rollback to GatsbyJS if critical issues arise during migration.

### V. Deployment & Operations

**Rule**: The application MUST be deployable to AWS Amplify with CI/CD automation. Build times MUST be reasonable (<5 minutes for typical content changes). Environment configuration MUST support local development, preview deployments, and production.

**Rationale**: AWS Amplify is the target hosting platform. Deployment automation ensures consistent builds and reduces manual errors. Fast build times improve developer experience and enable rapid iteration.

## Technology Stack

**Framework**: Next.js 14+ (App Router) with React 18+
**Language**: TypeScript 5+ with strict mode
**Content**: MDX with `next-mdx-remote` (Server Component compatible)
**Styling**: Tailwind CSS (existing utility classes preserved where practical)
**Hosting**: AWS Amplify
**Build**: Node.js 18+ LTS
**Testing**: Playwright for E2E tests

**Key Dependencies**:
- `next-mdx-remote` - MDX rendering with Server Components
- `gray-matter` - Frontmatter parsing from MDX files
- `reading-time` - Estimated reading time calculation

**Constraints**:
- Maintain compatibility with existing Gatsby plugins where feasible (e.g., image optimization, syntax highlighting)
- RSS feed generation MUST be equivalent to gatsby-plugin-feed-mdx
- Google Analytics integration (gatsby-plugin-google-analytics equivalent)
- Manifest and offline support can be deferred to post-migration phase

## Migration Workflow

**Phase Sequence**:
1. **Setup**: Initialize Next.js project structure, configure TypeScript, establish build pipeline
2. **Core Content**: Implement blog post listing, individual post pages, MDX rendering
3. **Metadata & SEO**: Port site metadata, implement next/head equivalents, RSS feed generation
4. **Assets**: Image optimization (next/image), static asset handling
5. **Features**: Analytics, playlist integration (if required), other auxiliary features
6. **Polish**: Performance optimization, accessibility audit, final testing

**Testing Strategy**:
- Visual regression testing for migrated pages (compare Gatsby vs Next.js output)
- Content validation (all posts render correctly, no broken images/links)
- Build verification (successful builds in Amplify environment)
- Manual testing for critical user journeys

**Rollback Plan**: Gatsby deployment remains available until Next.js version is fully validated in production.

## Architectural Decisions

Learnings from the GatsbyJS → Next.js migration captured for future reference.

### Project Structure

**Decision**: Monorepo structure with Next.js application at `apps/site-shell/`.

**Rationale**: Separates the web application from content and supporting tooling. Allows for potential future applications (e.g., admin tools) without restructuring.

**Configuration**: `next.config.mjs` requires `transpilePackages: ['next-mdx-remote']` for proper MDX compilation.

### Content Location

**Decision**: Blog content remains at repository root in `content/blog/`.

**Rationale**: Content is independent of the rendering framework. Keeping content at the repository root allows content authors to work without navigating application-specific directories and facilitates potential multi-app content sharing.

### MDX Integration

**Decision**: Use `next-mdx-remote` for MDX rendering.

**Pattern**: Server Component compatible approach with `MDXRemote` component. Content is parsed and compiled on the server, hydrated on the client where needed.

**Dependencies**:
- `next-mdx-remote` - MDX compilation and rendering
- `gray-matter` - Frontmatter extraction
- `reading-time` - Content metrics

### Routing Patterns

**Decision**: URL normalization with strict redirect handling.

**Rules**:
- Slugs MUST be lowercase (normalized from frontmatter/filenames)
- 301 redirects for case mismatches (e.g., `/blog/MyPost` → `/blog/mypost`)
- 308 redirects for trailing slash normalization
- Custom 404 handling via `app/not-found.tsx`

**Rationale**: Consistent URLs improve SEO and prevent duplicate content indexing. Permanent redirects preserve link equity from external sites.

### Testing Strategy

**Decision**: Playwright for E2E tests located in `apps/site-shell/tests/`.

**Scope**:
- Content rendering verification
- Navigation and routing tests
- 404 and redirect behavior validation
- Critical user journeys

## Governance

**Amendment Process**: Constitution changes require documentation of rationale, version bump per semantic versioning, and updates to dependent templates/specifications.

**Compliance Verification**: All feature specifications and implementation plans MUST reference applicable constitution principles. Tasks that violate principles require explicit justification in Complexity Tracking section.

**Version Control**: Constitution version follows semantic versioning:
- MAJOR: Principle removal, fundamental governance change, backward-incompatible requirement changes
- MINOR: New principle addition, expanded guidance, new mandatory sections
- PATCH: Clarifications, typo fixes, non-semantic refinements

**Version**: 1.1.0 | **Ratified**: 2025-12-15 | **Last Amended**: 2025-12-17
