# Data Model: MDX Content Pipeline

**Feature**: 003-add-mdx-support  
**Date**: 2025-12-15  
**Status**: Complete

## Entities

### 1. FrontmatterMetadata

Structured data object extracted from MDX file frontmatter. Represents the typed metadata contract required by FR-001.

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `title` | `string` | Yes | Non-empty, trimmed | Display title for the post |
| `date` | `string` | Yes | ISO date format `YYYY-MM-DD` | Publication date |
| `description` | `string` | Yes | Non-empty, max 200 chars | Plain-text summary for previews |
| `image` | `ImageMeta \| undefined` | No | Valid URL if present | Optional hero image |

#### ImageMeta (nested type)

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `url` | `string` | Yes | Valid URL format | Image source URL |
| `alt` | `string` | Yes | Non-empty | Accessibility alt text |

**Validation Rules**:
- `title`: Must be non-empty string after trimming whitespace
- `date`: Must match regex `/^\d{4}-\d{2}-\d{2}$/` and be a valid calendar date
- `description`: Must be non-empty, truncated or warned if >200 characters
- `image.url`: Must be valid URL (http/https or relative path)
- `image.alt`: Must be non-empty if image is provided

---

### 2. MDXEntry

Represents a complete content file combining parsed frontmatter with compiled MDX body and derived slug.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `slug` | `string` | Yes | Route identifier derived from filename |
| `metadata` | `FrontmatterMetadata` | Yes | Validated frontmatter data |
| `content` | `string` | Yes | Raw MDX content (body after frontmatter) |
| `filePath` | `string` | Yes | Absolute path to source file (for error reporting) |

**Derived Fields**:
- `slug`: Computed from filename by stripping `.mdx` extension
  - Example: `demo-mdx.mdx` → `demo-mdx`

**State Transitions**: None (read-only at build time)

---

### 3. ContentDirectory

Logical representation of the `/content/posts/` folder. Not a persisted entity but a conceptual boundary.

| Property | Value |
|----------|-------|
| Path | `/content/posts/` (relative to monorepo root) |
| Structure | Flat (no subdirectories) |
| File Pattern | `*.mdx` |
| Scan Behavior | Recursive: No (flat only) |

---

## TypeScript Type Definitions

```typescript
// lib/mdx/types.ts

/**
 * Optional image metadata for MDX posts
 */
export type ImageMeta = {
  url: string;
  alt: string;
};

/**
 * Frontmatter metadata contract for MDX entries
 * All MDX files must provide these fields (image is optional)
 */
export type FrontmatterMetadata = {
  title: string;
  date: string; // YYYY-MM-DD format
  description: string;
  image?: ImageMeta;
};

/**
 * Complete MDX entry with metadata and content
 */
export type MDXEntry = {
  slug: string;
  metadata: FrontmatterMetadata;
  content: string;
  filePath: string;
};

/**
 * Validation result for a single MDX file
 */
export type ValidationResult = {
  valid: boolean;
  filePath: string;
  errors: string[];
  warnings: string[];
};

/**
 * Build summary for MDX processing
 */
export type MDXBuildSummary = {
  totalFiles: number;
  validFiles: number;
  invalidFiles: number;
  warnings: string[];
  processedSlugs: string[];
};
```

---

## Zod Schema Definition

```typescript
// lib/mdx/validator.ts

import { z } from 'zod';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const ImageMetaSchema = z.object({
  url: z.string().url('Image URL must be a valid URL'),
  alt: z.string().min(1, 'Image alt text is required'),
});

export const FrontmatterSchema = z.object({
  title: z.string().min(1, 'Title is required').transform(s => s.trim()),
  date: z.string()
    .regex(dateRegex, 'Date must be in YYYY-MM-DD format')
    .refine((val) => !isNaN(Date.parse(val)), 'Date must be a valid calendar date'),
  description: z.string()
    .min(1, 'Description is required')
    .max(200, 'Description should not exceed 200 characters'),
  image: ImageMetaSchema.optional(),
});

export type FrontmatterInput = z.input<typeof FrontmatterSchema>;
export type FrontmatterOutput = z.output<typeof FrontmatterSchema>;
```

---

## MDX Component Whitelist

Per the edge case requirement, MDX files may only use components from an explicit whitelist. Unrecognized components render as escaped text with a build-time warning.

**Initial Whitelist** (empty for demo phase):

```typescript
// lib/mdx/components.ts

/**
 * Whitelist of approved MDX components.
 * Add components here to make them available in MDX files.
 * Unrecognized components will render as text with a warning.
 */
export const mdxComponents: Record<string, React.ComponentType<unknown>> = {
  // No custom components for initial demo phase
  // Example future additions:
  // Callout: CalloutComponent,
  // CodeBlock: CodeBlockComponent,
};
```

**Adding New Components**: To add a component to the whitelist, import it and add an entry to `mdxComponents`. The key becomes the tag name available in MDX files.

---

## Entity Relationships

```
┌─────────────────────┐
│  ContentDirectory   │
│  /content/posts/    │
└──────────┬──────────┘
           │ contains (1:N)
           ▼
┌─────────────────────┐
│     MDXEntry        │
│  - slug             │
│  - content          │
│  - filePath         │
└──────────┬──────────┘
           │ has (1:1)
           ▼
┌─────────────────────┐
│ FrontmatterMetadata │
│  - title            │
│  - date             │
│  - description      │
│  - image?           │
└──────────┬──────────┘
           │ may have (0:1)
           ▼
┌─────────────────────┐
│     ImageMeta       │
│  - url              │
│  - alt              │
└─────────────────────┘
```

---

## Validation Error Messages

Per FR-002, validation errors must be actionable with file path and field name:

| Error Condition | Message Template |
|-----------------|------------------|
| Missing title | `[{filePath}] Missing required field: title` |
| Missing date | `[{filePath}] Missing required field: date` |
| Invalid date format | `[{filePath}] Invalid date format: expected YYYY-MM-DD, got "{value}"` |
| Invalid date value | `[{filePath}] Invalid date: "{value}" is not a valid calendar date` |
| Missing description | `[{filePath}] Missing required field: description` |
| Description too long | `[{filePath}] Warning: description exceeds 200 characters` |
| Missing image.alt | `[{filePath}] Image alt text is required when image is provided` |
| Invalid image.url | `[{filePath}] Image URL must be a valid URL` |
| Duplicate slug | `[Build Error] Duplicate slug "{slug}" found in: {file1}, {file2}` |
