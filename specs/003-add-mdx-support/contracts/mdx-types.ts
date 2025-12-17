/**
 * MDX Content Pipeline Type Contracts
 * 
 * These types define the data structures for the MDX content system.
 * Implementation should match these contracts exactly.
 * 
 * @see ../data-model.md for full entity documentation
 */

/**
 * Optional image metadata for MDX posts
 */
export interface ImageMeta {
  /** Image source URL (must be valid http/https URL or relative path) */
  url: string;
  /** Accessibility alt text (required when image is provided) */
  alt: string;
}

/**
 * Frontmatter metadata contract for MDX entries
 * All MDX files must provide required fields; image is optional.
 * 
 * @example
 * ```yaml
 * ---
 * title: "My Post Title"
 * date: "2025-12-15"
 * description: "A brief description of the post content."
 * image:
 *   url: "https://example.com/image.jpg"
 *   alt: "Description of the image"
 * ---
 * ```
 */
export interface FrontmatterMetadata {
  /** Display title for the post (non-empty, trimmed) */
  title: string;
  /** Publication date in YYYY-MM-DD format */
  date: string;
  /** Plain-text summary for previews (1-200 characters) */
  description: string;
  /** Optional hero image */
  image?: ImageMeta;
}

/**
 * Complete MDX entry combining metadata with content
 */
export interface MDXEntry {
  /** Route identifier derived from filename (e.g., "demo-mdx" from "demo-mdx.mdx") */
  slug: string;
  /** Validated frontmatter metadata */
  metadata: FrontmatterMetadata;
  /** Raw MDX content (body after frontmatter extraction) */
  content: string;
  /** Absolute path to source file (for error reporting) */
  filePath: string;
}

/**
 * Validation result for a single MDX file
 */
export interface ValidationResult {
  /** Whether the file passed all validation checks */
  valid: boolean;
  /** Path to the validated file */
  filePath: string;
  /** List of validation errors (empty if valid) */
  errors: string[];
  /** List of non-fatal warnings */
  warnings: string[];
}

/**
 * Build summary for MDX processing (FR-008)
 */
export interface MDXBuildSummary {
  /** Total number of MDX files discovered */
  totalFiles: number;
  /** Number of files that passed validation */
  validFiles: number;
  /** Number of files that failed validation */
  invalidFiles: number;
  /** Aggregated warnings from all files */
  warnings: string[];
  /** List of successfully processed slugs */
  processedSlugs: string[];
}

/**
 * Props for the MDX page component
 */
export interface MDXPageProps {
  /** The MDX entry to render */
  entry: MDXEntry;
}

/**
 * Parameters for dynamic MDX routes
 */
export interface MDXRouteParams {
  /** The post slug from the URL */
  slug: string;
}
