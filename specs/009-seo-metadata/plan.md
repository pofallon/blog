# Implementation Plan: SEO Metadata Framework

**Branch**: `009-seo-metadata` | **Date**: 2025-12-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/009-seo-metadata/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a comprehensive SEO metadata framework for the Next.js blog that centralizes global SEO defaults, enables per-page overrides via frontmatter for blog posts, and emits OpenGraph and Twitter card metadata. The system must generate absolute canonical URLs and share-image URLs without referencing browser globals, using Next.js server rendering capabilities and the existing MDX content pipeline.

## Technical Context

**Language/Version**: TypeScript 5+ with strict mode  
**Primary Dependencies**: Next.js 14+ (App Router), next-mdx-remote, gray-matter  
**Storage**: File-based (MDX frontmatter in `content/blog/`)  
**Testing**: Playwright for E2E tests, Jest for unit tests  
**Target Platform**: AWS Amplify (Node.js 18+ LTS)  
**Project Type**: Web application (monorepo with Next.js app at `apps/site-shell/`)  
**Performance Goals**: Build time <5 minutes for typical content changes  
**Constraints**: Server-side rendering only for metadata (no browser globals), URL validation with 5s timeout per URL, max 10 concurrent validations  
**Scale/Scope**: ~50 blog posts, 5-10 static pages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Migration Integrity | ✅ PASS | Feature extends existing metadata system without breaking URLs or content; enhances SEO without changing user experience |
| II. Type Safety & Modern Standards | ✅ PASS | All new code will be TypeScript with strict types; follows existing patterns in `lib/types.ts` and `lib/mdx/blog-post-types.ts` |
| III. Content Preservation | ✅ PASS | Reads existing MDX frontmatter without requiring content rewrites; adds optional fields only |
| IV. Progressive Enhancement | ✅ PASS | SEO metadata is Phase 3 of migration sequence; builds on existing blog post infrastructure |
| V. Deployment & Operations | ✅ PASS | Uses Next.js native Metadata API; compatible with AWS Amplify; server-rendered without browser globals |

**Technology Stack Compliance**: ✅ All technologies align with constitution (Next.js 14+, TypeScript 5+, MDX with next-mdx-remote, Playwright)

## Project Structure

### Documentation (this feature)

```text
specs/009-seo-metadata/
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
│   ├── layout.tsx           # Root layout with global metadata (modify)
│   └── blog/
│       ├── page.tsx         # Blog index metadata (modify)
│       └── [slug]/
│           └── page.tsx     # Blog post metadata - generateMetadata (modify)
├── lib/
│   ├── types.ts             # SiteMetadata type (extend)
│   ├── site-shell.ts        # Global metadata config (extend)
│   ├── seo/                  # NEW: SEO utilities module
│   │   ├── index.ts         # Public exports
│   │   ├── config.ts        # Global SEO config (FR-001)
│   │   ├── metadata.ts      # Metadata generation utilities
│   │   ├── url-builder.ts   # Canonical URL generator (FR-006)
│   │   ├── image-validator.ts # Share image URL validator (FR-007)
│   │   └── types.ts         # SEO-specific types
│   └── mdx/
│       └── blog-post-types.ts # Frontmatter types (extend)
├── scripts/
│   └── validate-seo.ts      # Build-time validation script (FR-007, FR-008)
└── tests/
    └── seo/                  # SEO tests
        ├── metadata.spec.ts  # Unit tests for metadata generation
        └── e2e/
            └── seo.spec.ts   # E2E tests for rendered metadata

content/blog/
└── {slug}/
    └── index.mdx            # Existing frontmatter structure (hero, description, etc.)
```

**Structure Decision**: Follows existing monorepo pattern with Next.js app at `apps/site-shell/`. New SEO utilities placed in `lib/seo/` module following existing `lib/mdx/` organizational pattern.

## Complexity Tracking

> **No constitution violations identified. All design decisions align with established principles.**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (none) | - | - |

---

## Post-Design Constitution Re-Check

*Re-evaluated after Phase 1 design completion.*

| Principle | Status | Design Evidence |
|-----------|--------|-----------------|
| I. Migration Integrity | ✅ PASS | Design extends existing `SiteMetadata` type and `generateMetadata()` without breaking existing routes or URLs |
| II. Type Safety & Modern Standards | ✅ PASS | All interfaces defined with strict TypeScript types; no `any` types; functional patterns |
| III. Content Preservation | ✅ PASS | Uses existing frontmatter fields (`title`, `description`, `hero`); no new required fields |
| IV. Progressive Enhancement | ✅ PASS | SEO module is isolated; can be incrementally deployed without affecting existing pages |
| V. Deployment & Operations | ✅ PASS | All metadata generated server-side via Next.js Metadata API; validated at build time |

**Final Gate Status**: ✅ PASS - Ready for Phase 2 task generation

---

## Generated Artifacts

| Artifact | Path | Status |
|----------|------|--------|
| Implementation Plan | `specs/009-seo-metadata/plan.md` | ✅ Complete |
| Research Document | `specs/009-seo-metadata/research.md` | ✅ Complete |
| Data Model | `specs/009-seo-metadata/data-model.md` | ✅ Complete |
| API Contracts | `specs/009-seo-metadata/contracts/seo-api.md` | ✅ Complete |
| Quickstart Guide | `specs/009-seo-metadata/quickstart.md` | ✅ Complete |
| Agent Context | `.github/agents/copilot-instructions.md` | ✅ Updated |
