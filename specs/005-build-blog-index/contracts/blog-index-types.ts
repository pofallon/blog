/**
 * Blog Index Type Definitions
 * @see /specs/005-build-blog-index/data-model.md
 */

/**
 * View model for blog index page entries.
 * Transforms MDXEntry for UI consumption with pre-formatted display values.
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
}

/**
 * Configuration options for retrieving blog posts for index display.
 */
export interface BlogIndexOptions {
  /**
   * Include posts with future dates.
   * @default false
   */
  includeFuture?: boolean;

  /**
   * Maximum number of posts to return.
   * @default unlimited
   */
  limit?: number;
}

/**
 * Response structure for blog index data retrieval.
 */
export interface BlogIndexResponse {
  /** Array of posts sorted by date (newest first) */
  posts: BlogIndexEntry[];

  /** Total count of published posts (excluding future-dated) */
  totalCount: number;

  /** Whether there are more posts beyond the limit */
  hasMore: boolean;
}
