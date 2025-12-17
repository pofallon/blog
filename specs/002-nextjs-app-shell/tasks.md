# Tasks: Next.js Site Shell

**Input**: `/workspaces/blog/specs/002-nextjs-app-shell/plan.md`, `/workspaces/blog/specs/002-nextjs-app-shell/spec.md`, `/workspaces/blog/specs/002-nextjs-app-shell/data-model.md`, `/workspaces/blog/specs/002-nextjs-app-shell/research.md`, `/workspaces/blog/specs/002-nextjs-app-shell/quickstart.md`, `/workspaces/blog/specs/002-nextjs-app-shell/contracts/site-shell.openapi.yaml`

**Prerequisites**: Phase 0–1 design artifacts listed above

**Tests**: Jest (`next/jest` + React Testing Library) and Playwright (per research.md)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Bootstrap the Next.js workspace so later phases can build on a consistent structure.

- [X] T001 Create the Next.js 14 App Router project in `/workspaces/blog/apps/site-shell` via `create-next-app --ts --tailwind` to generate `/workspaces/blog/apps/site-shell/package.json` and `/workspaces/blog/apps/site-shell/app/`.
- [X] T002 Establish the directory skeleton (`/components`, `/lib`, `/tests/unit`, `/tests/e2e`, `/public/assets`) under `/workspaces/blog/apps/site-shell` per `/workspaces/blog/specs/002-nextjs-app-shell/plan.md`.
- [X] T003 Register `/workspaces/blog/apps/site-shell` as a workspace in `/workspaces/blog/package.json` so repo-level tooling can run the new app.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Configure cross-cutting tooling (TS, linting, styling, testing) required by every user story.  
**Checkpoint**: Foundation ready—user story phases can start once T004–T010 succeed.

- [X] T004 Enable strict TypeScript compiler options, path aliases, and Next.js App Router configs inside `/workspaces/blog/apps/site-shell/tsconfig.json`.
- [X] T005 [P] Configure ESLint with `next/core-web-vitals` and `@typescript-eslint` rules in `/workspaces/blog/apps/site-shell/eslint.config.mjs`, plus add the `npm run lint` script reference comment.
- [X] T006 [P] Add Prettier and `prettier-plugin-tailwindcss` settings in `/workspaces/blog/apps/site-shell/.prettierrc.cjs` and wire formatting to `package.json` scripts.
- [X] T007 Wire Tailwind/PostCSS by updating `/workspaces/blog/apps/site-shell/tailwind.config.ts`, `/workspaces/blog/apps/site-shell/postcss.config.js`, and importing utilities via `/workspaces/blog/apps/site-shell/app/globals.css`.
- [X] T008 [P] Define `SiteShellLayout`, `NavigationLink`, `PlaceholderPage`, `SiteMetadata`, and `FooterContent` types mirroring data-model.md inside `/workspaces/blog/apps/site-shell/lib/types.ts`.
- [X] T009 Establish Jest + React Testing Library via `/workspaces/blog/apps/site-shell/jest.config.ts` and `/workspaces/blog/apps/site-shell/tests/setupTests.ts` using `next/jest`.
- [X] T010 [P] Configure Playwright base URL, projects, and CI hooks in `/workspaces/blog/apps/site-shell/playwright.config.ts` for navigation e2e tests.

---

## Phase 3: User Story 1 – Consistent shell across sections (Priority: P1) 🎯 MVP

**Goal**: Deliver a persistent header, navigation, and footer so every primary route shares the same shell (FR-001, FR-003, FR-007).  
**Independent Test**: Run `npm run dev` in `/workspaces/blog/apps/site-shell` and use `/workspaces/blog/apps/site-shell/tests/e2e/navigation.spec.ts` to confirm header/nav/footer remain unchanged while switching between `/`, `/blog`, `/projects`, `/merch`.

### Tests for User Story 1

- [X] T011 [P] [US1] Add layout persistence unit tests in `/workspaces/blog/apps/site-shell/tests/unit/layout.test.tsx` asserting global header/nav/footer render for each route.
- [X] T012 [P] [US1] Create navigation Playwright coverage in `/workspaces/blog/apps/site-shell/tests/e2e/navigation.spec.ts` (including `context.grantPermissions([])` to simulate JS-disabled navigation fallback).

### Implementation for User Story 1

- [X] T013 [P] [US1] Implement the typed navigation registry in `/workspaces/blog/apps/site-shell/lib/navigation.ts` returning ordered `NavigationLink` data for header/footer.
- [X] T014 [P] [US1] Build an accessible navigation component with `<noscript>` fallback inside `/workspaces/blog/apps/site-shell/components/Navigation.tsx`.
- [X] T015 [P] [US1] Implement the header shell (brand lockup + navigation invocation) in `/workspaces/blog/apps/site-shell/components/Header.tsx`.
- [X] T016 [P] [US1] Implement the shared footer (utility links + social copy) in `/workspaces/blog/apps/site-shell/components/Footer.tsx`.
- [X] T017 [US1] Compose the root layout with metadata defaults and global slots in `/workspaces/blog/apps/site-shell/app/layout.tsx`, importing `globals.css` and mounting Header/Navigation/Footer.
- [X] T018 [US1] Implement the `/api/navigation` handler at `/workspaces/blog/apps/site-shell/app/api/navigation/route.ts` returning `NavigationLinksResponse` per `/workspaces/blog/specs/002-nextjs-app-shell/contracts/site-shell.openapi.yaml`.
- [X] T019 [US1] Implement the `/api/metadata` handler at `/workspaces/blog/apps/site-shell/app/api/metadata/route.ts` returning `SiteMetadata`.

**Parallel Execution Example (US1)**  
- Developer A: T013 + T014 in `/workspaces/blog/apps/site-shell/lib/navigation.ts` and `/workspaces/blog/apps/site-shell/components/Navigation.tsx`.  
- Developer B: T015 + T016 in `/workspaces/blog/apps/site-shell/components/Header.tsx` and `/workspaces/blog/apps/site-shell/components/Footer.tsx`.  
- Developer C: T011 + T012 in `/workspaces/blog/apps/site-shell/tests/**` while Developer D handles T017–T019 in `/workspaces/blog/apps/site-shell/app/**`.

---

## Phase 4: User Story 2 – Placeholder messaging per route (Priority: P2)

**Goal**: Display descriptive placeholder content for each primary route so editors know where migration copy belongs (FR-004).  
**Independent Test**: Hit `/`, `/blog`, `/projects`, `/merch`, and `/not-found` while running `npm run dev` to confirm placeholders show status text and CTA guidance; unit tests in `/workspaces/blog/apps/site-shell/tests/unit/placeholders.test.tsx` should pass.

### Tests for User Story 2

- [X] T020 [P] [US2] Create placeholder rendering tests in `/workspaces/blog/apps/site-shell/tests/unit/placeholders.test.tsx` verifying titles/descriptions per slug.

### Implementation for User Story 2

- [X] T021 [P] [US2] Build the placeholder registry (slug, title, description, layoutSlots, CTA) in `/workspaces/blog/apps/site-shell/lib/placeholders.ts`.
- [X] T022 [US2] Implement `/api/placeholders/[slug]` at `/workspaces/blog/apps/site-shell/app/api/placeholders/[slug]/route.ts` with 200/404 responses matching the OpenAPI contract.
- [X] T023 [P] [US2] Implement the Home and Blog placeholder pages in `/workspaces/blog/apps/site-shell/app/page.tsx` and `/workspaces/blog/apps/site-shell/app/blog/page.tsx` that consume the registry.
- [X] T024 [P] [US2] Implement the Projects and Merch placeholder pages in `/workspaces/blog/apps/site-shell/app/projects/page.tsx` and `/workspaces/blog/apps/site-shell/app/merch/page.tsx`.
- [X] T025 [US2] Create a branded not-found experience under `/workspaces/blog/apps/site-shell/app/not-found.tsx` that links back to valid placeholder routes.

**Parallel Execution Example (US2)**  
- Developer A: T021 in `/workspaces/blog/apps/site-shell/lib/placeholders.ts`.  
- Developer B: T023 + T024 across `/workspaces/blog/apps/site-shell/app/*/page.tsx`.  
- Developer C: T020 and T022 inside `/workspaces/blog/apps/site-shell/tests/unit/placeholders.test.tsx` and `/workspaces/blog/apps/site-shell/app/api/placeholders/[slug]/route.ts`.

---

## Phase 5: User Story 3 – Fast local dev spin-up (Priority: P3)

**Goal**: Provide a one-command workflow for devs to launch, test, and build the shell with clear documentation (FR-006, SC-001).  
**Independent Test**: From a clean checkout, run `npm install` then `npm run dev`/`npm run test`/`npm run test:e2e`/`npm run build` inside `/workspaces/blog/apps/site-shell` and confirm README + quickstart instructions cover the flow and troubleshooting.

### Implementation for User Story 3

- [X] T026 [P] [US3] Define `dev`, `build`, `lint`, `test`, and `test:e2e` scripts plus Playwright runner hooks in `/workspaces/blog/apps/site-shell/package.json`.
- [X] T027 [P] [US3] Document the single-command workflow, ports, and verification checklist inside `/workspaces/blog/apps/site-shell/README.md`.
- [X] T028 [US3] Update `/workspaces/blog/specs/002-nextjs-app-shell/quickstart.md` with final prerequisites, commands, and expected output logs for `npm run dev/test/test:e2e/build`.
- [X] T029 [US3] Execute `npm run dev`, `npm run test`, `npm run test:e2e`, and `npm run build` within `/workspaces/blog/apps/site-shell`, capturing timing + troubleshooting notes inside the README Verification section.

**Parallel Execution Example (US3)**  
- Developer A: T026 in `/workspaces/blog/apps/site-shell/package.json`.  
- Developer B: T027 documenting `/workspaces/blog/apps/site-shell/README.md`.  
- Developer C: T028 updating `/workspaces/blog/specs/002-nextjs-app-shell/quickstart.md`, followed by T029 validation runs.

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Harden responsive behavior, documentation, and maintenance tasks spanning multiple stories.  
**Checkpoint**: Execute after US1–US3 are complete.

- [X] T030 [P] Tune responsive breakpoints and mobile navigation fallback styles in `/workspaces/blog/apps/site-shell/app/globals.css` and `/workspaces/blog/apps/site-shell/components/Navigation.tsx`.
- [X] T031 Add deployment/Amplify notes and monitoring TODOs to `/workspaces/blog/apps/site-shell/README.md` and `/workspaces/blog/specs/002-nextjs-app-shell/research.md`.
- [X] T032 [P] Run `npm run lint` and `npm run format` inside `/workspaces/blog/apps/site-shell`, documenting the outputs in the README Maintenance section to close the polishing pass.

---

## Dependencies & Execution Order

1. **Setup (Phase 1)** → completes scaffolding so tooling can install.  
2. **Foundational (Phase 2)** → blocks all user stories; delivers TS, lint, styling, and testing infrastructure.  
3. **User Story 1 (Phase 3)** → first functional increment (MVP) delivering the global shell; US2 and US3 depend on its layout + data structures.  
4. **User Story 2 (Phase 4)** → relies on navigation + layout from US1 but otherwise independent.  
5. **User Story 3 (Phase 5)** → depends on scripts and tests existing from prior phases but focuses on documentation + automation; can run alongside US2 once Foundational is done.  
6. **Polish** → last, after all prioritized stories finish.

Graph: `Setup → Foundational → {US1 → US2, US3}` with `Polish` depending on the completion of US1–US3.

---

## Parallel Execution Opportunities

- Tasks marked [P] within a phase touch different files, enabling safe concurrency.  
- After Phase 2, US1, US2, and US3 teams can work in parallel so long as shared files (`app/layout.tsx`, global styles) are coordinated.  
- Testing tasks (T011, T012, T020) can execute concurrently with implementation once contracts are stubbed.  
- E2E (Playwright) runs may execute in parallel with unit tests because they use different npm scripts.

---

## Implementation Strategy

### MVP First
1. Complete Phase 1 Setup.  
2. Finish Phase 2 Foundational.  
3. Deliver Phase 3 (US1) and run `npm run test` + `npm run test:e2e` to verify the shell.  
4. Demo the shell as the MVP before proceeding.

### Incremental Delivery
1. Add US2 placeholders once US1 passes tests, then validate routes individually.  
2. Layer US3 documentation/scripts and confirm all commands succeed.  
3. Apply the Polish phase to finalize responsive + documentation work.

### Parallel Team Strategy
1. One pair handles Foundational tooling while another prepares US1 components.  
2. After US1’s layout is stable, allocate separate owners for US2 placeholders and US3 dev-experience tasks.  
3. Reserve a shared timebox for the Polish phase to run cross-cutting checks.
