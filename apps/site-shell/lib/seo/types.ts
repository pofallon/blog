/**
 * SEO Metadata Types
 * @see /specs/009-seo-metadata/data-model.md
 * Feature: 009-seo-metadata
 */

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * Global SEO configuration for site-wide defaults (FR-001)
 */
export interface GlobalSEOConfig {
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

// ============================================================================
// Override Types
// ============================================================================

/**
 * Metadata for share images with dimensions
 */
export interface ShareImageMeta {
  /** Absolute or relative URL to image */
  url: string;

  /** Image width in pixels (default: 1200) */
  width?: number;

  /** Image height in pixels (default: 630) */
  height?: number;

  /** Alt text for accessibility */
  alt: string;
}

/**
 * Page-level metadata overrides (FR-003)
 */
export interface PageMetadataOverride {
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

// ============================================================================
// Validation Types
// ============================================================================

/**
 * Validation error codes for SEO compliance
 */
export type SEOValidationErrorCode =
  | 'INVALID_IMAGE_ORIGIN'
  | 'IMAGE_UNREACHABLE'
  | 'IMAGE_TIMEOUT';

/**
 * Validation warning codes for SEO compliance
 */
export type SEOValidationWarningCode =
  | 'MISSING_DESCRIPTION'
  | 'MISSING_HERO_IMAGE'
  | 'INVALID_HERO_IMAGE';

/**
 * SEO validation error (blocking)
 */
export interface SEOValidationError {
  code: SEOValidationErrorCode;
  message: string;
  field?: string;
}

/**
 * SEO validation warning (non-blocking)
 */
export interface SEOValidationWarning {
  code: SEOValidationWarningCode;
  message: string;
  field?: string;
}

/**
 * Validation result for a single page/post (FR-007, FR-008)
 */
export interface SEOValidationResult {
  /** File path or page route */
  path: string;

  /** Overall validation passed */
  valid: boolean;

  /** Blocking errors (fail build) */
  errors: SEOValidationError[];

  /** Non-blocking warnings (log only) */
  warnings: SEOValidationWarning[];
}

/**
 * Image validation error codes
 */
export type ImageValidationErrorCode = 'INVALID_ORIGIN' | 'UNREACHABLE' | 'TIMEOUT';

/**
 * Result of validating a single share image URL
 */
export interface ImageValidationResult {
  url: string;
  valid: boolean;
  error?: {
    code: ImageValidationErrorCode;
    message: string;
  };
}
