# Implementation Plan: Deterministic Slug Preservation

**Branch**: `004-preserve-slugs` | **Date**: 2025-12-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-preserve-slugs/spec.md`

## Summary

Implement a deterministic slug generation strategy that preserves existing Gatsby blog URLs derived from file paths. The solution includes a reusable slug function, a canonical manifest for regression checking, automated verification tooling, and documentation for content folder structure.

## Technical Context

**Language/Version**: Node.js 18+ / TypeScript 5+ (strict mode per constitution)  
**Primary Dependencies**: gatsby-source-filesystem (existing), transliteration library (e.g., `slugify` or `transliteration`)  
**Storage**: JSON file for slug manifest (`specs/004-preserve-slugs/slug-manifest.json`)  
**Testing**: Jest or Vitest for unit tests; verification script for regression checks  
**Target Platform**: Linux/macOS for local dev, AWS Amplify for production builds  
**Project Type**: Single project (Gatsby blog migrating to Next.js)  
**Performance Goals**: Verification command completes in <60 seconds for full content set (SC-002)  
**Constraints**: Zero slug mismatches for existing posts (SC-001); build must fail on violations  
**Scale/Scope**: ~1-10 blog posts currently; designed to scale to hundreds

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Migration Integrity | ✅ PASS | Slug preservation is directly aligned—ensures existing URLs remain stable during migration |
| II. Type Safety & Modern Standards | ✅ PASS | Slug function will be TypeScript with strict types; no `any` usage |
| III. Content Preservation | ✅ PASS | Feature preserves content paths; MDX files remain source of truth |
| IV. Progressive Enhancement | ✅ PASS | Slug tooling is independently deployable/testable before full migration |
| V. Deployment & Operations | ✅ PASS | Verification command integrates with CI/CD; <60s execution target meets build time goals |

**Gate Result**: PASS - No violations identified. Feature supports constitution principles.

## Project Structure

### Documentation (this feature)

```text
specs/004-preserve-slugs/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── slug-api.ts      # TypeScript interface definitions
├── slug-manifest.json   # Canonical slug mappings (FR-003)
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── lib/
│   └── slug/
│       ├── index.ts           # Main slug generation function (FR-001)
│       ├── normalize.ts       # Normalization rules (FR-002)
│       └── types.ts           # TypeScript types
└── cli/
    └── verify-slugs.ts        # Verification command (FR-004)

tests/
├── unit/
│   └── slug/
│       ├── slug.test.ts       # Slug function unit tests
│       └── normalize.test.ts  # Normalization tests
└── integration/
    └── slug-manifest.test.ts  # Manifest verification tests
```

**Structure Decision**: Single project structure. Slug library placed in `src/lib/slug/` for reuse by both Gatsby build and future Next.js migration. CLI tools in `src/cli/` for verification commands.

## Complexity Tracking

> No constitution violations identified. This section remains empty.

## Post-Design Constitution Re-Check

*Re-evaluated after Phase 1 design completion.*

| Principle | Status | Design Validation |
|-----------|--------|-------------------|
| I. Migration Integrity | ✅ PASS | Slug manifest preserves all existing URLs; verification blocks breaking changes |
| II. Type Safety & Modern Standards | ✅ PASS | `contracts/slug-api.ts` defines strict TypeScript interfaces; no `any` types |
| III. Content Preservation | ✅ PASS | Design adapts to existing `content/blog/` structure; no content rewrites required |
| IV. Progressive Enhancement | ✅ PASS | Slug library independent of framework; works with Gatsby now, portable to Next.js |
| V. Deployment & Operations | ✅ PASS | `prebuild` npm script integration; JSON manifest is CI/CD friendly |

**Final Gate Result**: PASS - Design artifacts aligned with constitution principles.
