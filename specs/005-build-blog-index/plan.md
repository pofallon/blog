# Implementation Plan: Minimal Blog Index

**Branch**: `005-build-blog-index` | **Date**: 2025-12-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-build-blog-index/spec.md`

## Summary

Build the `/blog` index page that lists blog posts newest-first using metadata parsed from MDX frontmatter. Leverages the existing MDX content pipeline from spec-003 and extends it to support reverse-chronological listing with proper routing to canonical post URLs.

## Technical Context

**Language/Version**: TypeScript 5.6+, React 18.3, Next.js 14.2 (App Router)
**Primary Dependencies**: next-mdx-remote, gray-matter, zod (existing from 003-add-mdx-support)
**Storage**: File-based MDX content in `/content/posts/` (existing)
**Testing**: Jest (unit), Playwright (e2e) - existing test infrastructure
**Target Platform**: Web (AWS Amplify deployment)
**Project Type**: Web application (Next.js monorepo with site-shell)
**Performance Goals**: Cold page load <1 second, build time <5 minutes
**Constraints**: No pagination required for initial iteration, no client-side state
**Scale/Scope**: Current content ~2 posts, designed for growth to ~100 posts

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Migration Integrity | ✅ PASS | Uses existing slug rules; preserves URL structure |
| II. Type Safety & Modern Standards | ✅ PASS | TypeScript throughout; functional React components |
| III. Content Preservation | ✅ PASS | Extends existing MDX pipeline; no content changes required |
| IV. Progressive Enhancement | ✅ PASS | Incremental feature; deployable independently |
| V. Deployment & Operations | ✅ PASS | Static generation; no additional infra needed |

## Project Structure

### Documentation (this feature)

```text
specs/005-build-blog-index/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
apps/site-shell/
├── app/
│   └── blog/
│       └── page.tsx           # Blog index page (MODIFY - currently placeholder)
├── lib/
│   └── mdx/
│       ├── loader.ts          # Content loader (EXTEND - add sorting/filtering)
│       ├── types.ts           # Type definitions (EXTEND - add BlogIndexEntry)
│       └── parser.ts          # Frontmatter parser (existing)
├── components/
│   └── blog/
│       └── BlogPostCard.tsx   # NEW - post listing card component
└── tests/
    └── unit/                  # Unit tests for new utilities
```

**Structure Decision**: Extends existing site-shell Next.js application. New code follows established patterns from 003-add-mdx-support. UI components in `components/blog/`, data utilities in `lib/mdx/`.

## Complexity Tracking

> No violations. Implementation follows existing patterns and constitution principles.
