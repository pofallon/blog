# Feature Specification: Deterministic Slug Preservation

**Feature Branch**: `004-preserve-slugs`  
**Created**: 2025-12-15  
**Status**: Draft  
**Input**: User description: "Implement a deterministic slug generation strategy that preserves existing Gatsby blog URLs derived from file paths. Provide a slug function plus automated verification (tests or a script) to confirm existing content paths map to the same slugs. Document required content folder structure to maintain URL stability. This is spec 004."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Preserve existing blog URLs (Priority: P1)

As the site maintainer, I need slug generation to always reproduce the URLs already indexed and shared so that historic blog links continue to work after we refactor content tooling.

**Why this priority**: Any regression here breaks SEO equity and referral traffic, so it is the most business-critical outcome.

**Independent Test**: Run the slug function across all current `content/blog` entries and confirm every computed slug matches the existing published URL list without manual adjustments.

**Acceptance Scenarios**:

1. **Given** the canonical list of published blog URLs, **When** the slug generator runs on every file under `content/blog`, **Then** each computed slug exactly matches its canonical URL.
2. **Given** a blog source file is renamed internally but remains within the documented folder hierarchy, **When** the slug generator runs, **Then** the resulting slug stays unchanged and matches the canonical list.

---

### User Story 2 - Author new posts with predictable slugs (Priority: P2)

As a content editor, I need clear folder-structure rules that map deterministically to the slug so I can create new posts and know the resulting URL before publishing.

**Why this priority**: Predictable slugs reduce editorial turnaround and prevent ad-hoc overrides when collaborating on campaigns.

**Independent Test**: Follow the documented folder template for a new post, run the slug preview command, and confirm the slug matches the path structure described in the documentation without editing code.

**Acceptance Scenarios**:

1. **Given** a new post located at `content/blog/{collection}/{post}/index.md`, **When** the slug function runs, **Then** the slug is `/{collection}/{post}/`.
2. **Given** the published normalization rules for allowable characters, **When** an editor uses spaces, uppercase letters, or special characters in folder names, **Then** the slug output reflects the documented lowercase, hyphenated, ASCII-safe format so the resulting URL is predictable.

---

### User Story 3 - Automate slug regression checks (Priority: P3)

As a release engineer, I need an automated verification command that fails builds when any slug deviates from the canonical mapping so we can catch breaking changes before deploy.

**Why this priority**: Automated enforcement prevents manual review overhead and ensures consistency in CI/CD.

**Independent Test**: Run the verification script in isolation; it should produce a report summarizing matches versus mismatches and exit non-zero if discrepancies exist.

**Acceptance Scenarios**:

1. **Given** the canonical slug manifest, **When** the verification command runs, **Then** it reports success with counts of scanned files and exits zero if all slugs match.
2. **Given** a simulated mismatch (for example, intentionally rename a folder), **When** the verification command runs, **Then** it highlights the specific file/slug differences and exits non-zero to block the release.

---

### Edge Cases

- Two posts that share the same slug candidate because of identical folder names in different branches of the hierarchy.
- Source directories that include uppercase, accented, or non-Latin characters that must be normalized consistently.
- Nested posts deeper than the documented `{collection}/{post}` depth (e.g., `campaign/year/post`) that should either be rejected or flattened deterministically.
- Legacy posts missing an `index.md` or containing multiple markdown files per folder.
- Files nested outside `content/blog` that should be ignored by slug tooling.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The platform MUST expose a single slug generation function that accepts a content file’s relative path and returns the normalized slug string shared by all build and verification flows.
- **FR-002**: The slug generator MUST derive slugs solely from the documented folder structure beneath `content/blog`, applying the published normalization rules (lowercase, hyphenation, ASCII-safe replacements) so that deterministic formatting is guaranteed.
- **FR-003**: The slug generator MUST reproduce every currently published blog URL by comparing its output against a canonical `source-path → slug` manifest created from the pre-change repository state.
- **FR-004**: The system MUST provide an automated verification command or test that enumerates all blog entries, invokes the slug function, compares the results to the canonical manifest, and fails with actionable diffs when mismatches appear.
- **FR-005**: The team MUST publish documentation that defines the required content folder structure, naming conventions, and steps for previewing a slug before publishing a post.
- **FR-006**: The workflow MUST document and automate the process for intentionally updating the canonical manifest (e.g., via an explicit “approve slug changes” command) so that every change is reviewed and version-controlled.

### Key Entities *(include if feature involves data)*

- **Content Source File**: Represents a markdown entry under `content/blog`, identified by its relative folder path and optional frontmatter slug metadata; inputs to the slug function.
- **Slug Manifest Entry**: Records the authoritative mapping of `relative_path`, `slug`, and `status` (match/mismatch) for regression checking.
- **Verification Report**: Summarizes scan results, including counts of files processed, mismatches detected, and guidance for remediation, and is consumed by CI/CD and maintainers.

### Assumptions

- The current set of published Gatsby blog URLs captured from production is accurate and can be treated as the canonical baseline.
- All publishable blog content continues to live under `content/blog`, and other folders (e.g., `content/assets`) remain out of scope for slug generation.
- Editors are willing to adopt the documented folder template to gain deterministic slugs, and deviations will be flagged as build errors rather than silently corrected.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Verification reports show 0 slug mismatches across 100% of existing blog posts prior to the first deployment of the new slug function.
- **SC-002**: Running the automated slug verification command against the full content set completes in under 60 seconds, enabling it to run in every CI pipeline execution.
- **SC-003**: During the first sprint after launch, at least 95% of new blog posts created with the documented folder template require zero manual slug overrides, as confirmed by editorial review.
- **SC-004**: The content folder structure documentation is published in the repository and acknowledged by the content lead, and all new editors complete a slug workflow walkthrough during onboarding (tracked via onboarding checklist sign-off).
