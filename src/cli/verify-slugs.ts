#!/usr/bin/env node
/**
 * Verify Slugs CLI
 * Feature: 004-preserve-slugs
 *
 * Verify all content files against the canonical slug manifest.
 * Usage: npm run verify-slugs [--json]
 */

import * as path from 'path';
import { generateVerificationReport } from '../lib/slug/verify';
import { ContentStructureError, SlugCollisionError } from '../lib/slug/types';

const CONTENT_DIR = path.resolve(process.cwd(), 'content/blog');
const MANIFEST_PATH = path.resolve(
  process.cwd(),
  'specs/004-preserve-slugs/slug-manifest.json'
);

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const jsonOutput = args.includes('--json');

  try {
    const report = await generateVerificationReport(CONTENT_DIR, MANIFEST_PATH);

    if (jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      printHumanReadable(report);
    }

    process.exit(report.exitCode);
  } catch (error) {
    if (error instanceof ContentStructureError) {
      if (jsonOutput) {
        console.log(
          JSON.stringify(
            {
              error: 'ContentStructureError',
              message: error.message,
              path: error.path,
              reason: error.reason,
            },
            null,
            2
          )
        );
      } else {
        console.error('✗ Content structure error');
        console.error(`  Path: ${error.path}`);
        console.error(`  Reason: ${error.reason}`);
        console.error(`  ${error.message}`);
      }
      process.exit(1);
    }

    if (error instanceof SlugCollisionError) {
      if (jsonOutput) {
        console.log(
          JSON.stringify(
            {
              error: 'SlugCollisionError',
              message: error.message,
              slug: error.slug,
              paths: error.paths,
            },
            null,
            2
          )
        );
      } else {
        console.error('✗ Slug collision detected');
        console.error(`  Slug: ${error.slug}`);
        console.error(`  Conflicting paths:`);
        for (const p of error.paths) {
          console.error(`    - ${p}`);
        }
      }
      process.exit(1);
    }

    // Unknown error
    console.error('✗ Unexpected error:', error);
    process.exit(1);
  }
}

interface VerificationReportForPrint {
  filesScanned: number;
  matches: number;
  mismatches: number;
  newFiles: number;
  missingFiles: number;
  exitCode: number;
  details: Array<{
    relativePath: string;
    status: string;
    expectedSlug?: string;
    actualSlug: string;
  }>;
}

function printHumanReadable(report: VerificationReportForPrint): void {
  const symbol = report.exitCode === 0 ? '✓' : '✗';

  console.log(`${symbol} Scanned ${report.filesScanned} files`);
  console.log(`  Matches: ${report.matches}`);
  console.log(`  Mismatches: ${report.mismatches}`);
  console.log(`  New files: ${report.newFiles}`);
  console.log(`  Missing from disk: ${report.missingFiles}`);
  console.log('');

  if (report.exitCode === 0 && report.newFiles === 0) {
    console.log('✓ All slugs match canonical manifest');
  } else if (report.exitCode === 0 && report.newFiles > 0) {
    console.log('✓ All existing slugs match');
    console.log('');
    console.log('New files detected (not in manifest):');
    for (const detail of report.details) {
      if (detail.status === 'new') {
        console.log(`  + ${detail.relativePath} → ${detail.actualSlug}`);
      }
    }
    console.log('');
    console.log('Run `npm run slug:update-manifest` to add them to the manifest.');
  } else {
    console.log('✗ Verification failed');
    console.log('');

    // Show mismatches
    const mismatches = report.details.filter((d) => d.status === 'mismatch');
    if (mismatches.length > 0) {
      console.log('Mismatches:');
      for (const detail of mismatches) {
        console.log(`  - ${detail.relativePath}`);
        console.log(`    Expected: ${detail.expectedSlug}`);
        console.log(`    Actual:   ${detail.actualSlug}`);
      }
      console.log('');
    }

    // Show missing files
    const missing = report.details.filter((d) => d.status === 'missing');
    if (missing.length > 0) {
      console.log('Missing from disk (in manifest but not found):');
      for (const detail of missing) {
        console.log(`  - ${detail.relativePath} (expected: ${detail.expectedSlug})`);
      }
      console.log('');
    }

    console.log('To fix:');
    console.log('  1. Restore original folder names, OR');
    console.log('  2. Run `npm run slug:update-manifest` to update the manifest');
  }
}

main();
