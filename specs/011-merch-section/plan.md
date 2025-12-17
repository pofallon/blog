# Implementation Plan: Merch Section Scaffold

**Branch**: `011-merch-section` | **Date**: 2025-12-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/011-merch-section/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a merch section scaffold with `/merch` index page and `/merch/[product]` detail pages driven by JSON placeholder data. Implements product schema validation, status-based CTAs, image galleries, and documentation for future commerce integration. Uses Next.js 14 App Router, TypeScript, Tailwind CSS, and Zod for validation.

## Technical Context

**Language/Version**: TypeScript 5.6+ with strict mode  
**Primary Dependencies**: Next.js 14.2, React 18.3, Tailwind CSS 3.4, Zod 3.x  
**Storage**: JSON file (`content/merch/products.json`) validated via JSON Schema  
**Testing**: Jest (unit), Playwright (E2E)  
**Target Platform**: AWS Amplify (SSG/SSR hybrid)  
**Project Type**: Web application (monorepo: `apps/site-shell/`)  
**Performance Goals**: LCP < 2.5s, FID < 100ms, CLS < 0.1 (Core Web Vitals)  
**Constraints**: WCAG 2.1 AA compliance, hero images eager-load, gallery lazy-load  
**Scale/Scope**: 4-8 placeholder products initially, expand without layout changes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. Migration Integrity** | ✅ PASS | New feature, no existing content affected. URLs are additive (`/merch`, `/merch/[product]`) |
| **II. Type Safety** | ✅ PASS | All code in TypeScript with strict mode. Zod schemas for runtime validation |
| **III. Content Preservation** | ✅ PASS | Existing MDX content untouched. Merch uses separate JSON data source |
| **IV. Progressive Enhancement** | ✅ PASS | Scaffold is self-contained, deployable independently. No commerce dependencies |
| **V. Deployment & Operations** | ✅ PASS | Compatible with AWS Amplify. JSON validation fails build on schema errors |

**Gate Status**: ✅ PASSED - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/011-merch-section/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
apps/site-shell/
├── app/
│   └── merch/
│       ├── page.tsx              # /merch index (expand existing placeholder)
│       └── [slug]/
│           └── page.tsx          # /merch/[product] detail page
├── components/
│   └── merch/
│       ├── ProductCard.tsx       # Tile for index grid
│       ├── ProductGallery.tsx    # Image carousel with lazy-load
│       ├── StatusBadge.tsx       # Available/Coming Soon/Sold Out
│       ├── CommerceInfoBlock.tsx # "How to buy later" CTA
│       └── MerchEmptyState.tsx   # Empty catalog fallback
├── lib/
│   └── merch/
│       ├── schema.ts             # Zod schema for Product
│       ├── loader.ts             # JSON loader with validation
│       ├── analytics.ts          # Page view event tracking
│       └── types.ts              # TypeScript types
└── tests/
    ├── unit/
    │   └── merch/
    │       ├── schema.test.ts
    │       └── loader.test.ts
    └── e2e/
        └── merch.spec.ts

content/
└── merch/
    ├── products.json             # Placeholder product data
    └── products.schema.json      # JSON Schema for validation
```

**Structure Decision**: Follows existing monorepo pattern with `apps/site-shell/`. New merch components isolated in `components/merch/` and `lib/merch/` directories. Content stored in `content/merch/` at repo root, consistent with `content/blog/` pattern.

## Complexity Tracking

No constitution violations. Feature is additive and follows existing patterns.

## Post-Design Constitution Re-Check

*Re-evaluated after Phase 1 design completion.*

| Principle | Status | Design Validation |
|-----------|--------|-------------------|
| **I. Migration Integrity** | ✅ PASS | No existing URLs affected. `/merch` route additive. Data model isolated in `content/merch/` |
| **II. Type Safety** | ✅ PASS | Zod schemas with TypeScript inference. All components typed. No `any` types |
| **III. Content Preservation** | ✅ PASS | Blog MDX content unchanged. New JSON format for merch only |
| **IV. Progressive Enhancement** | ✅ PASS | Scaffold deployable without commerce. Status CTAs degrade to contact links |
| **V. Deployment & Operations** | ✅ PASS | SSG-compatible. Build-time validation. <5 min build impact |

**Post-Design Gate Status**: ✅ PASSED - Ready for Phase 2 task generation
