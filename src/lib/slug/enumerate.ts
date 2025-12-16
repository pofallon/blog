/**
 * Content File Enumeration
 * Feature: 004-preserve-slugs
 *
 * Scans content/blog/ directory for valid content files.
 */

import { promises as fs } from 'fs';
import * as path from 'path';
import { ContentSourceFile, ContentStructureError, EnumerateContentFilesFn } from './types';

/**
 * Enumerate all valid content source files under content/blog/.
 * Validates that each entry follows {collection}/index.md pattern.
 *
 * @param contentDir - Path to content/blog/ directory
 * @returns Array of ContentSourceFile objects
 */
export const enumerateContentFiles: EnumerateContentFilesFn = async (
  contentDir: string
): Promise<ContentSourceFile[]> => {
  const results: ContentSourceFile[] = [];

  // Check if directory exists
  try {
    await fs.access(contentDir);
  } catch {
    return results;
  }

  // Read all entries in the content directory
  const entries = await fs.readdir(contentDir, { withFileTypes: true });

  for (const entry of entries) {
    // Only process directories (collection folders)
    if (!entry.isDirectory()) {
      continue;
    }

    const collectionPath = path.join(contentDir, entry.name);
    const indexPath = path.join(collectionPath, 'index.md');

    // Check if index.md exists
    try {
      await fs.access(indexPath);
    } catch {
      throw new ContentStructureError(
        `Missing index.md in collection folder: ${entry.name}`,
        entry.name,
        'missing-index'
      );
    }

    // Check for multiple markdown files
    const files = await fs.readdir(collectionPath);
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
    const dirEntries = await fs.readdir(collectionPath, { withFileTypes: true });
    const subdirs = dirEntries.filter((d) => d.isDirectory());
    
    // Allow asset directories but not nested content
    for (const subdir of subdirs) {
      const subPath = path.join(collectionPath, subdir.name, 'index.md');
      try {
        await fs.access(subPath);
        throw new ContentStructureError(
          `Nested content structure not allowed: ${entry.name}`,
          entry.name,
          'depth'
        );
      } catch (e) {
        // If it's our ContentStructureError, rethrow it
        if (e instanceof ContentStructureError) {
          throw e;
        }
        // Otherwise, file doesn't exist which is fine
      }
    }

    results.push({
      relativePath: `${entry.name}/index.md`,
      absolutePath: indexPath,
      collection: entry.name,
      filename: 'index.md',
    });
  }

  return results;
};
