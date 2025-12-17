/**
 * SEO Image Validation Utilities
 * @see /specs/009-seo-metadata/contracts/seo-api.md
 * Feature: 009-seo-metadata
 */

import type { BlogPostDocument } from '@/lib/mdx/blog-post-types';
import type { ImageValidationResult } from './types';
import { getGlobalSEOConfig } from './config';
import { resolveShareImageUrl } from './url-builder';

/** Timeout for HTTP HEAD requests in milliseconds */
const VALIDATION_TIMEOUT_MS = 5000;

/** Maximum concurrent validations */
const MAX_CONCURRENT_VALIDATIONS = 10;

/**
 * Validate share image URL for accessibility and origin compliance (FR-007)
 * @param url - Absolute URL to validate
 * @param allowedOrigins - List of allowed URL origins
 * @returns Validation result with error details
 */
export async function validateShareImageUrl(
  url: string,
  allowedOrigins: string[]
): Promise<ImageValidationResult> {
  // Check origin
  let urlOrigin: string;
  try {
    const parsedUrl = new URL(url);
    urlOrigin = parsedUrl.origin;
  } catch {
    return {
      url,
      valid: false,
      error: {
        code: 'INVALID_ORIGIN',
        message: `Invalid URL format: ${url}`,
      },
    };
  }

  // Verify origin is allowed
  const isAllowedOrigin = allowedOrigins.some(
    (origin) => urlOrigin === origin || urlOrigin.startsWith(origin)
  );

  if (!isAllowedOrigin) {
    return {
      url,
      valid: false,
      error: {
        code: 'INVALID_ORIGIN',
        message: `Origin '${urlOrigin}' not in allowed origins: ${allowedOrigins.join(', ')}`,
      },
    };
  }

  // HTTP HEAD request with timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, VALIDATION_TIMEOUT_MS);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        url,
        valid: false,
        error: {
          code: 'UNREACHABLE',
          message: `HTTP ${String(response.status)}: ${response.statusText}`,
        },
      };
    }

    return { url, valid: true };
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        url,
        valid: false,
        error: {
          code: 'TIMEOUT',
          message: `Request timed out after ${String(VALIDATION_TIMEOUT_MS)}ms`,
        },
      };
    }

    return {
      url,
      valid: false,
      error: {
        code: 'UNREACHABLE',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

/**
 * Batch validates all share images with concurrency control (FR-007)
 * @param posts - Array of blog post documents
 * @returns Array of validation results
 */
export async function validateAllShareImages(
  posts: BlogPostDocument[]
): Promise<ImageValidationResult[]> {
  const config = getGlobalSEOConfig();
  const results: ImageValidationResult[] = [];

  // Extract unique share image URLs
  const imageUrls = new Set<string>();

  for (const post of posts) {
    const heroImage = post.frontmatter.hero || post.frontmatter.image;
    const imageUrl = resolveShareImageUrl(heroImage, post.slug);
    if (imageUrl) {
      imageUrls.add(imageUrl);
    }
  }

  // Convert to array for processing
  const urlsToValidate = Array.from(imageUrls);

  // Process in batches for concurrency control
  for (let i = 0; i < urlsToValidate.length; i += MAX_CONCURRENT_VALIDATIONS) {
    const batch = urlsToValidate.slice(i, i + MAX_CONCURRENT_VALIDATIONS);
    const batchResults = await Promise.all(
      batch.map((url) => validateShareImageUrl(url, config.allowedImageOrigins))
    );
    results.push(...batchResults);
  }

  return results;
}
