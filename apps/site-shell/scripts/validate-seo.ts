#!/usr/bin/env npx tsx
/**
 * SEO Validation Script
 * Runs at build time to validate SEO metadata (FR-007, FR-008)
 * @see /specs/009-seo-metadata/contracts/seo-api.md
 */

import { getAllPostSlugs, getPostBySlug } from '../lib/mdx/blog-post-loader';
import { validateAllShareImages } from '../lib/seo/image-validator';
import type { BlogPostDocument } from '../lib/mdx/blog-post-types';
import type { SEOValidationWarning, SEOValidationError } from '../lib/seo';

interface ValidationReport {
  postsValidated: number;
  imagesValidated: number;
  warnings: SEOValidationWarning[];
  errors: SEOValidationError[];
}

async function validateSEO(): Promise<ValidationReport> {
  const slugs = getAllPostSlugs();
  const posts: BlogPostDocument[] = [];
  const warnings: SEOValidationWarning[] = [];
  const errors: SEOValidationError[] = [];

  console.log('\nSEO Validation Report');
  console.log('=====================\n');

  // Load all posts and check frontmatter
  for (const slug of slugs) {
    const post = getPostBySlug(slug);
    if (post) {
      posts.push(post);

      // Check for missing description (FR-008 warning)
      if (!post.frontmatter.description) {
        warnings.push({
          code: 'MISSING_DESCRIPTION',
          message: `content/blog/${slug}/index.mdx: Missing description`,
          field: 'description',
        });
      }

      // Check for missing hero image (FR-008 warning)
      const heroImage = post.frontmatter.hero || post.frontmatter.image;
      if (!heroImage) {
        warnings.push({
          code: 'MISSING_HERO_IMAGE',
          message: `content/blog/${slug}/index.mdx: Missing hero image`,
          field: 'hero',
        });
      }
    }
  }

  console.log(`✓ ${String(posts.length)} posts validated`);

  // Validate share images (FR-007)
  const imageResults = await validateAllShareImages(posts);
  const validImages = imageResults.filter((r) => r.valid);
  const invalidImages = imageResults.filter((r) => !r.valid);

  console.log(`✓ ${String(validImages.length)} share images validated`);

  // Convert invalid images to errors
  for (const result of invalidImages) {
    if (result.error) {
      errors.push({
        code:
          result.error.code === 'INVALID_ORIGIN'
            ? 'INVALID_IMAGE_ORIGIN'
            : result.error.code === 'TIMEOUT'
              ? 'IMAGE_TIMEOUT'
              : 'IMAGE_UNREACHABLE',
        message: `${result.url}: ${result.error.message}`,
        field: 'shareImage',
      });
    }
  }

  // Print warnings
  if (warnings.length > 0) {
    console.log(`\nWarnings (${String(warnings.length)}):`);
    for (const warning of warnings) {
      console.log(`  - ${warning.message}`);
    }
  }

  // Print errors
  if (errors.length > 0) {
    console.log(`\nErrors (${String(errors.length)}):`);
    for (const error of errors) {
      console.log(`  ✗ ${error.message}`);
    }
  }

  // Summary
  console.log('\n---------------------');
  if (errors.length === 0) {
    console.log('Build status: PASS\n');
  } else {
    console.log('Build status: FAIL\n');
  }

  return {
    postsValidated: posts.length,
    imagesValidated: imageResults.length,
    warnings,
    errors,
  };
}

// Run validation
validateSEO()
  .then((report) => {
    if (report.errors.length > 0) {
      process.exit(1);
    }
    process.exit(0);
  })
  .catch((error: unknown) => {
    console.error('SEO validation failed:', error);
    process.exit(1);
  });
