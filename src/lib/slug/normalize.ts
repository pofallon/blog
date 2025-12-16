/**
 * Slug Normalization
 * Feature: 004-preserve-slugs
 *
 * Normalizes strings for use in URLs following data-model.md rules.
 */

import slugify from 'slugify';
import { NormalizeForSlugFn } from './types';

/**
 * Normalize a string for use in URLs.
 * Applies: lowercase, hyphenation, ASCII transliteration, removes special chars.
 *
 * @param input - Raw string (e.g., folder name)
 * @returns Normalized string (lowercase, hyphenated, ASCII-safe)
 */
export const normalizeForSlug: NormalizeForSlugFn = (input: string): string => {
  // Use slugify with strict mode for ASCII transliteration
  const normalized = slugify(input, {
    lower: true, // Convert to lowercase
    strict: true, // Strip special characters
    trim: true, // Remove leading/trailing hyphens
  });

  // Collapse consecutive hyphens to single hyphen
  return normalized.replace(/-+/g, '-');
};
