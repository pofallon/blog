# Data Model: Blog Image Handling

**Feature**: 007-add-image-handling  
**Date**: 2025-12-17  
**Spec**: [spec.md](./spec.md)

## Entity Overview

```
┌─────────────────────┐     ┌─────────────────────┐
│  BlogPostFrontmatter │────►│    HeroImageMeta    │
│                     │     │                     │
│  - title            │     │  - src              │
│  - date             │     │  - alt              │
│  - description      │     │  - caption?         │
│  - hero?            │     │  - focalPoint?      │
└─────────────────────┘     └─────────────────────┘
         │
         │ references
         ▼
┌─────────────────────┐     ┌─────────────────────┐
│     ImageAsset      │     │  InlineImageProps   │
│                     │     │                     │
│  - filePath         │     │  - src              │
│  - slug (owner)     │     │  - alt              │
│  - type (hero/inline)│    │  - caption?         │
│  - width            │     │  - width?           │
│  - height           │     │  - height?          │
└─────────────────────┘     └─────────────────────┘
```

## Entities

### 1. HeroImageMeta

Hero image configuration embedded in post frontmatter.

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `src` | string | ✓ | Non-empty, valid path | Relative path from `content/images/<slug>/` |
| `alt` | string | ✓* | Warn if empty | Accessibility description (* warn-only per FR-005) |
| `caption` | string | - | Max 200 chars | Display caption/credit |
| `focalPoint` | string | - | CSS object-position value | Focal point for responsive cropping |

**Validation Rules**:
- `src` must resolve to existing file in `content/images/<slug>/`
- Build warns if `alt` is empty but continues (FR-005)
- `focalPoint` defaults to `"center"` if omitted

**State**: Static (set at content authoring time)

### 2. InlineImageProps

Props for the `<Image>` MDX component.

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `src` | string | ✓ | Non-empty, valid path | Relative path from `content/images/<slug>/` |
| `alt` | string | ✓* | Warn if empty | Accessibility description |
| `caption` | string | - | Max 200 chars | Optional caption below image |
| `width` | number | - | Positive integer | Override width (derived if omitted) |
| `height` | number | - | Positive integer | Override height (derived if omitted) |

**Validation Rules**:
- `src` must resolve to existing file
- Dimensions derived from image file if not provided
- Build warns on missing `alt` (FR-005)

### 3. ImageAsset

Physical image file tracked during build.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `filePath` | string | ✓ | Absolute path to image file |
| `slug` | string | ✓ | Owning post slug |
| `type` | `'hero' \| 'inline'` | ✓ | Usage context |
| `width` | number | ✓ | Image width in pixels |
| `height` | number | ✓ | Image height in pixels |
| `format` | string | ✓ | File format (jpg, png, webp, gif) |
| `sizeBytes` | number | ✓ | File size for threshold checking |

**Validation Rules**:
- Supported formats: jpg, jpeg, png, webp, gif, avif
- Size threshold: warn if > 500KB before optimization
- Dimension threshold: warn if > 2000px on any axis

### 4. ProcessedHeroImage

Processed hero image ready for rendering (extends existing `ProcessedImage`).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `src` | string | ✓ | Optimized image path/URL |
| `width` | number | ✓ | Display width |
| `height` | number | ✓ | Display height |
| `alt` | string | ✓ | Accessibility text |
| `blurDataURL` | string | - | Base64 blur placeholder |
| `caption` | string | - | Display caption |
| `focalPoint` | string | - | CSS object-position value |

### 5. ImageValidationResult

Build-time validation result for image references.

| Field | Type | Description |
|-------|------|-------------|
| `valid` | boolean | Overall validation status |
| `filePath` | string | Source file being validated |
| `errors` | string[] | Blocking issues (missing files) |
| `warnings` | string[] | Non-blocking issues (missing alt, oversized) |
| `assets` | ImageAsset[] | Discovered image assets |

## TypeScript Definitions

```typescript
// lib/mdx/image-types.ts

/**
 * Hero image metadata parsed from frontmatter
 */
export interface HeroImageMeta {
  /** Relative path within content/images/<slug>/ */
  src: string;
  /** Accessibility description (required, warn if empty) */
  alt: string;
  /** Optional display caption or credit */
  caption?: string;
  /** CSS object-position value for responsive cropping */
  focalPoint?: string;
}

/**
 * Props for MDX <Image> component
 */
export interface InlineImageProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

/**
 * Physical image asset tracked during build
 */
export interface ImageAsset {
  filePath: string;
  slug: string;
  type: 'hero' | 'inline';
  width: number;
  height: number;
  format: string;
  sizeBytes: number;
}

/**
 * Processed hero image ready for rendering
 */
export interface ProcessedHeroImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  blurDataURL?: string;
  caption?: string;
  focalPoint?: string;
}

/**
 * Image validation result
 */
export interface ImageValidationResult {
  valid: boolean;
  filePath: string;
  errors: string[];
  warnings: string[];
  assets: ImageAsset[];
}
```

## Zod Schemas

```typescript
// lib/mdx/image-schemas.ts
import { z } from 'zod';

export const HeroImageMetaSchema = z.object({
  src: z.string().min(1, 'Hero image src is required'),
  alt: z.string().default(''),
  caption: z.string().max(200).optional(),
  focalPoint: z.string().optional().default('center'),
});

export const InlineImagePropsSchema = z.object({
  src: z.string().min(1, 'Image src is required'),
  alt: z.string().default(''),
  caption: z.string().max(200).optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
});

// Extended frontmatter schema with hero
export const BlogPostFrontmatterWithHeroSchema = z.object({
  title: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z.string().optional(),
  hero: HeroImageMetaSchema.optional(),
});
```

## Frontmatter Example

```yaml
---
title: "Building with Images"
date: "2025-12-17"
description: "How to add images to your blog posts"
hero:
  src: "hero.jpg"
  alt: "A beautiful landscape photograph"
  caption: "Photo by Jane Doe on Unsplash"
  focalPoint: "center top"
---
```

## Directory Structure

```
content/
├── images/
│   ├── my-first-post/
│   │   ├── hero.jpg           # Hero image
│   │   ├── screenshot-1.png   # Inline image
│   │   └── diagram.svg        # Inline image
│   └── another-post/
│       └── hero.webp
└── blog/
    ├── my-first-post/
    │   └── index.mdx
    └── another-post/
        └── index.mdx
```

## State Transitions

Images are static assets with no runtime state changes. Build-time states:

```
[Raw File] → [Validated] → [Optimized] → [Served]
     │            │              │
     └─ Error ────┴── Warning ───┴── Build output
```

| State | Description |
|-------|-------------|
| Raw File | Image exists in `content/images/<slug>/` |
| Validated | File exists, format supported, dimensions/size checked |
| Optimized | Next.js generates responsive variants at build/request time |
| Served | Image delivered to browser via optimized srcset |

## Relationships

```
BlogPost (1) ──────► (0..1) HeroImageMeta
    │
    └── content ────► (0..*) InlineImageProps
                              │
                              ▼
                    ImageAsset (filesystem)
```

- A post has zero or one hero image
- A post has zero or more inline images
- All images for a post live in `content/images/<post-slug>/`
- Slug linkage enforces ownership and prevents cross-post collisions
