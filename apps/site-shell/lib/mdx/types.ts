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
 * Frontmatter metadata contract for MDX entries
 * All MDX files must provide these fields (image is optional)
 */
export interface FrontmatterMetadata {
  title: string;
  date: string; // YYYY-MM-DD format
  description: string;
  image?: ImageMeta;
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
