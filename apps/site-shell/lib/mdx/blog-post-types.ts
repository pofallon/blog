/**
 * Blog Post Page Type Definitions
 * @see /specs/006-blog-post-route/data-model.md
 * Feature: 006-blog-post-route
 * SEO: /specs/009-seo-metadata/data-model.md
 */

import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import type { ProcessedImage } from './types';
export type { ProcessedImage };

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
 * Enhanced hero image metadata with caption and focal point support
 * @see /specs/007-add-image-handling/data-model.md
 * 
 * SEO Usage:
 * - src: Resolved to absolute URL for og:image and twitter:image
 * - alt: Used for og:image:alt accessibility
 */
export interface HeroImageMeta {
  /** Relative path within content/images/<slug>/ */
  src: string;
  /** Accessibility description (required, warn if empty) */
  alt: string;
  /** Optional display caption or credit */
  caption?: string | undefined;
  /** CSS object-position value for responsive cropping */
  focalPoint?: string | undefined;
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
 * 
 * SEO Field Mapping (see /specs/009-seo-metadata/data-model.md):
 * - title → og:title, twitter:title
 * - description → og:description, twitter:description
 * - date → og:article:published_time
 * - hero.src → og:image, twitter:image (resolved to absolute URL)
 */
export interface BlogPostFrontmatter {
  /** Post display title */
  title: string;
  /** Publication date in ISO 8601 format (YYYY-MM-DD) */
  date: string;
  /** Short summary for SEO and previews (~160 chars recommended) */
  description?: string | undefined;
  /** Hero image for post header (legacy format) */
  image?: ImageMeta | string | undefined;
  /** Enhanced hero image with caption and focal point support */
  hero?: HeroImageMeta | undefined;
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
