/**
 * Blog Post Header Component
 * Displays title, formatted date, description, and optional hero image
 * @see /specs/006-blog-post-route/tasks.md T010
 * @see /specs/007-add-image-handling/tasks.md T011
 */

import { HeroImage } from '@/components/blog/HeroImage';
import type { ProcessedImage } from '@/lib/mdx/blog-post-types';
import type { ProcessedHeroImage } from '@/lib/mdx/image-types';

export interface BlogPostHeaderProps {
  title: string;
  formattedDate: string;
  rawDate: string;
  description: string;
  heroImage: ProcessedImage | null;
}

/**
 * Convert ProcessedImage to ProcessedHeroImage format
 */
function toHeroImage(image: ProcessedImage | null, _title: string): ProcessedHeroImage | null {
  if (!image) return null;
  const result: ProcessedHeroImage = {
    src: image.src,
    width: image.width,
    height: image.height,
    alt: image.alt,
  };
  if (image.blurDataURL) {
    result.blurDataURL = image.blurDataURL;
  }
  return result;
}

export function BlogPostHeader({
  title,
  formattedDate,
  rawDate,
  description,
  heroImage,
}: BlogPostHeaderProps) {
  return (
    <header className="mb-8">
      {/* Single h1 for title - proper heading hierarchy per T026a */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        {title}
      </h1>
      
      {/* Date and description */}
      <div className="flex flex-col gap-2 mb-6">
        <time
          dateTime={rawDate}
          className="text-sm text-gray-600 dark:text-gray-400"
        >
          {formattedDate}
        </time>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          {description}
        </p>
      </div>

      {/* Hero image using enhanced HeroImage component (T011) */}
      <HeroImage
        image={toHeroImage(heroImage, title)}
        postTitle={title}
        className="mb-6"
      />
    </header>
  );
}
