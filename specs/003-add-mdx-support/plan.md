# Implementation Plan: MDX Content Pipeline

**Branch**: `003-add-mdx-support` | **Date**: 2025-12-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-add-mdx-support/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement MDX content support in the Next.js app (`apps/site-shell`) with typed frontmatter parsing, build-time validation, and end-to-end rendering. Content will be loaded from `/content/posts/` with a typed metadata contract (title, date, description, optional image). A demo MDX entry will prove the pipeline works.

## Technical Context

**Language/Version**: TypeScript 5.6+ with strict mode enabled  
**Primary Dependencies**: Next.js 14.2, next-mdx-remote, gray-matter (frontmatter parsing), zod (schema validation)  
**Storage**: Filesystem (`/content/posts/` flat directory structure)  
**Testing**: Jest (unit), Playwright (e2e), existing test infrastructure in apps/site-shell  
**Target Platform**: Node.js 18+ LTS, AWS Amplify deployment  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**: Build time increase <10% from baseline, cold page load <2s  
**Constraints**: Must not regress existing blog routes or content; additive feature only  
**Scale/Scope**: Single demo MDX entry for this spec; future migration of existing content out of scope

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Migration Integrity | ✅ PASS | FR-007 explicitly requires existing posts remain untouched; MDX support is additive |
| II. Type Safety & Modern Standards | ✅ PASS | TypeScript strict mode, Zod schema validation, functional React components |
| III. Content Preservation | ✅ PASS | New `/content/posts/` directory; existing `content/blog/` unchanged |
| IV. Progressive Enhancement | ✅ PASS | Single demo entry; incremental approach; no dependency on legacy migration |
| V. Deployment & Operations | ✅ PASS | Build time constraint <10% increase; AWS Amplify compatible |

**Pre-Design Gate**: ✅ PASSED - All principles satisfied

### Post-Design Constitution Re-Check

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Migration Integrity | ✅ PASS | Design uses new `/content/posts/` directory; existing `content/blog/` untouched |
| II. Type Safety & Modern Standards | ✅ PASS | Zod schemas with TypeScript inference; functional components; strict mode |
| III. Content Preservation | ✅ PASS | No changes to existing content structure; MDX is additive |
| IV. Progressive Enhancement | ✅ PASS | Single demo entry validates pipeline before migration |
| V. Deployment & Operations | ✅ PASS | Dependencies are lightweight; build overhead minimal |

**Post-Design Gate**: ✅ PASSED - Design artifacts comply with all constitution principles

## Project Structure

### Documentation (this feature)

```text
specs/003-add-mdx-support/
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
│   └── posts/
│       └── [slug]/
│           └── page.tsx       # Dynamic MDX post route
├── lib/
│   ├── mdx/
│   │   ├── loader.ts          # MDX file loader
│   │   ├── parser.ts          # Frontmatter parsing
│   │   ├── validator.ts       # Schema validation
│   │   └── types.ts           # MDX type definitions
│   └── types.ts               # Extended with MDX types
├── components/
│   └── mdx/
│       ├── MDXContent.tsx     # MDX renderer component
│       └── index.ts           # Component whitelist/registry
└── tests/
    └── lib/
        └── mdx/               # Unit tests for MDX utilities

content/
└── posts/
    └── demo-mdx.mdx           # Demo entry proving pipeline
```

**Structure Decision**: Extends existing Next.js App Router structure in `apps/site-shell`. New `/posts/[slug]` route for MDX content. MDX utilities in `lib/mdx/`. Content in monorepo root `/content/posts/` per FR-003.

## Complexity Tracking

> No constitution violations requiring justification. All principles satisfied.
