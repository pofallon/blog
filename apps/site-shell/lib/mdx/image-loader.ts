/**
 * Blog Image Loader - loads and validates images for blog posts
 * @see /specs/007-add-image-handling/contracts/components.md
 * Feature: 007-add-image-handling
 */

import fs from 'fs';
import path from 'path';
import { IMAGE_CONFIG } from './image-config';
import type {
  HeroImageMeta,
  ProcessedHeroImage,
  ImageValidationResult,
  ImageAsset,
} from './image-types';
import type { BlogPostFrontmatter } from './blog-post-types';

/**
 * Get the content images directory path
 */
function getImagesContentDir(): string {
  const possiblePaths = [
    path.join(process.cwd(), 'content/images'),
    path.join(process.cwd(), '../../content/images'),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  return path.join(process.cwd(), 'content/images');
}

/**
 * Get image dimensions from file using Node.js (basic implementation)
 * For production, consider using 'image-size' package
 */
export function getImageDimensions(
  imagePath: string
): { width: number; height: number } {
  // Try to read image dimensions from file
  // Using a simple approach that works for common formats
  try {
    const buffer = fs.readFileSync(imagePath);

    // PNG signature check
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      return { width, height };
    }

    // JPEG signature check
    if (buffer[0] === 0xff && buffer[1] === 0xd8) {
      let offset = 2;
      while (offset < buffer.length) {
        if (buffer[offset] !== 0xff) break;
        const marker = buffer[offset + 1];
        if (marker === undefined) break;

        // SOF markers (Start of Frame)
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
          const height = buffer.readUInt16BE(offset + 5);
          const width = buffer.readUInt16BE(offset + 7);
          return { width, height };
        }

        const length = buffer.readUInt16BE(offset + 2);
        offset += length + 2;
      }
    }

    // WebP signature check
    if (
      buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
      buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
    ) {
      // VP8 lossy
      if (buffer[12] === 0x56 && buffer[13] === 0x50 && buffer[14] === 0x38 && buffer[15] === 0x20) {
        const width = (buffer[26] ?? 0) | ((buffer[27] ?? 0) << 8);
        const height = (buffer[28] ?? 0) | ((buffer[29] ?? 0) << 8);
        return { width: width & 0x3fff, height: height & 0x3fff };
      }
      // VP8L lossless
      if (buffer[12] === 0x56 && buffer[13] === 0x50 && buffer[14] === 0x38 && buffer[15] === 0x4c) {
        const bits = buffer.readUInt32LE(21);
        const width = (bits & 0x3fff) + 1;
        const height = ((bits >> 14) & 0x3fff) + 1;
        return { width, height };
      }
    }

    // GIF signature check
    if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
      const width = buffer.readUInt16LE(6);
      const height = buffer.readUInt16LE(8);
      return { width, height };
    }

    // Default fallback dimensions
    return { width: 1200, height: 630 };
  } catch {
    return { width: 1200, height: 630 };
  }
}

/**
 * Check if a file format is supported
 */
function isSupportedFormat(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase().slice(1);
  return IMAGE_CONFIG.supportedFormats.includes(ext as typeof IMAGE_CONFIG.supportedFormats[number]);
}

/**
 * Load and validate hero image for a blog post
 */
export function loadHeroImage(
  slug: string,
  heroMeta: HeroImageMeta | undefined
): ProcessedHeroImage | null {
  if (!heroMeta) {
    return null;
  }

  const imagesDir = getImagesContentDir();
  const imagePath = path.join(imagesDir, slug, heroMeta.src);

  // Check if file exists
  if (!fs.existsSync(imagePath)) {
    console.warn(`[007] Hero image not found: ${imagePath}`);
    return null;
  }

  // Check format
  if (!isSupportedFormat(imagePath)) {
    console.warn(`[007] Unsupported hero image format: ${imagePath}`);
    return null;
  }

  // Get dimensions
  const { width, height } = getImageDimensions(imagePath);

  // Check for missing alt text
  if (!heroMeta.alt) {
    console.warn(`[007] Missing alt text for hero image: ${imagePath}`);
  }

  // Build the public URL path
  const publicSrc = `/content-images/${slug}/${heroMeta.src}`;

  // Generate blur placeholder (T024)
  const blurDataURL = generateBlurPlaceholder(width, height);

  // Build result object, only adding optional properties if defined
  const result: ProcessedHeroImage = {
    src: publicSrc,
    width,
    height,
    alt: heroMeta.alt || '',
    blurDataURL,
    focalPoint: heroMeta.focalPoint || IMAGE_CONFIG.defaultFocalPoint,
  };

  if (heroMeta.caption) {
    result.caption = heroMeta.caption;
  }

  return result;
}

/**
 * Scan MDX content for <Image> component references
 */
function extractInlineImageRefs(content: string): string[] {
  const imageRefs: string[] = [];
  // Match <Image src="..." /> patterns
  const regex = /<Image[^>]+src=["']([^"']+)["'][^>]*\/?>/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    if (match[1]) {
      imageRefs.push(match[1]);
    }
  }
  return imageRefs;
}

/**
 * Validate all image references in a blog post
 */
export function validatePostImages(
  slug: string,
  frontmatter: BlogPostFrontmatter,
  content: string
): ImageValidationResult {
  const imagesDir = getImagesContentDir();
  const errors: string[] = [];
  const warnings: string[] = [];
  const assets: ImageAsset[] = [];

  // Extended frontmatter may have hero field
  const hero = (frontmatter as BlogPostFrontmatter & { hero?: HeroImageMeta }).hero;

  // Validate hero image
  if (hero) {
    const heroPath = path.join(imagesDir, slug, hero.src);

    if (!fs.existsSync(heroPath)) {
      errors.push(`IMG_NOT_FOUND: Hero image file not found: ${heroPath}`);
    } else if (!isSupportedFormat(heroPath)) {
      errors.push(`IMG_INVALID_FORMAT: Unsupported hero image format: ${heroPath}`);
    } else {
      const stats = fs.statSync(heroPath);
      const { width, height } = getImageDimensions(heroPath);

      // Check for missing alt
      if (!hero.alt) {
        warnings.push(`IMG_MISSING_ALT: Missing alt text for hero image: ${heroPath}`);
      }

      // Check size threshold
      if (stats.size > IMAGE_CONFIG.sizeWarningThreshold) {
        const sizeKB = Math.round(stats.size / 1024);
        warnings.push(
          `IMG_OVERSIZED: Hero image exceeds size threshold (${String(sizeKB)}KB > 500KB): ${heroPath}`
        );
      }

      // Check dimension threshold
      if (width > IMAGE_CONFIG.dimensionWarningThreshold || height > IMAGE_CONFIG.dimensionWarningThreshold) {
        warnings.push(
          `IMG_LARGE_DIMENSIONS: Hero image dimensions exceed threshold (${String(width)}x${String(height)} > 2000px): ${heroPath}`
        );
      }

      assets.push({
        filePath: heroPath,
        slug,
        type: 'hero',
        width,
        height,
        format: path.extname(heroPath).slice(1).toLowerCase(),
        sizeBytes: stats.size,
      });
    }
  }

  // Validate inline images
  const inlineRefs = extractInlineImageRefs(content);

  for (const ref of inlineRefs) {
    // Check for external URLs
    if (ref.startsWith('http://') || ref.startsWith('https://')) {
      warnings.push(`IMG_EXTERNAL_URL: External image URL bypasses optimization: ${ref}`);
      continue;
    }

    const inlinePath = path.join(imagesDir, slug, ref);

    if (!fs.existsSync(inlinePath)) {
      errors.push(`IMG_NOT_FOUND: Inline image file not found: ${inlinePath}`);
    } else if (!isSupportedFormat(inlinePath)) {
      errors.push(`IMG_INVALID_FORMAT: Unsupported inline image format: ${inlinePath}`);
    } else {
      const stats = fs.statSync(inlinePath);
      const { width, height } = getImageDimensions(inlinePath);

      // Check size threshold
      if (stats.size > IMAGE_CONFIG.sizeWarningThreshold) {
        const sizeKB = Math.round(stats.size / 1024);
        warnings.push(
          `IMG_OVERSIZED: Inline image exceeds size threshold (${String(sizeKB)}KB > 500KB): ${inlinePath}`
        );
      }

      // Check dimension threshold
      if (width > IMAGE_CONFIG.dimensionWarningThreshold || height > IMAGE_CONFIG.dimensionWarningThreshold) {
        warnings.push(
          `IMG_LARGE_DIMENSIONS: Inline image dimensions exceed threshold (${String(width)}x${String(height)} > 2000px): ${inlinePath}`
        );
      }

      assets.push({
        filePath: inlinePath,
        slug,
        type: 'inline',
        width,
        height,
        format: path.extname(inlinePath).slice(1).toLowerCase(),
        sizeBytes: stats.size,
      });
    }
  }

  return {
    valid: errors.length === 0,
    filePath: path.join(imagesDir, slug),
    errors,
    warnings,
    assets,
  };
}

/**
 * Generate a simple blur placeholder data URL
 */
export function generateBlurPlaceholder(width: number, height: number): string {
  // Create a simple SVG placeholder with the correct aspect ratio
  const aspectRatio = width / height;
  const placeholderWidth = 10;
  const placeholderHeight = Math.round(placeholderWidth / aspectRatio);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${String(placeholderWidth)}" height="${String(placeholderHeight)}">
    <rect width="100%" height="100%" fill="#e2e8f0"/>
  </svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}
