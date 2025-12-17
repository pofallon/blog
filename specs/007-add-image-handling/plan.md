# Implementation Plan: Blog Image Handling Enhancements

**Branch**: `007-add-image-handling` | **Date**: 2025-12-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-add-image-handling/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement image handling for the Next.js blog with optional hero images in frontmatter, inline images in MDX, responsive optimization (480/768/1200/1920px breakpoints), and lazy loading (200px viewport threshold). Uses Next.js `next/image` for optimization with local file storage in `content/images/<post-slug>/` directories.

## Technical Context

**Language/Version**: TypeScript 5.6+ with strict mode  
**Primary Dependencies**: Next.js 14.2+, next/image, next-mdx-remote 5.0, gray-matter, zod  
**Storage**: Local filesystem in `content/images/<post-slug>/` directories  
**Testing**: Jest for unit tests, Playwright for E2E tests  
**Target Platform**: AWS Amplify (SSG/ISR), modern browsers  
**Project Type**: Web application (monorepo with apps/site-shell)  
**Performance Goals**: Sub-2s LCP on broadband, inline images load <1s, <20% page weight increase vs text-only  
**Constraints**: Build time <5 minutes, responsive breakpoints (480/768/1200/1920px), lazy-load threshold 200px  
**Scale/Scope**: ~50 posts initially, 1-5 images per post typical

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Migration Integrity | ✅ PASS | No breaking changes to existing URLs or content. Image handling is additive. |
| II. Type Safety & Modern Standards | ✅ PASS | All new code in TypeScript with strict mode. Zod schemas for validation. |
| III. Content Preservation | ✅ PASS | Existing MDX files work without changes. Image support is optional per-post. |
| IV. Progressive Enhancement | ✅ PASS | Image feature is independently deployable. Core blog remains functional without images. |
| V. Deployment & Operations | ✅ PASS | Uses Next.js built-in image optimization compatible with Amplify. No additional build complexity. |

**Technology Stack Alignment**: Next.js 14+ ✓, TypeScript 5+ ✓, Tailwind CSS ✓, Playwright for E2E ✓

## Project Structure

### Documentation (this feature)

```text
specs/007-add-image-handling/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
apps/site-shell/
├── app/
│   └── blog/[slug]/     # Blog post route (exists, add hero image rendering)
├── components/
│   └── blog/            # Blog components (exists)
│       ├── HeroImage.tsx        # New: Hero image component
│       └── OptimizedImage.tsx   # New: MDX inline image component
├── lib/
│   └── mdx/
│       ├── blog-post-types.ts   # Extend HeroImageMeta type
│       ├── blog-post-loader.ts  # Add image validation
│       └── image-optimizer.ts   # New: Image optimization utilities
└── tests/
    └── e2e/
        └── blog-images.spec.ts  # New: Image handling E2E tests

content/
├── images/                      # New: Centralized image storage
│   └── <post-slug>/             # Per-post image directories
│       └── hero.jpg             # Hero and inline images
└── blog/
    └── <slug>/                  # Existing posts (frontmatter extended)
        └── index.mdx
```

**Structure Decision**: Monorepo with Next.js application at `apps/site-shell/`. Images stored at `content/images/<post-slug>/` following constitution's content location decision (content independent of rendering framework).

## Complexity Tracking

> No Constitution violations identified. All design decisions align with established principles.
