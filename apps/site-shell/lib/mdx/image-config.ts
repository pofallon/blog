/**
 * Blog Image Configuration
 * @see /specs/007-add-image-handling/contracts/components.md
 * Feature: 007-add-image-handling
 */

export const IMAGE_CONFIG = {
  /** Responsive breakpoints in pixels */
  breakpoints: [480, 768, 1200, 1920] as const,

  /** Lazy loading viewport threshold in pixels */
  lazyBoundary: 200,

  /** Size attribute for responsive images */
  sizes:
    '(max-width: 480px) 100vw, (max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px',

  /** Supported image formats */
  supportedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'] as const,

  /** Size threshold for warnings (bytes) - 500KB */
  sizeWarningThreshold: 500 * 1024,

  /** Dimension threshold for warnings (pixels) */
  dimensionWarningThreshold: 2000,

  /** Default hero aspect ratio */
  heroAspectRatio: '16/9',

  /** Default focal point for cropping */
  defaultFocalPoint: 'center',
} as const;

export type SupportedImageFormat = (typeof IMAGE_CONFIG.supportedFormats)[number];
