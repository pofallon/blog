/**
 * Blog Post Loader - reads and processes blog posts from content/blog directory
 * @see /specs/006-blog-post-route/data-model.md
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import type {
  BlogPostDocument,
  BlogPostFrontmatter,
  BlogPostPageModel,
  HeroImageMeta,
} from './blog-post-types';
import type { ProcessedImage } from './types';
import { loadHeroImage, validatePostImages } from './image-loader';
import type { ProcessedHeroImage } from './image-types';

// Content directory path for blog posts (relative to monorepo root)
function getBlogContentDir(): string {
  const possiblePaths = [
    path.join(process.cwd(), 'content/blog'),
    path.join(process.cwd(), '../../content/blog'),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  return path.join(process.cwd(), 'content/blog');
}

/**
 * Find the index file (index.md or index.mdx) in a post directory
 */
function findIndexFile(postDir: string): string | null {
  const extensions = ['.md', '.mdx'];
  for (const ext of extensions) {
    const indexPath = path.join(postDir, `index${ext}`);
    if (fs.existsSync(indexPath)) {
      return indexPath;
    }
  }
  return null;
}

/**
 * Load a single blog post by slug
 * @param slug The post slug (directory name)
 * @returns BlogPostDocument or null if not found
 */
export function getPostBySlug(slug: string): BlogPostDocument | null {
  const contentDir = getBlogContentDir();
  const postDir = path.join(contentDir, slug);

  // Check if directory exists
  if (!fs.existsSync(postDir) || !fs.statSync(postDir).isDirectory()) {
    return null;
  }

  // Find index file
  const indexPath = findIndexFile(postDir);
  if (!indexPath) {
    return null;
  }

  const rawContent = fs.readFileSync(indexPath, 'utf-8');
  const { data, content } = matter(rawContent);

  // Log warnings for missing required fields (FR-006)
  if (!data.title) {
    console.warn(`[006] Missing title in ${slug}/index.md`);
  }
  if (!data.date) {
    console.warn(`[006] Missing date in ${slug}/index.md`);
  }

  // Handle date - gray-matter may return Date object or string
  let dateString = 'Unknown Date';
  if (data.date) {
    if (data.date instanceof Date) {
      // Convert Date object to ISO string (YYYY-MM-DD)
      dateString = data.date.toISOString().split('T')[0] ?? 'Unknown Date';
    } else {
      dateString = String(data.date);
    }
  }

  // Build frontmatter with required fields
  const frontmatter: BlogPostFrontmatter = {
    title: (data.title as string) || 'Untitled Post',
    date: dateString,
  };

  // Add optional fields only if present
  if (data.description) {
    frontmatter.description = data.description as string;
  }
  if (data.image) {
    frontmatter.image = data.image as BlogPostFrontmatter['image'];
  }
  if (data.hero) {
    frontmatter.hero = data.hero as HeroImageMeta;
  }
  if (data.playlists) {
    frontmatter.playlists = data.playlists as BlogPostFrontmatter['playlists'];
  }

  return {
    slug,
    content,
    frontmatter,
    filePath: indexPath,
  };
}

/**
 * Get all valid post slugs for static generation
 * @returns Array of slug strings
 */
export function getAllPostSlugs(): string[] {
  const contentDir = getBlogContentDir();

  if (!fs.existsSync(contentDir)) {
    return [];
  }

  const entries = fs.readdirSync(contentDir, { withFileTypes: true });
  const slugs: string[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const indexPath = findIndexFile(path.join(contentDir, entry.name));
      if (indexPath) {
        // Check if content uses Gatsby-specific patterns that won't work
        const content = fs.readFileSync(indexPath, 'utf-8');
        const usesGatsbyPatterns = content.includes('props.playlists') ||
          content.includes('props.pageContext');

        if (usesGatsbyPatterns) {
          console.warn(`[006] Skipping ${entry.name} - uses Gatsby-specific patterns`);
          continue;
        }

        slugs.push(entry.name);
      }
    }
  }

  return slugs;
}

/**
 * Generate an excerpt from content when description is missing
 */
function generateExcerpt(content: string, maxLength = 160): string {
  const plainText = content
    .replace(/^#+\s+.*/gm, '') // Remove headers
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/<[^>]+>/g, '') // Remove JSX/HTML tags
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links → text only
    .replace(/[*_`~]/g, '') // Remove formatting chars
    .replace(/\n+/g, ' ') // Normalize whitespace
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '…';
}

/**
 * Process hero image from frontmatter
 */
function processHeroImage(
  image: BlogPostFrontmatter['image'],
  filePath: string
): ProcessedImage | null {
  if (!image) {
    return null;
  }

  // Handle string format (e.g., './reinvent.png')
  if (typeof image === 'string') {
    const postDir = path.dirname(filePath);
    const imagePath = image.replace(/^\.\//, '');
    return {
      src: `/blog-images/${path.basename(postDir)}/${imagePath}`,
      width: 1200,
      height: 630,
      alt: 'Blog post hero image',
    };
  }

  // Handle object format
  return {
    src: image.src,
    width: 1200,
    height: 630,
    alt: image.alt || 'Blog post hero image',
  };
}

/**
 * Transform BlogPostDocument to BlogPostPageModel
 * @param doc Source document from getPostBySlug
 * @returns View model ready for rendering
 */
export async function transformToPageModel(
  doc: BlogPostDocument
): Promise<BlogPostPageModel> {
  const { slug, content, frontmatter, filePath } = doc;

  // Parse and format date
  let formattedDate: string;
  let rawDate: string;

  if (
    frontmatter.date === 'Unknown Date' ||
    isNaN(new Date(frontmatter.date).getTime())
  ) {
    formattedDate = frontmatter.date;
    rawDate = frontmatter.date;
  } else {
    // Parse date as UTC to avoid timezone issues
    const dateParts = frontmatter.date.split('-').map(Number);
    const year = dateParts[0] ?? 1970;
    const month = dateParts[1] ?? 1;
    const day = dateParts[2] ?? 1;
    const date = new Date(Date.UTC(year, month - 1, day));

    formattedDate = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    });
    rawDate = frontmatter.date;
  }

  // Generate description fallback
  const description = frontmatter.description || generateExcerpt(content, 160);

  // Prepare scope with frontmatter data for MDX expressions
  // This allows content to access props.playlists, etc.
  const scope = {
    props: {
      playlists: frontmatter.playlists || [],
    },
  };

  // Compile MDX content with scope
  const compiledContent = await serialize(content, { scope });

  // Validate images if hero is present (T008)
  if (frontmatter.hero) {
    const validation = validatePostImages(slug, frontmatter, content);
    // Log warnings but don't fail
    for (const warning of validation.warnings) {
      console.warn(`[007] ${warning}`);
    }
    // Log errors (these indicate missing files)
    for (const error of validation.errors) {
      console.error(`[007] ${error}`);
    }
  }

  // Process hero image - prefer new hero field, fallback to legacy image field
  let heroImage: ProcessedImage | null = null;

  if (frontmatter.hero) {
    // Use new hero format with enhanced features
    const processedHero: ProcessedHeroImage | null = loadHeroImage(slug, frontmatter.hero);
    if (processedHero) {
      const result: ProcessedImage = {
        src: processedHero.src,
        width: processedHero.width,
        height: processedHero.height,
        alt: processedHero.alt,
      };
      if (processedHero.blurDataURL) {
        result.blurDataURL = processedHero.blurDataURL;
      }
      heroImage = result;
    }
  } else {
    // Fallback to legacy image format
    heroImage = processHeroImage(frontmatter.image, filePath);
  }

  return {
    slug,
    title: frontmatter.title,
    formattedDate,
    rawDate,
    description,
    canonicalUrl: `https://get2know.io/blog/${slug}`,
    compiledContent,
    heroImage,
  };
}
