# API Contracts: Blog Image Handling

**Feature**: 007-add-image-handling  
**Date**: 2025-12-17

This feature is primarily component-based (not REST API). Contracts define TypeScript interfaces and component props.

## Component Contracts

### HeroImage Component

**Location**: `apps/site-shell/components/blog/HeroImage.tsx`

```typescript
interface HeroImageProps {
  /** Processed hero image data, null for empty state */
  image: ProcessedHeroImage | null;
  /** Post title for fallback alt text generation */
  postTitle?: string;
  /** Additional CSS classes */
  className?: string;
  /** Whether this is the LCP image (above the fold) - defaults to true */
  priority?: boolean;
}

// Usage
<HeroImage image={heroImage} postTitle="My Post" />
```

**Behavior**:
- If `image` is null: Render reserved space with theme-aware background
- If `image` provided: Render `next/image` with responsive sizing
- Lazy loading enabled by default
- Caption rendered below image if provided

### OptimizedImage Component (MDX)

**Location**: `apps/site-shell/components/blog/OptimizedImage.tsx`

```typescript
interface OptimizedImageProps {
  /** Image source path (relative to content/images/<slug>/) */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Optional caption displayed below image */
  caption?: string;
  /** Override width (derived from file if omitted) */
  width?: number;
  /** Override height (derived from file if omitted) */
  height?: number;
  /** Additional CSS classes */
  className?: string;
}

// Usage in MDX
<Image src="screenshot.png" alt="Dashboard" caption="The new dashboard" />
```

**Behavior**:
- Renders `next/image` with responsive sizing
- Caption rendered in `<figcaption>` if provided
- Lazy loading with 200px viewport threshold
- Responsive breakpoints: 480, 768, 1200, 1920px

## Loader Contracts

### Image Loader Function

**Location**: `apps/site-shell/lib/mdx/image-loader.ts`

```typescript
/**
 * Load and validate hero image for a blog post
 * @param slug - Post slug for directory lookup
 * @param heroMeta - Hero metadata from frontmatter
 * @returns Processed image or null if no hero
 */
function loadHeroImage(
  slug: string,
  heroMeta: HeroImageMeta | undefined
): ProcessedHeroImage | null;

/**
 * Validate all image references in a blog post
 * @param slug - Post slug
 * @param frontmatter - Parsed frontmatter
 * @param content - MDX content body
 * @returns Validation result with errors/warnings
 */
function validatePostImages(
  slug: string,
  frontmatter: BlogPostFrontmatter,
  content: string
): ImageValidationResult;

/**
 * Get image dimensions from file
 * @param imagePath - Absolute path to image file
 * @returns Width and height in pixels
 */
function getImageDimensions(
  imagePath: string
): { width: number; height: number };
```

## Configuration Contract

**Location**: `apps/site-shell/lib/mdx/image-config.ts`

```typescript
export const IMAGE_CONFIG = {
  /** Responsive breakpoints in pixels */
  breakpoints: [480, 768, 1200, 1920] as const,
  
  /** Lazy loading viewport threshold */
  lazyBoundary: 200,
  
  /** Size attribute for responsive images */
  sizes: '(max-width: 480px) 100vw, (max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px',
  
  /** Supported image formats */
  supportedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'] as const,
  
  /** Size threshold for warnings (bytes) */
  sizeWarningThreshold: 500 * 1024, // 500KB
  
  /** Dimension threshold for warnings (pixels) */
  dimensionWarningThreshold: 2000,
  
  /** Default hero aspect ratio */
  heroAspectRatio: '16/9',
} as const;
```

## Validation Errors

| Error Code | Message | Action |
|------------|---------|--------|
| `IMG_NOT_FOUND` | `Image file not found: {path}` | Build fails |
| `IMG_INVALID_FORMAT` | `Unsupported image format: {format}` | Build fails |
| `IMG_MISSING_ALT` | `Missing alt text for image: {path}` | Warning only |
| `IMG_OVERSIZED` | `Image exceeds size threshold: {size}` | Warning only |
| `IMG_LARGE_DIMENSIONS` | `Image dimensions exceed threshold: {w}x{h}` | Warning only |
| `IMG_EXTERNAL_URL` | `External image URL bypasses optimization: {url}` | Warning only |

## Build Output Contract

Image validation integrates with existing MDX build summary:

```typescript
interface MDXBuildSummary {
  // ... existing fields
  imageWarnings: string[];
  imageErrors: string[];
  processedImages: number;
}
```
