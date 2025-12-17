/**
 * OptimizedImage Component - MDX inline image component
 * @see /specs/007-add-image-handling/contracts/components.md
 * Feature: 007-add-image-handling
 */

'use client';

import Image from 'next/image';
import { IMAGE_CONFIG } from '@/lib/mdx/image-config';
import type { InlineImageProps } from '@/lib/mdx/image-types';

export interface OptimizedImageComponentProps extends InlineImageProps {
  /** Post slug for image path resolution (provided via context) */
  slug?: string;
}

/**
 * Responsive breakpoints for inline images (T021)
 * Maps to IMAGE_CONFIG.breakpoints: 480, 768, 1200, 1920px
 */
const INLINE_SIZES = IMAGE_CONFIG.sizes;

/**
 * OptimizedImage renders inline images in MDX content
 * Supports captions, responsive sizing, and lazy loading
 * 
 * Performance features (US3):
 * - Responsive breakpoints at 480/768/1200/1920px (T021)
 * - Lazy loading with 200px viewport threshold (T023)
 * - External URL detection (unoptimized fallback)
 */
export function OptimizedImage({
  src,
  alt,
  caption,
  width,
  height,
  className = '',
  slug,
}: OptimizedImageComponentProps) {
  // Determine the image source path
  // If it's already an absolute URL or path, use as-is
  // Otherwise, construct the path from the slug
  let imageSrc = src;
  if (!src.startsWith('/') && !src.startsWith('http')) {
    // Relative path - construct from slug context or use directly
    imageSrc = slug ? `/content-images/${slug}/${src}` : src;
  }

  // Default dimensions if not provided
  const imageWidth = width || 800;
  const imageHeight = height || 600;

  // Check for external URLs (T026 - warning logged during build)
  const isExternal = src.startsWith('http://') || src.startsWith('https://');

  return (
    <figure className={`my-6 ${className}`}>
      <div className="relative w-full overflow-hidden rounded-lg">
        <Image
          src={imageSrc}
          alt={alt || ''}
          width={imageWidth}
          height={imageHeight}
          // Lazy loading with native browser support (T023)
          loading="lazy"
          // Responsive breakpoints (T021)
          sizes={INLINE_SIZES}
          className="w-full h-auto"
          // External URLs bypass optimization (T026)
          unoptimized={isExternal}
        />
      </div>
      {/* Caption rendering with figcaption (T018) */}
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
