# SEO Metadata Data Model

**Feature**: 009-seo-metadata  
**Date**: 2025-12-17  
**Phase**: 1 - Design

## Entity Definitions

### GlobalSEOConfig

Centralized SEO configuration for site-wide defaults (FR-001).

```typescript
/**
 * Global SEO configuration for site-wide defaults
 * Location: lib/seo/config.ts
 */
interface GlobalSEOConfig {
  /** Site name for og:site_name */
  siteName: string;
  
  /** Default title template with %s placeholder for page title */
  titleTemplate: string;
  
  /** Fallback title when page title is missing */
  defaultTitle: string;
  
  /** Default meta description for pages without overrides */
  defaultDescription: string;
  
  /** Canonical host URL (no trailing slash) */
  canonicalHost: string;
  
  /** Default share image path (relative to public/) */
  defaultShareImage: string;
  
  /** Site locale (e.g., 'en_US') */
  locale: string;
  
  /** Allowed origins for share image URLs */
  allowedImageOrigins: string[];
  
  /** Twitter handle without @ prefix (optional) */
  twitterHandle?: string;
}
```

**Source**: Environment variables and `lib/seo/config.ts`  
**Example**:
```typescript
const globalSEOConfig: GlobalSEOConfig = {
  siteName: 'Get2Know Labs',
  titleTemplate: '%s | Get2Know Labs',
  defaultTitle: 'Get2Know Labs — Site Shell',
  defaultDescription: 'A persistent navigation shell...',
  canonicalHost: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://get2know.io',
  defaultShareImage: '/assets/site-shell-og.svg',
  locale: 'en_US',
  allowedImageOrigins: ['https://get2know.io', 'https://cdn.get2know.io'],
  twitterHandle: undefined,
};
```

---

### PageMetadataOverride

Optional override object for page-specific metadata (FR-003).

```typescript
/**
 * Page-level metadata overrides
 * Location: lib/seo/types.ts
 */
interface PageMetadataOverride {
  /** Page title (replaces default, used in template) */
  title?: string;
  
  /** Page description (replaces default) */
  description?: string;
  
  /** Explicit canonical path override (normally auto-derived) */
  canonicalPath?: string;
  
  /** Share image URL or path */
  shareImage?: string | ShareImageMeta;
  
  /** OpenGraph type override (default: 'website') */
  ogType?: 'website' | 'article';
  
  /** Article publish date (for og:article:published_time) */
  publishedTime?: string;
  
  /** Prevent indexing (robots: noindex) */
  noIndex?: boolean;
}
```

---

### ShareImageMeta

Metadata for share images with validation context.

```typescript
/**
 * Share image metadata with dimensions
 * Location: lib/seo/types.ts
 */
interface ShareImageMeta {
  /** Absolute or relative URL to image */
  url: string;
  
  /** Image width in pixels (default: 1200) */
  width?: number;
  
  /** Image height in pixels (default: 630) */
  height?: number;
  
  /** Alt text for accessibility */
  alt: string;
}
```

---

### BlogPostSEO

Extended frontmatter fields mapped to SEO metadata (FR-004, FR-005).

```typescript
/**
 * Blog post frontmatter fields relevant to SEO
 * Extension of existing BlogPostFrontmatter
 * Location: lib/mdx/blog-post-types.ts (extend)
 */
interface BlogPostSEOFields {
  /** Post title → og:title, twitter:title */
  title: string;
  
  /** Post description → og:description, twitter:description */
  description?: string;
  
  /** Publication date → og:article:published_time */
  date: string;
  
  /** Hero image → og:image, twitter:image */
  hero?: HeroImageMeta;
  
  /** Legacy image field (fallback) */
  image?: ImageMeta | string;
}
```

**Mapping Table**:
| Frontmatter | OpenGraph | Twitter | Required |
|-------------|-----------|---------|----------|
| `title` | `og:title` | `twitter:title` | Yes |
| `description` | `og:description` | `twitter:description` | No (fallback to excerpt) |
| `date` | `og:article:published_time` | - | Yes |
| `hero.src` | `og:image` | `twitter:image` | No (fallback to default) |
| (slug-derived) | `og:url` | - | Auto |
| (config) | `og:site_name` | - | Auto |
| (config) | `og:locale` | - | Auto |
| (fixed) | `og:type=article` | `twitter:card=summary_large_image` | Auto |

---

### SEOValidationResult

Build-time validation result for SEO compliance (FR-007, FR-008).

```typescript
/**
 * Validation result for a single page/post
 * Location: lib/seo/types.ts
 */
interface SEOValidationResult {
  /** File path or page route */
  path: string;
  
  /** Overall validation passed */
  valid: boolean;
  
  /** Blocking errors (fail build) */
  errors: SEOValidationError[];
  
  /** Non-blocking warnings (log only) */
  warnings: SEOValidationWarning[];
}

interface SEOValidationError {
  code: 'INVALID_IMAGE_ORIGIN' | 'IMAGE_UNREACHABLE' | 'IMAGE_TIMEOUT';
  message: string;
  field?: string;
}

interface SEOValidationWarning {
  code: 'MISSING_DESCRIPTION' | 'MISSING_HERO_IMAGE' | 'INVALID_HERO_IMAGE';
  message: string;
  field?: string;
}
```

---

## State Transitions

### Share Image Resolution Flow

```
┌─────────────────────┐
│ Read Frontmatter    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐    hero/image exists?
│ Check hero field    │──── No ────▶ Use defaultShareImage
└──────────┬──────────┘
           │ Yes
           ▼
┌─────────────────────┐    Is absolute URL?
│ Check URL format    │──── No ────▶ Resolve to absolute
└──────────┬──────────┘
           │ Yes
           ▼
┌─────────────────────┐    Origin allowed?
│ Validate origin     │──── No ────▶ ERROR: Invalid origin
└──────────┬──────────┘
           │ Yes
           ▼
┌─────────────────────┐    URL accessible?
│ HTTP HEAD request   │──── No ────▶ WARN + Use default
└──────────┬──────────┘
           │ Yes
           ▼
┌─────────────────────┐
│ Use validated URL   │
└─────────────────────┘
```

---

## Relationship Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                     GlobalSEOConfig                          │
│  (siteName, titleTemplate, defaultDescription, etc.)         │
└──────────────────────────┬───────────────────────────────────┘
                           │ provides defaults
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                     Metadata Generation                       │
│                                                              │
│  ┌─────────────────┐    ┌─────────────────────────────┐     │
│  │ Static Pages    │    │ Blog Posts                   │     │
│  │ (layout.tsx,    │    │ (generateMetadata in         │     │
│  │  page.tsx)      │    │  [slug]/page.tsx)            │     │
│  └────────┬────────┘    └──────────────┬──────────────┘     │
│           │                            │                     │
│           │ merges with                │ overrides from      │
│           ▼                            ▼                     │
│  ┌─────────────────┐    ┌─────────────────────────────┐     │
│  │ PageMetadata    │    │ BlogPostFrontmatter          │     │
│  │ Override        │    │ (title, description, hero)   │     │
│  └─────────────────┘    └─────────────────────────────┘     │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                     Next.js Metadata Object                  │
│  {                                                           │
│    title, description, metadataBase,                         │
│    openGraph: { title, description, images, ... },           │
│    twitter: { card, title, description, images, ... },       │
│    alternates: { canonical },                                │
│  }                                                           │
└──────────────────────────────────────────────────────────────┘
```

---

## Validation Rules

### Frontmatter Validation (FR-008)

| Field | Rule | Severity |
|-------|------|----------|
| `title` | Required, non-empty | Error |
| `date` | Required, valid ISO 8601 | Error |
| `description` | Recommended, ~160 chars | Warning |
| `hero.src` | If present, must be valid path | Warning |
| `hero.alt` | Required if hero present | Warning |

### Share Image Validation (FR-007)

| Check | Rule | Severity |
|-------|------|----------|
| Origin | Must be in allowedImageOrigins | Error |
| Accessibility | HTTP HEAD returns 2xx within 5s | Error |
| Timeout | Max 5 seconds per URL | Error |
| Concurrency | Max 10 parallel validations | Config |
