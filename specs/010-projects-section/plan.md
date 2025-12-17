# Implementation Plan: Open Source Projects Section

**Branch**: `010-projects-section` | **Date**: 2025-12-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/010-projects-section/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build an open source projects section with `/projects` index and `/projects/[slug]` detail pages driven by a JSON data source (`content/projects.json`). The implementation follows existing blog patterns using Next.js App Router with static generation, TypeScript strict mode, Tailwind CSS styling, and Zod schema validation.

## Technical Context

**Language/Version**: TypeScript 5.6+ with strict mode  
**Primary Dependencies**: Next.js 14.2+, React 18.3, Zod 4+, Tailwind CSS 3.4  
**Storage**: JSON file (`content/projects.json`) loaded at build time  
**Testing**: Jest for unit tests, Playwright for E2E tests  
**Target Platform**: Web (AWS Amplify static hosting)  
**Project Type**: Web application (monorepo with `apps/site-shell/`)  
**Performance Goals**: Static pages, <5 minute build times  
**Constraints**: <200ms page load, preserve existing URL patterns, no runtime data fetching  
**Scale/Scope**: ~10-50 projects, 2 new routes, follows existing blog architecture

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Migration Integrity | ✅ PASS | No existing project URLs to preserve; new feature addition |
| II. Type Safety | ✅ PASS | TypeScript strict mode, Zod schema validation, no `any` types |
| III. Content Preservation | ✅ PASS | JSON data source follows MDX content pattern (source of truth in `/content/`) |
| IV. Progressive Enhancement | ✅ PASS | Feature is self-contained, incrementally deployable, independent of core blog |
| V. Deployment & Operations | ✅ PASS | Static generation compatible with AWS Amplify, no new infrastructure |

**Technology Stack Compliance**:
- Framework: Next.js 14+ App Router ✅
- Language: TypeScript 5+ strict mode ✅
- Styling: Tailwind CSS ✅
- Hosting: AWS Amplify compatible ✅
- Testing: Playwright E2E + Jest unit tests ✅

## Project Structure

### Documentation (this feature)

```text
specs/010-projects-section/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
content/
└── projects.json          # Project data source (FR-002)

apps/site-shell/
├── app/
│   └── projects/
│       ├── page.tsx            # Index page /projects (FR-004)
│       └── [slug]/
│           └── page.tsx        # Detail page /projects/[slug] (FR-005)
├── components/
│   └── projects/
│       ├── ProjectCard.tsx     # Card for index listing
│       ├── ProjectDetail.tsx   # Full detail view
│       ├── ProjectTags.tsx     # Tag display component
│       └── ProjectNotFound.tsx # Soft 404 component (FR-007)
├── lib/
│   └── projects/
│       ├── loader.ts           # JSON data loader
│       ├── types.ts            # TypeScript interfaces
│       └── schema.ts           # Zod validation schema (FR-003)
└── tests/
    └── projects/
        ├── loader.test.ts      # Unit tests
        └── e2e/
            └── projects.spec.ts # E2E tests
```

**Structure Decision**: Follows existing `apps/site-shell/` monorepo pattern established in blog migration. New `/lib/projects/` module mirrors `/lib/mdx/` architecture for consistency.

## Complexity Tracking

> No constitution violations identified. Feature follows established patterns.
