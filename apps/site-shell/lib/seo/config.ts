/**
 * Global SEO Configuration
 * @see /specs/009-seo-metadata/data-model.md
 * Feature: 009-seo-metadata
 */

import type { GlobalSEOConfig } from './types';

/**
 * Centralized SEO configuration for site-wide defaults (FR-001)
 */
const globalSEOConfig: GlobalSEOConfig = {
  siteName: 'get2know.io',
  titleTemplate: '%s | get2know.io',
  defaultTitle: 'get2know.io',
  defaultDescription:
    'Learning out loud. A workshop where ideas come to life.',
  canonicalHost: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://get2know.io',
  defaultShareImage: '/assets/site-shell-og.svg',
  locale: 'en_US',
  allowedImageOrigins: [
    'https://get2know.io',
    'https://cdn.get2know.io',
  ],
};

/**
 * Get global SEO configuration (FR-001)
 * @returns GlobalSEOConfig object with all site-wide defaults
 */
export function getGlobalSEOConfig(): GlobalSEOConfig {
  return globalSEOConfig;
}
