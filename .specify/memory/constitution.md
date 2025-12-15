<!--
Sync Impact Report (2025-12-15):
================================================================================
VERSION CHANGE: 0.0.0 → 1.0.0
BUMP RATIONALE: MAJOR - Initial constitution ratification for blog migration project

MODIFIED PRINCIPLES:
- NEW: I. Migration Integrity
- NEW: II. Type Safety & Modern Standards
- NEW: III. Content Preservation
- NEW: IV. Progressive Enhancement
- NEW: V. Deployment & Operations

ADDED SECTIONS:
- Technology Stack
- Migration Workflow

REMOVED SECTIONS: None (initial version)

TEMPLATES REQUIRING UPDATES:
✅ plan-template.md - Constitution Check section compatible with new principles
✅ spec-template.md - Requirements format aligns with content and feature requirements
✅ tasks-template.md - Task structure supports migration and incremental delivery approach

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
**Content**: MDX with next-mdx-remote or similar
**Styling**: Tailwind CSS (existing utility classes preserved where practical)
**Hosting**: AWS Amplify
**Build**: Node.js 18+ LTS

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

## Governance

**Amendment Process**: Constitution changes require documentation of rationale, version bump per semantic versioning, and updates to dependent templates/specifications.

**Compliance Verification**: All feature specifications and implementation plans MUST reference applicable constitution principles. Tasks that violate principles require explicit justification in Complexity Tracking section.

**Version Control**: Constitution version follows semantic versioning:
- MAJOR: Principle removal, fundamental governance change, backward-incompatible requirement changes
- MINOR: New principle addition, expanded guidance, new mandatory sections
- PATCH: Clarifications, typo fixes, non-semantic refinements

**Version**: 1.0.0 | **Ratified**: 2025-12-15 | **Last Amended**: 2025-12-15
