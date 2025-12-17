# Implementation Plan: Custom MDX Component Registry

**Branch**: `008-mdx-component-registry` | **Date**: 2025-12-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/008-mdx-component-registry/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a typed component registry for MDX content allowing authors to reference approved React components by canonical name. The registry will include `PlaylistEmbed` with feature parity to existing playlist embeds, graceful fallback handling for missing credentials/data, and build-time validation with structured logging. Extends the existing `mdxComponents` pattern in `apps/site-shell/components/mdx/index.ts`.

## Technical Context

**Language/Version**: TypeScript 5.6+, React 18.3, Next.js 14.2  
**Primary Dependencies**: next-mdx-remote 5.0, gray-matter 4.0, zod 3.x  
**Storage**: N/A (registry is code-based; credentials via environment variables)  
**Testing**: Jest (unit), Playwright (E2E)  
**Target Platform**: Web (SSR/SSG via Next.js on AWS Amplify)  
**Project Type**: Web application (monorepo with apps/site-shell)  
**Performance Goals**: LCP increase ≤500ms per spec Risk #2  
**Constraints**: Builds must complete with missing credentials; no hardcoded secrets  
**Scale/Scope**: ~30 existing MDX posts; initial registry with 2-3 components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Migration Integrity | ✅ PASS | Extends existing MDX rendering; no breaking changes to URLs or content |
| II. Type Safety & Modern Standards | ✅ PASS | Registry uses TypeScript interfaces, Zod validation, functional components |
| III. Content Preservation | ✅ PASS | Existing MDX files unchanged; new components are additive |
| IV. Progressive Enhancement | ✅ PASS | Registry is incremental; PlaylistEmbed replaces placeholder without breaking existing posts |
| V. Deployment & Operations | ✅ PASS | No build-time secrets required; credentials optional with fallbacks |

## Project Structure

### Documentation (this feature)

```text
specs/008-mdx-component-registry/
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
├── components/
│   ├── mdx/
│   │   ├── index.ts              # Registry exports (extend existing)
│   │   ├── MDXContent.tsx        # Renderer with proxy (extend existing)
│   │   └── registry/             # NEW: Component registry
│   │       ├── types.ts          # Registry entry types
│   │       ├── registry.ts       # Central registry map
│   │       ├── validation.ts     # Prop validation
│   │       └── PlaylistEmbed/    # NEW: PlaylistEmbed component
│   │           ├── index.tsx
│   │           ├── types.ts
│   │           └── PlaylistEmbed.test.tsx
├── lib/
│   └── mdx/
│       └── blog-post-components.tsx  # Update to use registry
└── tests/
    ├── unit/
    │   └── registry.test.tsx         # Unit tests for registry
    └── e2e/
        └── mdx-components.spec.ts    # E2E tests for MDX components

docs/
└── mdx-components.md                 # Author documentation (T028)
```

**Structure Decision**: Monorepo web application pattern. Registry lives under `components/mdx/registry/` as a logical extension of the existing MDX component infrastructure. Component implementations are co-located with their types and tests.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
