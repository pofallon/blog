/**
 * Blog Post Page Type Definitions
 * @see /specs/006-blog-post-route/data-model.md
 * Feature: 006-blog-post-route
 */

import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

// ============================================================================
// Frontmatter Types
// ============================================================================

/**
 * Hero image metadata parsed from frontmatter
 */
export interface ImageMeta {
  /** Relative path to image file within post directory */
  src: string;
  /** Alt text for accessibility (optional, derived from context if missing) */
  alt?: string;
}

/**
 * YouTube playlist reference in frontmatter
 */
export interface PlaylistRef {
  /** Identifier used in MDX to reference this playlist */
  name: string;
  /** YouTube playlist ID */
  id: string;
}

/**
 * Raw frontmatter structure parsed from MDX file header
 */
export interface BlogPostFrontmatter {
  /** Post display title */
  title: string;
  /** Publication date in ISO 8601 format (YYYY-MM-DD) */
  date: string;
  /** Short summary for SEO and previews (~160 chars recommended) */
  description?: string | undefined;
  /** Hero image for post header */
  image?: ImageMeta | string | undefined;
  /** YouTube playlist references for embedded video content */
  playlists?: PlaylistRef[] | undefined;
}

// ============================================================================
// Document Types
// ============================================================================

/**
 * Source document loaded from content/blog/{slug}/index.md
 * Represents raw content before transformation
 */
export interface BlogPostDocument {
  /** Canonical slug derived from directory name */
  slug: string;
  /** Raw MDX content body (without frontmatter) */
  content: string;
  /** Parsed frontmatter metadata with defaults applied */
  frontmatter: BlogPostFrontmatter;
  /** Absolute filesystem path to source file */
  filePath: string;
}

// ============================================================================
// View Model Types
// ============================================================================

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
  blurDataURL?: string;
}

/**
 * View model for rendering the blog post page
 * All display values are pre-formatted and ready for use
 */
export interface BlogPostPageModel {
  /** Canonical slug for URL construction */
  slug: string;
  /** Display title with fallback applied */
  title: string;
  /** Human-readable date (e.g., "May 2, 2020") */
  formattedDate: string;
  /** ISO date string for sorting/comparison (YYYY-MM-DD) */
  rawDate: string;
  /** Description or auto-generated excerpt */
  description: string;
  /** Full canonical URL for SEO */
  canonicalUrl: string;
  /** Compiled MDX content ready for MDXRemote rendering */
  compiledContent: MDXRemoteSerializeResult;
  /** Processed hero image, null if not specified */
  heroImage: ProcessedImage | null;
}

// ============================================================================
// Route Types
// ============================================================================

/**
 * Dynamic route parameters for /blog/[slug]
 */
export interface BlogPostParams {
  /** URL slug segment */
  slug: string;
}

/**
 * Props passed to blog post page component
 */
export interface BlogPostPageProps {
  params: Promise<BlogPostParams>;
}

// ============================================================================
// Metadata Types
// ============================================================================

/**
 * OpenGraph metadata for social sharing
 */
export interface BlogPostOpenGraph {
  title: string;
  description: string;
  type: 'article';
  url: string;
  siteName: string;
  publishedTime?: string;
  images?: Array<{
    url: string;
    width: number;
    height: number;
    alt: string;
  }>;
}

/**
 * Twitter card metadata
 */
export interface BlogPostTwitterMeta {
  card: 'summary' | 'summary_large_image';
  title: string;
  description: string;
  images?: string[];
}

/**
 * Complete SEO metadata for generateMetadata()
 */
export interface BlogPostMetadata {
  title: string;
  description: string;
  openGraph: BlogPostOpenGraph;
  twitter: BlogPostTwitterMeta;
  alternates: {
    canonical: string;
  };
}
