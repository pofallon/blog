/**
 * MDX Content Pipeline Type Definitions
 * @see /specs/003-add-mdx-support/data-model.md
 */

/**
 * Optional image metadata for MDX posts
 */
export interface ImageMeta {
  url: string;
  alt: string;
}

/**
 * Processed image ready for optimized display
 */
export interface ProcessedImage {
  /** Optimized image URL or path */
  src: string;
  /** Image width in pixels */
  width: number;
  /** Image height in pixels */
  height: number;
  /** Alt text for accessibility */
  alt: string;
  /** Base64 blur placeholder for loading state */
  blurDataURL?: string | undefined;
}

/**
 * Frontmatter metadata contract for MDX entries
 * All MDX files must provide these fields (image is optional)
 */
export interface FrontmatterMetadata {
  title: string;
  date: string; // YYYY-MM-DD format
  description: string;
  image?: ImageMeta | undefined;
  hero?: {
    src: string;
    alt: string;
    caption?: string | undefined;
    focalPoint?: string | undefined;
  } | undefined;
}

/**
 * Complete MDX entry with metadata and content
 */
export interface MDXEntry {
  slug: string;
  metadata: FrontmatterMetadata;
  content: string;
  filePath: string;
}

/**
 * Validation result for a single MDX file
 */
export interface ValidationResult {
  valid: boolean;
  filePath: string;
  errors: string[];
  warnings: string[];
}

/**
 * Build summary for MDX processing
 */
export interface MDXBuildSummary {
  totalFiles: number;
  validFiles: number;
  invalidFiles: number;
  warnings: string[];
  processedSlugs: string[];
}

/**
 * View model for blog index page entries.
 * Transforms MDXEntry for UI consumption with pre-formatted display values.
 * @see /specs/005-build-blog-index/data-model.md
 */
export interface BlogIndexEntry {
  /** Post identifier from filename (e.g., "demo-mdx") */
  slug: string;
  /** Display title from frontmatter */
  title: string;
  /** Human-readable date (e.g., "May 2, 2020") */
  formattedDate: string;
  /** ISO date string for sorting/comparison (YYYY-MM-DD) */
  rawDate: string;
  /** Description or auto-generated excerpt (~160 chars max) */
  summary: string;
  /** Canonical URL path (e.g., "/posts/demo-mdx") */
  url: string;
  /** Processed hero image, null if not specified */
  heroImage: ProcessedImage | null;
}

/**
 * Configuration options for retrieving blog posts for index display.
 * @see /specs/005-build-blog-index/data-model.md
 */
export interface BlogIndexOptions {
  /** Include posts with future dates. Default: false */
  includeFuture?: boolean;
  /** Maximum number of posts to return. Default: unlimited */
  limit?: number;
}
