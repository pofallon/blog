# Implementation Plan: Next.js Site Shell

**Branch**: `002-nextjs-app-shell` | **Date**: 2025-12-15 | **Spec**: [/workspaces/blog/specs/002-nextjs-app-shell/spec.md](/workspaces/blog/specs/002-nextjs-app-shell/spec.md)
**Input**: Feature specification from `/specs/002-nextjs-app-shell/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Bootstrap a Next.js 14 App Router project using TypeScript and Tailwind CSS, implement a global layout (header, nav, footer), scaffold placeholder routes for `/`, `/blog`, `/projects`, `/merch`, and document a one-command local dev flow so the migration team can iterate on the shell before migrating content.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x (strict) on Next.js 14 App Router  
**Primary Dependencies**: Next.js 14, React 18, Tailwind CSS 3.x, PostCSS, ESLint, Prettier  
**Storage**: N/A (static shell, no data layer yet)  
**Testing**: Jest (`next/jest`) + React Testing Library; Playwright for e2e nav checks  
**Target Platform**: Local Node.js 18 LTS & AWS Amplify hosting  
**Project Type**: Web application (single Next.js project)  
**Performance Goals**: Route transitions under 2s on simulated 3G; dev environment spin-up <10 minutes (per SC-001/SC-002)  
**Constraints**: Must preserve MDX compatibility pathway, enforce TypeScript strict mode, support navigation without JS (progressive enhancement)  
**Scale/Scope**: Site shell covering 4 primary routes plus shared layout primitives to unblock future content migration

## Constitution Check (Pre-Design)

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Migration Integrity | ✅ | Plan keeps Gatsby content untouched while establishing a parallel Next.js shell; no existing URLs/assets are modified. |
| II. Type Safety & Modern Standards | ✅ | TypeScript strict mode, functional React components, and Next.js 14 App Router specified as hard requirements. |
| III. Content Preservation | ✅ | Placeholder shell defers actual MDX import but requires compatibility hooks so MDX files remain authoritative in future phases. |
| IV. Progressive Enhancement | ✅ | Navigation must work with `<a>` fallback and layout remains functional without client routing; phased delivery aligns with incremental principle. |
| V. Deployment & Operations | ✅ | Target runtime is Node 18 with AWS Amplify deployability; CI/CD scripting to follow repo norms in later tasks. |

## Project Structure

### Documentation (this feature)

```text
/workspaces/blog/specs/002-nextjs-app-shell/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
/workspaces/blog/apps/site-shell/
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── page.tsx
│   ├── blog/page.tsx
│   ├── projects/page.tsx
│   └── merch/page.tsx
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Navigation.tsx
├── lib/
│   └── navigation.ts
├── public/
│   └── assets/
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
└── package.json

/workspaces/blog/apps/site-shell/tests/
├── unit/
│   └── layout.test.tsx
└── e2e/
    └── navigation.spec.ts
```

**Structure Decision**: Single Next.js application under `/workspaces/blog/apps/site-shell` containing App Router assets plus colocated unit/e2e tests to satisfy shell requirements while isolating new code from the existing Gatsby site.

## Constitution Check (Post-Design)

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Migration Integrity | ✅ | Design keeps Gatsby content untouched; contracts operate under `/api/*` within the new Next app without altering legacy URLs. |
| II. Type Safety & Modern Standards | ✅ | Data model + contracts mandate TypeScript types, strict ESLint, and React 18 patterns; quickstart enforces `npm run test`/`build` with TS checks. |
| III. Content Preservation | ✅ | Placeholder model references future MDX ingestion and ensures slots remain compatible with existing content pipeline. |
| IV. Progressive Enhancement | ✅ | Navigation entity requires anchor fallbacks and Playwright tests will assert route changes without JS. |
| V. Deployment & Operations | ✅ | Quickstart + research outline Amplify build commands ensuring deployability stays within hosting principle. |

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
