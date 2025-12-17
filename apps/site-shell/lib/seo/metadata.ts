/**
 * SEO Metadata Generation Utilities
 * @see /specs/009-seo-metadata/contracts/seo-api.md
 * Feature: 009-seo-metadata
 */

import type { Metadata } from 'next';
import type { BlogPostFrontmatter, HeroImageMeta, ImageMeta } from '@/lib/mdx/blog-post-types';
import type { PageMetadataOverride, ShareImageMeta } from './types';
import { getGlobalSEOConfig } from './config';
import { buildCanonicalUrl, resolveShareImageUrl } from './url-builder';

/**
 * Type guard for HeroImageMeta
 */
function isHeroImageMeta(image: HeroImageMeta | ImageMeta | string): image is HeroImageMeta {
  return typeof image === 'object' && 'alt' in image && typeof image.alt === 'string';
}

/**
 * Build metadata for a blog post page (FR-004, FR-005)
 * @param frontmatter - Parsed blog post frontmatter
 * @param slug - Post slug for URL generation
 * @returns Next.js Metadata object with OG and Twitter tags
 */
export function buildBlogPostMetadata(
  frontmatter: BlogPostFrontmatter,
  slug: string
): Metadata {
  const config = getGlobalSEOConfig();

  const title = frontmatter.title;
  const description = frontmatter.description || config.defaultDescription;
  const canonicalUrl = buildCanonicalUrl(`/blog/${slug}`);

  // Resolve hero image with fallback to default
  const heroImage = frontmatter.hero || frontmatter.image;
  let imageUrl = resolveShareImageUrl(heroImage, slug);
  let imageAlt = title;

  // Extract alt text from hero if available
  if (heroImage && typeof heroImage !== 'string' && isHeroImageMeta(heroImage)) {
    imageAlt = heroImage.alt || title;
  }

  // Use default share image if no hero
  if (!imageUrl) {
    imageUrl = resolveShareImageUrl(config.defaultShareImage);
  }

  const hasImage = !!imageUrl;

  const metadata: Metadata = {
    title: config.titleTemplate.replace('%s', title),
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    // OpenGraph metadata (FR-004)
    openGraph: {
      title,
      description,
      type: 'article',
      url: canonicalUrl,
      siteName: config.siteName,
      locale: config.locale,
      publishedTime: frontmatter.date,
      ...(hasImage &&
        imageUrl && {
          images: [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: imageAlt,
            },
          ],
        }),
    },
    // Twitter card metadata (FR-005)
    twitter: {
      card: hasImage ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(hasImage && imageUrl && { images: [imageUrl] }),
      ...(config.twitterHandle && { site: `@${config.twitterHandle}` }),
    },
  };

  return metadata;
}

/**
 * Build complete metadata for a page (FR-002, FR-003)
 * @param override - Optional page-specific overrides
 * @param path - Current page path for canonical URL
 * @returns Next.js Metadata object
 */
export function buildPageMetadata(
  override?: PageMetadataOverride,
  path?: string
): Metadata {
  const config = getGlobalSEOConfig();

  const title = override?.title || config.defaultTitle;
  const description = override?.description || config.defaultDescription;
  const canonicalPath = override?.canonicalPath || path || '/';
  const canonicalUrl = buildCanonicalUrl(canonicalPath);

  // Resolve share image
  let shareImage: ShareImageMeta | null = null;
  if (override?.shareImage) {
    if (typeof override.shareImage === 'string') {
      const imageUrl = resolveShareImageUrl(override.shareImage);
      if (imageUrl) {
        shareImage = { url: imageUrl, alt: title, width: 1200, height: 630 };
      }
    } else {
      const imageUrl = resolveShareImageUrl(override.shareImage.url);
      if (imageUrl) {
        shareImage = {
          url: imageUrl,
          width: override.shareImage.width || 1200,
          height: override.shareImage.height || 630,
          alt: override.shareImage.alt,
        };
      }
    }
  }

  // Use default share image if no override
  if (!shareImage) {
    const defaultUrl = resolveShareImageUrl(config.defaultShareImage);
    if (defaultUrl) {
      shareImage = { url: defaultUrl, alt: title, width: 1200, height: 630 };
    }
  }

  // Apply title template for non-default titles
  const formattedTitle =
    title === config.defaultTitle ? title : config.titleTemplate.replace('%s', title);

  const metadata: Metadata = {
    title: formattedTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    // Handle noIndex
    ...(override?.noIndex && {
      robots: {
        index: false,
        follow: true,
      },
    }),
    // OpenGraph metadata
    openGraph: {
      title,
      description,
      type: override?.ogType || 'website',
      url: canonicalUrl,
      siteName: config.siteName,
      locale: config.locale,
      ...(override?.publishedTime && { publishedTime: override.publishedTime }),
      ...(shareImage && {
        images: [
          {
            url: shareImage.url,
            width: shareImage.width || 1200,
            height: shareImage.height || 630,
            alt: shareImage.alt,
          },
        ],
      }),
    },
    // Twitter card metadata
    twitter: {
      card: shareImage ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(shareImage && { images: [shareImage.url] }),
      ...(config.twitterHandle && { site: `@${config.twitterHandle}` }),
    },
  };

  return metadata;
}
