/**
 * Slug Manifest Operations
 * Feature: 004-preserve-slugs
 *
 * Load, save, and update slug manifest file.
 */

import { promises as fs } from 'fs';
import { SlugManifest, SlugManifestEntry, UpdateManifestFn } from './types';
import { enumerateContentFiles } from './enumerate';
import { generateSlug } from './index';

/**
 * Load the slug manifest from disk.
 *
 * @param manifestPath - Path to slug-manifest.json
 * @returns SlugManifest object or null if file doesn't exist
 */
export async function loadManifest(manifestPath: string): Promise<SlugManifest | null> {
  try {
    const content = await fs.readFile(manifestPath, 'utf-8');
    return JSON.parse(content) as SlugManifest;
  } catch {
    return null;
  }
}

/**
 * Save the slug manifest to disk.
 *
 * @param manifestPath - Path to slug-manifest.json
 * @param manifest - SlugManifest object to save
 */
export async function saveManifest(
  manifestPath: string,
  manifest: SlugManifest
): Promise<void> {
  const content = JSON.stringify(manifest, null, 2) + '\n';
  await fs.writeFile(manifestPath, content, 'utf-8');
}

/**
 * Update the manifest with current content files.
 * This is the explicit approval workflow (FR-006).
 *
 * @param contentDir - Path to content/blog/ directory
 * @param manifestPath - Path to slug-manifest.json
 * @returns Updated SlugManifest
 */
export const updateManifest: UpdateManifestFn = async (
  contentDir: string,
  manifestPath: string
): Promise<SlugManifest> => {
  const files = await enumerateContentFiles(contentDir);

  const entries: SlugManifestEntry[] = files.map((file) => {
    const result = generateSlug(file.relativePath);
    return {
      relativePath: file.relativePath,
      slug: result.slug,
    };
  });

  // Sort entries by relativePath for consistent output
  entries.sort((a, b) => a.relativePath.localeCompare(b.relativePath));

  const manifest: SlugManifest = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    entries,
  };

  await saveManifest(manifestPath, manifest);
  return manifest;
};
