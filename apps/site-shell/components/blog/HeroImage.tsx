/**
 * HeroImage Component - Renders hero images for blog posts
 * @see /specs/007-add-image-handling/contracts/components.md
 * Feature: 007-add-image-handling
 */

'use client';

import Image from 'next/image';
import { IMAGE_CONFIG } from '@/lib/mdx/image-config';
import type { ProcessedHeroImage } from '@/lib/mdx/image-types';

export interface HeroImageProps {
  /** Processed hero image data, null for empty state */
  image: ProcessedHeroImage | null;
  /** Post title for fallback alt text generation */
  postTitle?: string;
  /** Additional CSS classes */
  className?: string;
  /** Whether this is the LCP image (above the fold) - defaults to true for hero */
  priority?: boolean;
}

/**
 * Responsive breakpoints for hero images (T020)
 * Maps to IMAGE_CONFIG.breakpoints: 480, 768, 1200, 1920px
 */
const HERO_SIZES = IMAGE_CONFIG.sizes;

/**
 * HeroImage renders the hero image for a blog post
 * Shows a theme-aware placeholder when no image is provided
 * 
 * Performance features (US3):
 * - Responsive breakpoints at 480/768/1200/1920px (T020)
 * - Lazy loading with 200px viewport threshold for non-priority images (T022)
 * - Blur placeholder support
 */
export function HeroImage({ 
  image, 
  postTitle, 
  className = '',
  priority = true,
}: HeroImageProps) {
  if (!image) {
    // Empty state with theme-aware reserved space (T012)
    return (
      <div
        className={`aspect-video w-full bg-slate-100 dark:bg-slate-800 rounded-lg ${className}`}
        aria-hidden="true"
      />
    );
  }

  const { src, width, height, alt, blurDataURL, caption, focalPoint } = image;

  // Determine alt text with fallback
  const imageAlt = alt || (postTitle ? `Hero image for ${postTitle}` : 'Blog post hero image');

  return (
    <figure className={`w-full ${className}`}>
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        <Image
          src={src}
          alt={imageAlt}
          width={width}
          height={height}
          // Priority for LCP optimization - hero is usually above fold
          priority={priority}
          // Lazy loading with 200px threshold for non-priority images (T022)
          loading={priority ? undefined : 'lazy'}
          // Responsive breakpoints (T020)
          sizes={HERO_SIZES}
          // Blur placeholder for perceived performance
          placeholder={blurDataURL ? 'blur' : 'empty'}
          {...(blurDataURL && { blurDataURL })}
          className="object-cover w-full h-full"
          style={{
            objectPosition: focalPoint || IMAGE_CONFIG.defaultFocalPoint,
          }}
        />
      </div>
      {/* Caption rendering (T013) */}
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
