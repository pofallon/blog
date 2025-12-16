/**
 * Slug Verification
 * Feature: 004-preserve-slugs
 *
 * Verify content files against the canonical manifest.
 */

import {
  VerificationReport,
  VerificationDetail,
  VerificationStatus,
} from './types';
import { enumerateContentFiles } from './enumerate';
import { loadManifest } from './manifest';
import { generateSlug, detectCollisions } from './index';

/**
 * Verify a single slug against the manifest.
 *
 * @param relativePath - Path relative to content/blog/
 * @param actualSlug - Generated slug
 * @param manifestEntries - Map of relativePath to expected slug
 * @returns VerificationDetail for this file
 */
export function verifySlug(
  relativePath: string,
  actualSlug: string,
  manifestEntries: Map<string, string>
): VerificationDetail {
  const expectedSlug = manifestEntries.get(relativePath);

  let status: VerificationStatus;
  if (expectedSlug === undefined) {
    status = 'new';
  } else if (expectedSlug === actualSlug) {
    status = 'match';
  } else {
    status = 'mismatch';
  }

  return {
    relativePath,
    expectedSlug,
    actualSlug,
    status,
  };
}

/**
 * Generate a full verification report comparing content files to manifest.
 *
 * @param contentDir - Path to content/blog/ directory
 * @param manifestPath - Path to slug-manifest.json
 * @returns VerificationReport with all results
 * @throws SlugCollisionError if duplicate slugs detected
 */
export async function generateVerificationReport(
  contentDir: string,
  manifestPath: string
): Promise<VerificationReport> {
  const files = await enumerateContentFiles(contentDir);
  const manifest = loadManifest(manifestPath);

  // Build a map of manifest entries for lookup
  const manifestEntries = new Map<string, string>();
  if (manifest) {
    for (const entry of manifest.entries) {
      manifestEntries.set(entry.relativePath, entry.slug);
    }
  }

  // Generate slugs and verify each file
  const details: VerificationDetail[] = [];
  const slugResults = files.map((file) => generateSlug(file.relativePath));

  // Check for collisions first
  detectCollisions(slugResults);

  // Verify each file
  for (const file of files) {
    const result = generateSlug(file.relativePath);
    if (!result.isValid) {
      // Should not happen if enumeration passed, but handle gracefully
      details.push({
        relativePath: file.relativePath,
        actualSlug: '',
        status: 'mismatch',
      });
      continue;
    }

    const detail = verifySlug(
      file.relativePath,
      result.slug,
      manifestEntries
    );
    details.push(detail);

    // Remove from manifest entries to track missing files
    manifestEntries.delete(file.relativePath);
  }

  // Any remaining manifest entries are missing files
  for (const [relativePath, slug] of manifestEntries) {
    details.push({
      relativePath,
      expectedSlug: slug,
      actualSlug: '',
      status: 'missing',
    });
  }

  // Calculate counts
  const matches = details.filter((d) => d.status === 'match').length;
  const mismatches = details.filter((d) => d.status === 'mismatch').length;
  const newFiles = details.filter((d) => d.status === 'new').length;
  const missingFiles = details.filter((d) => d.status === 'missing').length;

  // Exit code: 0 only if all match (no mismatches, no missing)
  const exitCode = mismatches > 0 || missingFiles > 0 ? 1 : 0;

  return {
    timestamp: new Date().toISOString(),
    filesScanned: files.length,
    matches,
    mismatches,
    newFiles,
    missingFiles,
    details: details.filter((d) => d.status !== 'match'), // Only include non-matches
    exitCode,
  };
}
