/**
 * MDX file loader - reads and processes MDX files from content directory
 * @see /specs/003-add-mdx-support/research.md
 */

import fs from 'fs';
import path from 'path';
import { parseFrontmatter } from './parser';
import type { MDXEntry, MDXBuildSummary, ValidationResult, BlogIndexEntry, BlogIndexOptions } from './types';

// Content directory path (relative to monorepo root)
function getContentDir(): string {
  // Handle both development (apps/site-shell) and build contexts
  const possiblePaths = [
    path.join(process.cwd(), 'content/posts'),
    path.join(process.cwd(), '../../content/posts'),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  // Default to monorepo root structure
  return path.join(process.cwd(), 'content/posts');
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

  const files = fs.readdirSync(contentDir);
  const mdxFiles = files.filter((file) => file.endsWith('.mdx'));

  // Check for duplicate slugs
  const slugs = mdxFiles.map((file) => path.basename(file, '.mdx'));
  const slugMap = new Map<string, string[]>();

  mdxFiles.forEach((file) => {
    const slug = path.basename(file, '.mdx');
    const existing = slugMap.get(slug) ?? [];
    existing.push(file);
    slugMap.set(slug, existing);
  });

  // Detect duplicates
  for (const [slug, fileList] of slugMap) {
    if (fileList.length > 1) {
      throw new Error(
        `[Build Error] Duplicate slug "${slug}" found in: ${fileList.join(', ')}`
      );
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

  const files = fs.readdirSync(contentDir);
  const mdxFiles = files.filter((file) => file.endsWith('.mdx'));

  const posts: MDXEntry[] = [];
  const validationResults: ValidationResult[] = [];
  const allWarnings: string[] = [];

  // Check for duplicate slugs first
  getAllSlugs(); // This will throw if duplicates exist

  for (const file of mdxFiles) {
    const filePath = path.join(contentDir, file);
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const slug = path.basename(file, '.mdx');

    const { metadata, content, validation } = parseFrontmatter(rawContent, filePath);
    validationResults.push(validation);

    if (!validation.valid) {
      // Log errors and fail build
      console.error(`\n❌ Validation failed for ${filePath}:`);
      validation.errors.forEach((err) => {
        console.error(`   ${err}`);
      });
      throw new Error(validation.errors[0]);
    }

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
    totalFiles: mdxFiles.length,
    validFiles: validationResults.filter((r) => r.valid).length,
    invalidFiles: validationResults.filter((r) => !r.valid).length,
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

  return {
    slug: entry.slug,
    title,
    formattedDate,
    rawDate: entry.metadata.date,
    summary,
    url: `/blog/${entry.slug}`,
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
