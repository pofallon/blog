/**
 * Blog Post Header Component
 * Displays title, formatted date, description, and optional hero image
 * @see /specs/006-blog-post-route/tasks.md T010
 */

import Image from 'next/image';
import type { ProcessedImage } from '@/lib/mdx/blog-post-types';

export interface BlogPostHeaderProps {
  title: string;
  formattedDate: string;
  rawDate: string;
  description: string;
  heroImage: ProcessedImage | null;
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

      {/* Hero image if present */}
      {heroImage && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-6">
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            width={heroImage.width}
            height={heroImage.height}
            className="object-cover"
            priority
          />
        </div>
      )}
    </header>
  );
}
