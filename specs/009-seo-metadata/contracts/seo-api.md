# SEO Metadata API Contracts

**Feature**: 009-seo-metadata  
**Date**: 2025-12-17  
**Phase**: 1 - Design

## Module: lib/seo/config.ts

### getGlobalSEOConfig()

Returns the centralized SEO configuration for site-wide defaults.

```typescript
/**
 * Get global SEO configuration
 * @returns GlobalSEOConfig object with all site-wide defaults
 */
function getGlobalSEOConfig(): GlobalSEOConfig;
```

**Behavior**:
- Reads from environment variables for `canonicalHost`
- Returns static config for other values
- Called once at module load, cached

---

## Module: lib/seo/metadata.ts

### buildPageMetadata()

Generates a complete Next.js Metadata object by merging global defaults with page overrides.

```typescript
/**
 * Build complete metadata for a page
 * @param override - Optional page-specific overrides
 * @param path - Current page path for canonical URL
 * @returns Next.js Metadata object
 */
function buildPageMetadata(
  override?: PageMetadataOverride,
  path?: string
): Metadata;
```

**Behavior**:
- Merges GlobalSEOConfig with PageMetadataOverride
- Generates canonical URL from path
- Applies title template for non-root pages
- Returns properly typed `Metadata` from `next`

**Example**:
```typescript
const metadata = buildPageMetadata(
  { title: 'About Us', description: 'Learn about our team' },
  '/about'
);
// Result: { title: 'About Us | Get2Know Labs', description: '...', ... }
```

---

### buildBlogPostMetadata()

Generates metadata specifically for blog posts from frontmatter.

```typescript
/**
 * Build metadata for a blog post page
 * @param frontmatter - Parsed blog post frontmatter
 * @param slug - Post slug for URL generation
 * @returns Next.js Metadata object with OG and Twitter tags
 */
function buildBlogPostMetadata(
  frontmatter: BlogPostFrontmatter,
  slug: string
): Metadata;
```

**Behavior**:
- Maps frontmatter fields to OpenGraph/Twitter tags
- Resolves hero image to absolute URL
- Falls back to defaults for missing fields
- Sets `og:type` to `article`
- Uses `summary_large_image` Twitter card when image present

**OpenGraph Output**:
```typescript
{
  openGraph: {
    title: frontmatter.title,
    description: frontmatter.description || globalConfig.defaultDescription,
    type: 'article',
    url: buildCanonicalUrl(`/blog/${slug}`),
    siteName: globalConfig.siteName,
    publishedTime: frontmatter.date,
    images: [{ url, width: 1200, height: 630, alt }],
  }
}
```

**Twitter Output**:
```typescript
{
  twitter: {
    card: hasImage ? 'summary_large_image' : 'summary',
    title: frontmatter.title,
    description: frontmatter.description || globalConfig.defaultDescription,
    images: hasImage ? [absoluteImageUrl] : undefined,
  }
}
```

---

## Module: lib/seo/url-builder.ts

### buildCanonicalUrl()

Constructs an absolute canonical URL from a path segment.

```typescript
/**
 * Build absolute canonical URL
 * @param path - Path segment (e.g., '/blog/my-post')
 * @returns Absolute URL (e.g., 'https://get2know.io/blog/my-post')
 */
function buildCanonicalUrl(path: string): string;
```

**Behavior**:
- Uses `NEXT_PUBLIC_SITE_URL` env var or fallback
- Normalizes trailing slashes
- Ensures path starts with `/`
- No browser globals used

**Invariants**:
- Output always starts with `https://`
- Output never has trailing slash (unless root)
- Path is lowercase (URL normalization)

---

### resolveShareImageUrl()

Resolves a share image reference to an absolute URL.

```typescript
/**
 * Resolve share image to absolute URL
 * @param image - Image path, URL, or HeroImageMeta
 * @param slug - Post slug for relative path resolution
 * @returns Absolute URL or null if invalid
 */
function resolveShareImageUrl(
  image: string | HeroImageMeta | undefined,
  slug?: string
): string | null;
```

**Behavior**:
- Returns null if image is undefined
- Preserves absolute URLs (https://)
- Converts relative paths using canonical host
- Handles HeroImageMeta object format

**Resolution Rules**:
```typescript
// Input: 'hero.png', slug: 'my-post'
// Output: 'https://get2know.io/blog-images/my-post/hero.png'

// Input: '/images/og.png'
// Output: 'https://get2know.io/images/og.png'

// Input: 'https://cdn.example.com/img.png'
// Output: 'https://cdn.example.com/img.png'
```

---

## Module: lib/seo/image-validator.ts

### validateShareImageUrl()

Validates a single share image URL for accessibility and origin compliance.

```typescript
/**
 * Validate share image URL
 * @param url - Absolute URL to validate
 * @param allowedOrigins - List of allowed URL origins
 * @returns Validation result with error details
 */
async function validateShareImageUrl(
  url: string,
  allowedOrigins: string[]
): Promise<ImageValidationResult>;

interface ImageValidationResult {
  url: string;
  valid: boolean;
  error?: {
    code: 'INVALID_ORIGIN' | 'UNREACHABLE' | 'TIMEOUT';
    message: string;
  };
}
```

**Behavior**:
- Checks URL origin against allowlist
- Performs HTTP HEAD request
- Timeout: 5 seconds
- Returns detailed error codes

---

### validateAllShareImages()

Batch validates all share images with concurrency control.

```typescript
/**
 * Validate all share images from blog posts
 * @param posts - Array of blog post documents
 * @returns Array of validation results
 */
async function validateAllShareImages(
  posts: BlogPostDocument[]
): Promise<ImageValidationResult[]>;
```

**Behavior**:
- Extracts share image URLs from all posts
- Validates with max 10 concurrent requests
- Collects and returns all results

---

## Module: lib/seo/types.ts

### Type Exports

```typescript
// Re-export all SEO-related types
export type {
  GlobalSEOConfig,
  PageMetadataOverride,
  ShareImageMeta,
  SEOValidationResult,
  SEOValidationError,
  SEOValidationWarning,
  ImageValidationResult,
};
```

---

## Module: lib/seo/index.ts

### Public API

```typescript
// Public exports for SEO module
export { getGlobalSEOConfig } from './config';
export { buildPageMetadata, buildBlogPostMetadata } from './metadata';
export { buildCanonicalUrl, resolveShareImageUrl } from './url-builder';
export { validateShareImageUrl, validateAllShareImages } from './image-validator';
export * from './types';
```

---

## Build Script: scripts/validate-seo.ts

### CLI Interface

```bash
# Run SEO validation as part of build
npx tsx scripts/validate-seo.ts

# Exit codes:
# 0 - All validations passed
# 1 - Validation errors (build should fail)
```

**Output Format**:
```
SEO Validation Report
=====================

✓ 42 posts validated
✓ 38 share images validated

Warnings (3):
  - content/blog/old-post/index.mdx: Missing description
  - content/blog/draft/index.mdx: Missing hero image
  - content/blog/test/index.mdx: Invalid hero image path

Errors (0):

Build status: PASS
```

**Error Output**:
```
Errors (1):
  ✗ content/blog/broken/index.mdx: Share image unreachable (timeout)
    URL: https://get2know.io/blog-images/broken/hero.png

Build status: FAIL
```
