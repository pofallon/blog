/**
 * Blog Image Type Definitions
 * @see /specs/007-add-image-handling/data-model.md
 * Feature: 007-add-image-handling
 */

// Re-export HeroImageMeta from blog-post-types to maintain single source of truth
export type { HeroImageMeta } from './blog-post-types';

/**
 * Props for MDX <Image> component
 */
export interface InlineImageProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Physical image asset tracked during build
 */
export interface ImageAsset {
  filePath: string;
  slug: string;
  type: 'hero' | 'inline';
  width: number;
  height: number;
  format: string;
  sizeBytes: number;
}

/**
 * Processed hero image ready for rendering
 */
export interface ProcessedHeroImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  blurDataURL?: string;
  caption?: string;
  focalPoint?: string;
}

/**
 * Image validation result
 */
export interface ImageValidationResult {
  valid: boolean;
  filePath: string;
  errors: string[];
  warnings: string[];
  assets: ImageAsset[];
}
