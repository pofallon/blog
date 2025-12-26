/**
 * MDX file loader - reads and processes MDX files from content directory
 * @see /specs/003-add-mdx-support/research.md
 */

import fs from 'fs';
import path from 'path';
import { parseFrontmatter } from './parser';
import { loadHeroImage } from './image-loader';
import type { MDXEntry, MDXBuildSummary, ValidationResult, BlogIndexEntry, BlogIndexOptions, ProcessedImage } from './types';

// Content directory path (relative to monorepo root)
function getContentDir(): string {
  // Handle both development (apps/site-shell) and build contexts
  const possiblePaths = [
    path.join(process.cwd(), 'content/blog'),
    path.join(process.cwd(), '../../content/blog'),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  // Default to monorepo root structure
  return path.join(process.cwd(), 'content/blog');
}

/**
 * Get all MDX post slugs for static generation
 * @returns Array of slug strings
 */
export function getAllSlugs(): string[] {
  const contentDir = getContentDir();

  if (!fs.existsSync(contentDir)) {
    return [];
  }

  const entries = fs.readdirSync(contentDir, { withFileTypes: true });
  const slugs: string[] = [];

  for (const entry of entries) {
    // Only process directories (folder-based slugs per 006 spec)
    if (entry.isDirectory()) {
      // Check for index file existence (md or mdx)
      const hasIndex =
        fs.existsSync(path.join(contentDir, entry.name, 'index.md')) ||
        fs.existsSync(path.join(contentDir, entry.name, 'index.mdx'));

      if (hasIndex) {
        slugs.push(entry.name);
      }
    }
  }

  return slugs;
}

/**
 * Get all MDX posts with full metadata and content
 * @returns Array of MDX entries and build summary
 */
export function getAllPosts(): {
  posts: MDXEntry[];
  summary: MDXBuildSummary;
} {
  const contentDir = getContentDir();

  if (!fs.existsSync(contentDir)) {
    return {
      posts: [],
      summary: {
        totalFiles: 0,
        validFiles: 0,
        invalidFiles: 0,
        warnings: [],
        processedSlugs: [],
      },
    };
  }

  const entries = fs.readdirSync(contentDir, { withFileTypes: true });
  const posts: MDXEntry[] = [];
  const validationResults: ValidationResult[] = [];
  const allWarnings: string[] = [];

  let validFilesCount = 0;
  let invalidFilesCount = 0;

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const slug = entry.name;
    const postDir = path.join(contentDir, slug);

    // Find index file
    let indexFile = 'index.md';
    if (!fs.existsSync(path.join(postDir, indexFile))) {
      indexFile = 'index.mdx';
    }

    const filePath = path.join(postDir, indexFile);

    if (!fs.existsSync(filePath)) continue;

    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const { metadata, content, validation } = parseFrontmatter(rawContent, filePath);
    validationResults.push(validation);

    if (!validation.valid) {
      console.error(`\n❌ Validation failed for ${filePath}:`);
      validation.errors.forEach((err) => {
        console.error(`   ${err}`);
      });
      // We don't throw here to allow other posts to load, but we track invalid count
      invalidFilesCount++;
      continue;
    }

    validFilesCount++;

    if (validation.warnings.length > 0) {
      allWarnings.push(...validation.warnings);
      validation.warnings.forEach((warn) => {
        console.warn(`⚠️  ${warn}`);
      });
    }

    posts.push({
      slug,
      metadata,
      content,
      filePath,
    });
  }

  const summary: MDXBuildSummary = {
    totalFiles: validFilesCount + invalidFilesCount,
    validFiles: validFilesCount,
    invalidFiles: invalidFilesCount,
    warnings: allWarnings,
    processedSlugs: posts.map((p) => p.slug),
  };

  // Log build summary (FR-008)
  console.log(`\n📄 MDX Build Summary:`);
  console.log(`   Total files: ${String(summary.totalFiles)}`);
  console.log(`   Valid: ${String(summary.validFiles)}`);
  console.log(`   Invalid: ${String(summary.invalidFiles)}`);
  if (summary.warnings.length > 0) {
    console.log(`   Warnings: ${String(summary.warnings.length)}`);
  }

  return { posts, summary };
}

/**
 * Get a single post by slug
 * @param slug The post slug (derived from filename)
 * @returns MDX entry or null if not found
 */
export function getPostBySlug(slug: string): MDXEntry | null {
  const contentDir = getContentDir();
  const filePath = path.join(contentDir, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const rawContent = fs.readFileSync(filePath, 'utf-8');
  const { metadata, content, validation } = parseFrontmatter(rawContent, filePath);

  if (!validation.valid) {
    console.error(`\n❌ Validation failed for ${filePath}:`);
    validation.errors.forEach((err) => {
      console.error(`   ${err}`);
    });
    throw new Error(validation.errors[0]);
  }

  return {
    slug,
    metadata,
    content,
    filePath,
  };
}

/**
 * Generate an excerpt from MDX content when description is missing
 * Strips MDX/Markdown syntax and truncates to maxLength
 */
function generateExcerpt(content: string, maxLength = 160): string {
  const plainText = content
    .replace(/^#+\s+.*/gm, '')           // Remove headers
    .replace(/```[\s\S]*?```/g, '')      // Remove code blocks
    .replace(/<[^>]+>/g, '')             // Remove JSX/HTML tags
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links → text only
    .replace(/[*_`~]/g, '')              // Remove formatting chars
    .replace(/\n+/g, ' ')                // Normalize whitespace
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  // Truncate at word boundary
  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '…';
}

/**
 * Transform an MDXEntry to a BlogIndexEntry for display
 * @see /specs/005-build-blog-index/data-model.md
 */
export function transformToBlogIndexEntry(entry: MDXEntry): BlogIndexEntry {
  const title = entry.metadata.title || 'Untitled Post';
  // Parse date as UTC to avoid timezone-related off-by-one errors
  const dateParts = entry.metadata.date.split('-').map(Number);
  const year = dateParts[0] ?? 1970;
  const month = dateParts[1] ?? 1;
  const day = dateParts[2] ?? 1;
  const date = new Date(Date.UTC(year, month - 1, day));

  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });

  const summary = entry.metadata.description || generateExcerpt(entry.content);

  // Process hero image - prefer hero field, fallback to image field
  let heroImage: ProcessedImage | null = null;
  if (entry.metadata.hero) {
    const processed = loadHeroImage(entry.slug, entry.metadata.hero);
    if (processed) {
      heroImage = {
        src: processed.src,
        width: processed.width,
        height: processed.height,
        alt: processed.alt,
        blurDataURL: processed.blurDataURL,
      };
    }
  } else if (entry.metadata.image) {
    // Basic support for legacy image field
    heroImage = {
      src: entry.metadata.image.url,
      width: 1200,
      height: 630,
      alt: entry.metadata.image.alt,
    };
  }

  return {
    slug: entry.slug,
    title,
    formattedDate,
    rawDate: entry.metadata.date,
    summary,
    url: `/blog/${entry.slug}`,
    heroImage,
  };
}

/**
 * Get all posts sorted and filtered for index display
 * @param options Configuration for filtering/limiting posts
 * @returns Array of BlogIndexEntry sorted newest-first
 * @see /specs/005-build-blog-index/data-model.md
 */
export function getAllPostsForIndex(
  options: BlogIndexOptions = {}
): BlogIndexEntry[] {
  const { includeFuture = false, limit } = options;
  const { posts } = getAllPosts();

  // Filter future-dated posts using UTC comparison
  let filteredPosts = posts;
  if (!includeFuture) {
    const nowUTC = new Date();
    filteredPosts = posts.filter(post => {
      const dateParts = post.metadata.date.split('-').map(Number);
      const year = dateParts[0] ?? 1970;
      const month = dateParts[1] ?? 1;
      const day = dateParts[2] ?? 1;
      const postDate = new Date(Date.UTC(year, month - 1, day));
      return postDate <= nowUTC;
    });
  }

  // Sort by date descending, then title ascending (A→Z tiebreaker)
  const sortedPosts = filteredPosts.sort((a, b) => {
    // Compare dates as strings (YYYY-MM-DD format sorts correctly)
    if (a.metadata.date !== b.metadata.date) {
      return b.metadata.date.localeCompare(a.metadata.date); // Newest first
    }

    // Tiebreaker: alphabetical by title (handle missing titles)
    const titleA = a.metadata.title || 'Untitled Post';
    const titleB = b.metadata.title || 'Untitled Post';
    return titleA.localeCompare(titleB);
  });

  // Apply limit if specified
  const limitedPosts = limit ? sortedPosts.slice(0, limit) : sortedPosts;

  // Transform to view model
  return limitedPosts.map(transformToBlogIndexEntry);
}
