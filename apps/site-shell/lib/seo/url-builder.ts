/**
 * SEO URL Building Utilities
 * @see /specs/009-seo-metadata/contracts/seo-api.md
 * Feature: 009-seo-metadata
 */

import type { HeroImageMeta, ImageMeta } from '@/lib/mdx/blog-post-types';
import { getGlobalSEOConfig } from './config';

/**
 * Build absolute canonical URL from a path segment (FR-006)
 * @param path - Path segment (e.g., '/blog/my-post')
 * @returns Absolute URL (e.g., 'https://get2know.io/blog/my-post')
 */
export function buildCanonicalUrl(path: string): string {
  const config = getGlobalSEOConfig();
  const host = config.canonicalHost.replace(/\/$/, ''); // Remove trailing slash

  // Normalize path
  let normalizedPath = path.toLowerCase();
  if (!normalizedPath.startsWith('/')) {
    normalizedPath = '/' + normalizedPath;
  }
  // Remove trailing slash (except for root)
  if (normalizedPath !== '/' && normalizedPath.endsWith('/')) {
    normalizedPath = normalizedPath.slice(0, -1);
  }

  return `${host}${normalizedPath}`;
}

/**
 * Resolve share image to absolute URL (FR-007)
 * @param image - Image path, URL, or HeroImageMeta/ImageMeta
 * @param slug - Post slug for relative path resolution
 * @returns Absolute URL or null if invalid
 */
export function resolveShareImageUrl(
  image: string | HeroImageMeta | ImageMeta | undefined,
  slug?: string
): string | null {
  if (!image) {
    return null;
  }

  const config = getGlobalSEOConfig();
  const host = config.canonicalHost.replace(/\/$/, '');

  // Handle HeroImageMeta or ImageMeta object
  const imagePath = typeof image === 'string' ? image : image.src;

  // Already absolute URL
  if (imagePath.startsWith('https://') || imagePath.startsWith('http://')) {
    return imagePath;
  }

  // Absolute path from root
  if (imagePath.startsWith('/')) {
    return `${host}${imagePath}`;
  }

  // Relative path - resolve using slug for blog posts
  if (slug) {
    // Remove leading ./ if present
    const cleanPath = imagePath.replace(/^\.\//, '');
    return `${host}/blog-images/${slug}/${cleanPath}`;
  }

  // Relative path without slug - append to host
  return `${host}/${imagePath}`;
}
