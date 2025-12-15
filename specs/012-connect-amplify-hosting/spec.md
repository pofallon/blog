# Feature Specification: Spec 012 – Connect AWS Amplify Hosting to the Next.js Migration

**Feature Branch**: `012-connect-amplify-hosting`  
**Created**: 2025-12-15  
**Status**: Draft  
**Input**: User description: "SPEC ID: 012. Feature: Connect AWS Amplify hosting to the Next.js migration branch and validate a successful build and deployment. Requirements: document required build settings, environment variables, and verification steps. Include known AWS Amplify hosting limitations to prevent accidental use of unsupported features. Deliver a comprehensive feature specification aligned with Spec ID 012 without auto-incrementing the identifier."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Hook the migration branch into Amplify hosting (Priority: P1)

As a DevOps engineer, I can connect the Next.js migration branch to AWS Amplify Hosting so every commit automatically builds and deploys to a dedicated preview/prod environment.

**Why this priority**: Without a reliable branch-to-hosting connection, the migration cannot be validated end-to-end and blocks the eventual cutover.

**Independent Test**: Push a commit to the migration branch and confirm Amplify starts, completes, and surfaces the build as deployable without manual intervention.

**Acceptance Scenarios**:

1. **Given** the Amplify app is configured and the migration branch exists, **When** the branch is connected with the agreed build spec, **Then** every new commit triggers a build tied to the originating commit SHA within 5 minutes.  
2. **Given** a build completes, **When** Amplify publishes the deployment, **Then** the environment URL reflects the latest commit metadata (branch, commit, timestamp) so stakeholders can verify what was deployed.

---

### User Story 2 - Expose build settings and environment contract (Priority: P2)

As a release manager, I can see a single source of truth for Amplify build commands, runtime versions, caching, and required environment variables (e.g., `YT_KEY`, `NEXT_PUBLIC_SITE_URL`) so I can audit and update them without code spelunking.

**Why this priority**: Clear documentation of build inputs prevents avoidable build failures and accelerates onboarding for engineers who need to change runtime settings or rotate secrets.

**Independent Test**: Review the configuration document and verify it lists every required setting with owner, default values, and validation steps that can be executed without accessing the codebase.

**Acceptance Scenarios**:

1. **Given** the documentation template, **When** the build settings matrix is filled in, **Then** it names each phase (install/build/post-build), the runtime versions (current Node.js LTS, package manager), cache toggles, and links to the Amplify console section where the value lives.  
2. **Given** the environment variable inventory, **When** a secret is rotated, **Then** the document specifies where to update it in Amplify (Backend → Environment variables) and how to confirm the build can still reach upstream services.

---

### User Story 3 - Validate deployments and guard against unsupported Amplify features (Priority: P3)

As a QA lead, I can run a repeatable verification script after each Amplify deployment, including checks for AWS Amplify Hosting limitations (e.g., no custom Next.js servers, limited Edge middleware), so unsupported patterns never reach production.

**Why this priority**: The migration succeeds only if stakeholders trust that each deployment was validated and that engineers avoid unsupported Next.js capabilities during implementation.

**Independent Test**: Execute the verification checklist on a fresh deployment and confirm each step (page rendering, API routes, ISR regeneration, image handling, analytics beacons) passes or produces actionable remediation guidance.

**Acceptance Scenarios**:

1. **Given** an Amplify deployment completes, **When** the verification checklist is run, **Then** all critical pages and API routes load without console errors and the run is logged with pass/fail status.  
2. **Given** an engineer proposes a feature that depends on an unsupported Amplify capability, **When** the limitations list is consulted, **Then** the feature is flagged with the recommended alternative (e.g., move workload to AWS Lambda or CloudFront function) before work begins.

### Edge Cases

- A build starts before all required environment variables are populated in Amplify, causing opaque failures—workflow must detect and block the deployment until variables are present.  
- Amplify is accidentally pointed at the default branch instead of the migration branch, resulting in the wrong site being published—documentation must include branch verification steps.  
- A Next.js feature that depends on unsupported Amplify capabilities (e.g., custom Node server, WebSocket streaming, experimental App Router edge routes) slips through code review—limitations list must explicitly disallow these patterns.  
- Third-party API quotas (e.g., YouTube Data API tied to `YT_KEY`) are exceeded because Amplify replays builds when retries occur—verification must confirm idempotent use of external services.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The AWS Amplify app MUST connect the `Next.js migration` branch to a dedicated environment (preview + production) and automatically trigger builds on every push.  
- **FR-002**: The branch connection MUST include an explicit build specification capturing each phase (dependency install, build, post-build verification), the package manager version, Next.js cache directories to persist, and any post-build validation hooks.  
- **FR-003**: A build settings document MUST enumerate runtime versions (current Node.js LTS, package manager), Amplify build image, artifact base directory, and cache policies, with links/screenshots of the Amplify console settings.  
- **FR-004**: An environment variable inventory MUST list each required variable (`YT_KEY`, `NEXT_PUBLIC_SITE_URL`, analytics IDs, future CMS tokens) with purpose, value owner, scope (build-time vs runtime), and rotation procedure, and MUST be stored with least-privilege access.  
- **FR-005**: The pipeline MUST block deployments when any required environment variable or secret is missing, emitting a human-readable error before build resources are exhausted.  
- **FR-006**: Every Amplify build MUST capture metadata (commit SHA, branch, build duration, artifact URL) and store it in the deployment notes so stakeholders can audit what was released.  
- **FR-007**: A verification checklist MUST be executed after each deployment, covering static pages, dynamic routes, API endpoints, ISR revalidation, analytics beacons, and accessibility smoke tests, with pass/fail logged.  
- **FR-008**: The team MUST document AWS Amplify hosting limitations relevant to Next.js (no custom Node server, limited Edge middleware, no WebSocket APIs, App Router experimental features unsupported) and link to mitigations or alternatives.  
- **FR-009**: A rollback/runbook MUST describe how to promote the last known-good deployment in Amplify, including prerequisite approvals and expected time-to-restore (<15 minutes).  
- **FR-010**: The documentation set MUST outline verification steps for environment alignment (correct branch, domain, SSL status) before promoting any Amplify deployment to production.

### Key Entities *(include if feature involves data)*

- **Next.js Migration Branch**: Source of truth for the new Next.js implementation; attributes include repository URL, branch name, and required build commands.  
- **Amplify Hosting Environment**: AWS Amplify app plus branch environments; attributes include environment aliases (preview/prod), domain mappings, environment variables, and build logs.  
- **Deployment Verification Checklist**: Living document that tracks validation steps, responsible roles, timestamps, and pass/fail evidence for each deployment.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of commits to the Next.js migration branch trigger an Amplify build within 5 minutes and complete successfully in under 15 minutes.  
- **SC-002**: Two consecutive Amplify deployments complete without failures caused by missing or misconfigured environment variables.  
- **SC-003**: Post-deployment verification checklists document at least 10 critical checks per release with zero blocking defects escaping to production during the first migration launch window.  
- **SC-004**: The documented AWS Amplify limitations prevent unsupported feature requests from entering the backlog for 90 days post-publication (i.e., zero Jira tickets rejected for violating the guardrails).

## AWS Amplify Hosting Limitations

- **No custom Next.js server**: Amplify supports the standard Next.js serverless runtime only; any requirement for custom Express/Node servers must be reworked into API routes or separate Lambda services.  
- **Edge middleware constraints**: Amplify currently runs middleware on AWS Lambda@Edge with limited Node APIs; complex streaming or stateful edge logic must be handled via CloudFront Functions or regional Lambda.  
- **WebSocket and long-lived connections unsupported**: Amplify-hosted Next.js API routes time out at 30 seconds and do not sustain WebSocket upgrades; interactive features must leverage AWS AppSync or API Gateway WebSocket endpoints.  
- **App Router experimental features**: Next.js App Router streaming, Route Handlers, and experimental server actions are not yet GA on Amplify; engineers must avoid these until AWS documents official support.  
- **Image optimization guardrails**: Only domains declared in `next.config.js` are optimized; remote loaders beyond Amplify’s CDN are unsupported and must fall back to static assets.

## Assumptions

1. The Next.js migration branch already compiles locally with the agreed Node.js LTS runtime and package manager.  
2. AWS Amplify Hosting is the chosen deployment target through general availability of the Next.js site.  
3. `YT_KEY` remains the only external API secret today; any additional CMS or analytics credentials discovered during migration will be appended to the inventory before launch.  
4. Stakeholders agree that documentation lives inside the repository under `specs/012-connect-amplify-hosting` and is version-controlled alongside code.  
5. Production domain cutover will be handled separately; this feature focuses on branch connection, build documentation, verifications, and limitation guardrails.
