# Implementation Plan: Blog Post Page Route

**Branch**: `006-blog-post-route` | **Date**: 2025-12-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-blog-post-route/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement the `/blog/[slug]` dynamic route that renders full blog posts with MDX content, metadata (title, date, description), and proper SEO. The route must integrate with the existing slug-preservation system (004) and blog index entities (005), handle 404s gracefully, and support canonical URL redirects for non-standard variants.

## Technical Context

**Language/Version**: TypeScript 5+ (strict mode), React 18+, Next.js 14+ (App Router)  
**Primary Dependencies**: next-mdx-remote, existing slug library (`src/lib/slug`), Tailwind CSS  
**Storage**: File-based MDX content in `content/blog/` directory  
**Testing**: Jest/React Testing Library (existing), manual visual verification  
**Target Platform**: AWS Amplify, SSG with on-demand rendering fallback  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**: LCP < 1.5s (SC-002), 404 response < 500ms (SC-003)  
**Constraints**: WCAG 2.1 AA accessibility, maintain backward compatibility with existing slugs  
**Scale/Scope**: ~50 blog posts, single dynamic route

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Migration Integrity | ✅ PASS | Preserves existing slug URLs via 004-preserve-slugs; uses same content source |
| II. Type Safety & Modern Standards | ✅ PASS | All new code in TypeScript strict mode; React functional components with hooks |
| III. Content Preservation | ✅ PASS | MDX files remain source of truth; no content rewrites required |
| IV. Progressive Enhancement | ✅ PASS | Incremental feature; independent of auxiliary features (analytics, playlists) |
| V. Deployment & Operations | ✅ PASS | Static generation compatible with AWS Amplify; single route addition |

## Project Structure

### Documentation (this feature)

```text
specs/006-blog-post-route/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   └── blog/
│       └── [slug]/
│           └── page.tsx          # Dynamic blog post route (NEW)
├── components/
│   ├── layout.js                 # Existing layout component
│   ├── seo.js                    # Existing SEO component
│   └── blog-post/                # Blog post specific components (NEW)
│       ├── BlogPostHeader.tsx    # Title, date, description header
│       ├── BlogPostBody.tsx      # MDX content renderer
│       └── BlogPostNav.tsx       # Back to /blog navigation
├── lib/
│   ├── slug/                     # Existing slug library (004)
│   └── mdx/                      # MDX utilities (NEW/extend)
│       ├── loader.ts             # Content loading functions
│       └── components.tsx        # MDX component mappings
└── templates/
    └── blog-post.js              # Existing Gatsby template (reference)

content/blog/
└── {post-folder}/
    └── index.md                  # MDX content files (existing)
```

**Structure Decision**: Next.js App Router pattern with dynamic route segment `[slug]`. Extends existing `src/lib/slug` infrastructure from spec-004 and `BlogIndexEntry` types from spec-005.

## Complexity Tracking

> No Constitution Check violations. This feature follows all established principles.
