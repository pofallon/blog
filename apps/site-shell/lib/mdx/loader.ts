/**
 * MDX file loader - reads and processes MDX files from content directory
 * @see /specs/003-add-mdx-support/research.md
 */

import fs from 'fs';
import path from 'path';
import { parseFrontmatter } from './parser';
import type { MDXEntry, MDXBuildSummary, ValidationResult } from './types';

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
