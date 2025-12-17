# Data Model — Next.js Site Shell

## 1. SiteShellLayout
- **Fields**
  - `id`: string — constant identifier (`"site-shell"`) to reference the shared layout.
  - `brandName`: string — displayed in the header/logo; must be <= 40 characters for responsiveness.
  - `navigationLinks`: `NavigationLink[]` — ordered list rendered in header/footer.
  - `metadata`: `SiteMetadata` — site-wide title, description, og defaults (FR-007).
  - `footer`: `FooterContent` — copyright text, utility links, social links.
- **Relationships**
  - Has many `NavigationLink` records.
  - Provides layout slots that each `PlaceholderPage` consumes.
- **Validation Rules**
  - `navigationLinks` must contain at least the four required routes (`/`, `/blog`, `/projects`, `/merch`) and remain in sync across header/footer.
  - Metadata must include `title` and `description`; social image must be valid URL.
  - Footer content must include at least one utility link (e.g., Contact) for accessibility.
- **State Transitions**
  - Layout settings transition from `draft` → `active` when deployed; future states can layer theme overrides but remain immutable per release to avoid drift.

## 2. NavigationLink
- **Fields**
  - `label`: string — human-friendly text (Title Case).
  - `path`: string — absolute path (`/`, `/blog`, `/projects`, `/merch`).
  - `description`: string — optional text for aria labels/tooltips.
  - `order`: number — controls render ordering for both header and responsive menu.
  - `isPrimary`: boolean — marks items that should surface in condensed nav (mobile).
- **Relationships**
  - Belongs to `SiteShellLayout`.
- **Validation Rules**
  - `path` must be unique and part of the supported route set.
  - `order` must be sequential starting at 0 to guarantee deterministic rendering.
  - `label` ≤ 15 characters to prevent wrapping on small devices.
- **State Transitions**
  - Links can be `enabled` or `disabled`; disabled links still render but add aria-disabled and degrade to plain text if the destination route is not ready.

## 3. PlaceholderPage
- **Fields**
  - `slug`: string — matches the route segment (e.g., `blog`).
  - `title`: string — page heading displayed within layout slot.
  - `description`: string — short paragraph explaining upcoming content.
  - `layoutSlots`: array of slot definitions (`hero`, `callout`, `grid`) showing where migrated content will mount later.
  - `cta`: optional object with `label` and `href` to guide stakeholders.
- **Relationships**
  - Consumes the `main` slot provided by `SiteShellLayout`.
- **Validation Rules**
  - Must include at least one `layoutSlot` describing the future structure.
  - `slug` must correspond to a registered `NavigationLink.path`.
  - Copy must explicitly mention migration status (“coming soon”) per User Story 2.
- **State Transitions**
  - `status`: `placeholder` → `content-ready`; once real content arrives, the entity migrates to a proper data source but the shell should still handle the `placeholder` state gracefully.

## 4. SiteMetadata
- **Fields**
  - `title`: string — default browser title.
  - `description`: string — meta description reused by placeholders.
  - `ogImage`: string URL — shared social preview asset.
- **Relationships**
  - Embedded within `SiteShellLayout`.
- **Validation Rules**
  - Strings must be non-empty; `ogImage` must resolve under `/public` for Amplify compatibility.
- **State Transitions**
  - New revisions create versioned metadata; only one active version allowed to keep SEO consistent.

## 5. FooterContent
- **Fields**
  - `text`: string — copyright/brand line.
  - `links`: array of `{ label, href }` objects for global resources.
  - `social`: array for social handles (optional).
- **Relationships**
  - Embedded within `SiteShellLayout`.
- **Validation Rules**
  - External links must include `rel="noopener noreferrer"` and accessible labels.
- **State Transitions**
  - Follows same `draft` → `active` path as the overall layout; updates should remain infrequent to avoid audit drift.
