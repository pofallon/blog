/**
 * Content File Enumeration
 * Feature: 004-preserve-slugs
 *
 * Scans content/blog/ directory for valid content files.
 */

import * as fs from 'fs';
import * as path from 'path';
import { ContentSourceFile, ContentStructureError } from './types';

/**
 * Enumerate all valid content source files under content/blog/.
 * Validates that each entry follows {collection}/index.md pattern.
 *
 * @param contentDir - Path to content/blog/ directory
 * @returns Array of ContentSourceFile objects
 */
export async function enumerateContentFiles(
  contentDir: string
): Promise<ContentSourceFile[]> {
  const results: ContentSourceFile[] = [];

  // Check if directory exists
  if (!fs.existsSync(contentDir)) {
    return results;
  }

  // Read all entries in the content directory
  const entries = fs.readdirSync(contentDir, { withFileTypes: true });

  for (const entry of entries) {
    // Only process directories (collection folders)
    if (!entry.isDirectory()) {
      continue;
    }

    const collectionPath = path.join(contentDir, entry.name);
    const indexPath = path.join(collectionPath, 'index.md');

    // Check if index.md exists
    if (!fs.existsSync(indexPath)) {
      throw new ContentStructureError(
        `Missing index.md in collection folder: ${entry.name}`,
        entry.name,
        'missing-index'
      );
    }

    // Check for multiple markdown files
    const files = fs.readdirSync(collectionPath);
    const mdFiles = files.filter(
      (f) => f.endsWith('.md') || f.endsWith('.mdx')
    );
    if (mdFiles.length > 1) {
      throw new ContentStructureError(
        `Multiple markdown files in collection folder: ${entry.name}`,
        entry.name,
        'multiple-files'
      );
    }

    // Check for nested directories (wrong depth)
    const subdirs = fs
      .readdirSync(collectionPath, { withFileTypes: true })
      .filter((d) => d.isDirectory());
    // Allow asset directories but not nested content
    const nestedContent = subdirs.filter((d) => {
      const subPath = path.join(collectionPath, d.name, 'index.md');
      return fs.existsSync(subPath);
    });
    if (nestedContent.length > 0) {
      throw new ContentStructureError(
        `Nested content structure not allowed: ${entry.name}`,
        entry.name,
        'depth'
      );
    }

    results.push({
      relativePath: `${entry.name}/index.md`,
      absolutePath: indexPath,
      collection: entry.name,
      filename: 'index.md',
    });
  }

  return results;
}
