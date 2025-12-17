/**
 * SEO Module Public Exports
 * @see /specs/009-seo-metadata/
 * Feature: 009-seo-metadata
 */

// Types
export type {
  GlobalSEOConfig,
  PageMetadataOverride,
  ShareImageMeta,
  SEOValidationResult,
  SEOValidationError,
  SEOValidationWarning,
  ImageValidationResult,
  SEOValidationErrorCode,
  SEOValidationWarningCode,
  ImageValidationErrorCode,
} from './types';

// Config
export { getGlobalSEOConfig } from './config';

// URL utilities
export { buildCanonicalUrl, resolveShareImageUrl } from './url-builder';

// Metadata utilities
export { buildBlogPostMetadata, buildPageMetadata } from './metadata';

// Image validation
export { validateShareImageUrl, validateAllShareImages } from './image-validator';
