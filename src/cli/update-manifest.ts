#!/usr/bin/env node
/**
 * Update Manifest CLI
 * Feature: 004-preserve-slugs
 *
 * Update the slug manifest with current content files.
 * Usage: npm run slug:update-manifest
 */

import * as path from 'path';
import { updateManifest } from '../lib/slug/manifest';
import { ContentStructureError } from '../lib/slug/types';

const CONTENT_DIR = path.resolve(process.cwd(), 'content/blog');
const MANIFEST_PATH = path.resolve(
  process.cwd(),
  'specs/004-preserve-slugs/slug-manifest.json'
);

async function main(): Promise<void> {
  try {
    const manifest = await updateManifest(CONTENT_DIR, MANIFEST_PATH);

    console.log('✓ Manifest updated successfully');
    console.log(`  Version: ${manifest.version}`);
    console.log(`  Generated: ${manifest.generatedAt}`);
    console.log(`  Entries: ${manifest.entries.length}`);
    console.log('');
    console.log('Files in manifest:');
    for (const entry of manifest.entries) {
      console.log(`  ${entry.relativePath} → ${entry.slug}`);
    }
    console.log('');
    console.log(`Manifest saved to: ${MANIFEST_PATH}`);
    console.log('');
    console.log('Next steps:');
    console.log('  git add specs/004-preserve-slugs/slug-manifest.json');
    console.log('  git commit -m "chore: update slug manifest"');

    process.exit(0);
  } catch (error) {
    if (error instanceof ContentStructureError) {
      console.error('✗ Content structure error');
      console.error(`  Path: ${error.path}`);
      console.error(`  Reason: ${error.reason}`);
      console.error(`  ${error.message}`);
      process.exit(1);
    }

    console.error('✗ Unexpected error:', error);
    process.exit(1);
  }
}

main();
