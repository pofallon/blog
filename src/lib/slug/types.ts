/**
 * Slug API Types
 * Feature: 004-preserve-slugs
 *
 * TypeScript interface definitions for the deterministic slug generation system.
 */

// ============================================================================
// Core Types
// ============================================================================

/**
 * Represents a content source file under content/blog/
 */
export interface ContentSourceFile {
  /** Path relative to content/blog/, e.g., "playlist-reinvent-2019/index.md" */
  relativePath: string;

  /** Full filesystem path */
  absolutePath: string;

  /** Parent directory name (collection identifier) */
  collection: string;

  /** Filename, must be "index.md" */
  filename: string;
}

/**
 * Result of slug generation
 */
export interface SlugResult {
  /** Generated slug, e.g., "/playlist-reinvent-2019/" */
  slug: string;

  /** Original relative path that produced this slug */
  sourcePath: string;

  /** Whether the path structure was valid */
  isValid: boolean;

  /** Error message if isValid is false */
  error?: string;
}

/**
 * Entry in the canonical slug manifest
 */
export interface SlugManifestEntry {
  /** Path relative to content/blog/ */
  relativePath: string;

  /** Canonical slug for this path */
  slug: string;
}

/**
 * Full slug manifest structure
 */
export interface SlugManifest {
  /** Semantic version of manifest format */
  version: string;

  /** ISO 8601 timestamp when manifest was generated */
  generatedAt: string;

  /** Array of path-to-slug mappings */
  entries: SlugManifestEntry[];
}

/**
 * Verification status for a single file
 */
export type VerificationStatus = 'match' | 'mismatch' | 'new' | 'missing';

/**
 * Detail record for verification report
 */
export interface VerificationDetail {
  /** Relative path of the file */
  relativePath: string;

  /** Expected slug from manifest (undefined if new file) */
  expectedSlug?: string;

  /** Actual slug generated */
  actualSlug: string;

  /** Verification result */
  status: VerificationStatus;
}

/**
 * Full verification report
 */
export interface VerificationReport {
  /** ISO 8601 timestamp of verification run */
  timestamp: string;

  /** Total number of content files processed */
  filesScanned: number;

  /** Count of files with matching slugs */
  matches: number;

  /** Count of files with slug discrepancies */
  mismatches: number;

  /** Count of files not in manifest */
  newFiles: number;

  /** Count of manifest entries without corresponding files */
  missingFiles: number;

  /** Detailed results for each discrepancy */
  details: VerificationDetail[];

  /** Exit code: 0 if all match, 1 otherwise */
  exitCode: number;
}

// ============================================================================
// Function Signatures
// ============================================================================

/**
 * Generate a slug from a content file's relative path.
 */
export type GenerateSlugFn = (relativePath: string) => SlugResult;

/**
 * Normalize a string for use in URLs.
 */
export type NormalizeForSlugFn = (input: string) => string;

/**
 * Verify all content files against the canonical manifest.
 */
export type VerifySlugsFn = (
  contentDir: string,
  manifestPath: string
) => Promise<VerificationReport>;

/**
 * Enumerate all valid content source files.
 */
export type EnumerateContentFilesFn = (
  contentDir: string
) => Promise<ContentSourceFile[]>;

/**
 * Update the canonical manifest with current slugs.
 */
export type UpdateManifestFn = (
  contentDir: string,
  manifestPath: string
) => Promise<SlugManifest>;

// ============================================================================
// Error Types
// ============================================================================

/**
 * Error thrown when content structure is invalid
 */
export class ContentStructureError extends Error {
  public readonly path: string;
  public readonly reason: 'depth' | 'missing-index' | 'multiple-files';

  constructor(
    message: string,
    path: string,
    reason: 'depth' | 'missing-index' | 'multiple-files'
  ) {
    super(message);
    this.name = 'ContentStructureError';
    this.path = path;
    this.reason = reason;
  }
}

/**
 * Error thrown when slug collision is detected
 */
export class SlugCollisionError extends Error {
  public readonly slug: string;
  public readonly paths: string[];

  constructor(message: string, slug: string, paths: string[]) {
    super(message);
    this.name = 'SlugCollisionError';
    this.slug = slug;
    this.paths = paths;
  }
}
