#!/usr/bin/env node
/**
 * Preview Slug CLI
 * Feature: 004-preserve-slugs
 *
 * Preview the generated slug for a content file path.
 * Usage: npm run slug:preview -- "content/blog/my-post/index.md"
 */

import { generateSlug } from '../lib/slug';

function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: npm run slug:preview -- "<path>"');
    console.error('Example: npm run slug:preview -- "content/blog/my-post/index.md"');
    process.exit(1);
  }

  const inputPath = args[0];

  // Extract relative path from content/blog/
  let relativePath: string;
  const contentBlogPrefix = 'content/blog/';

  if (inputPath.includes(contentBlogPrefix)) {
    // Extract the part after content/blog/
    const idx = inputPath.indexOf(contentBlogPrefix);
    relativePath = inputPath.slice(idx + contentBlogPrefix.length);
  } else if (inputPath.includes('/index.md')) {
    // Already looks like a relative path
    relativePath = inputPath;
  } else {
    // Assume it's just a collection name
    relativePath = `${inputPath}/index.md`;
  }

  const result = generateSlug(relativePath);

  if (!result.isValid) {
    console.error('✗ Invalid path structure');
    console.error('');
    console.error(`  Error: ${result.error}`);
    console.error('');
    console.error('  Expected format: content/blog/{collection}/index.md');
    console.error('');
    console.error('  Rules:');
    console.error('    - Collection folder at exactly one level deep');
    console.error('    - File must be named "index.md"');
    console.error('    - Use lowercase letters, numbers, and hyphens');
    process.exit(1);
  }

  console.log(result.slug);
}

main();
