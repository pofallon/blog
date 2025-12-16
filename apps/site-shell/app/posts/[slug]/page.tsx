/**
 * Dynamic MDX Post Page
 * Renders MDX content at /posts/[slug]
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import { getAllSlugs, getPostBySlug } from '@/lib/mdx/loader';
import { MDXContent } from '@/components/mdx/MDXContent';

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * Generate static paths for all MDX posts
 */
export function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * Generate metadata for the post page
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const metadata: Metadata = {
    title: post.metadata.title,
    description: post.metadata.description,
  };

  if (post.metadata.image) {
    metadata.openGraph = {
      images: [{ url: post.metadata.image.url, alt: post.metadata.image.alt }],
    };
  }

  return metadata;
}

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * MDX Post Page Component
 */
export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { metadata, content } = post;

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      {/* Hero Image (optional) */}
      {metadata.image && (
        <div className="relative mb-8 h-64 w-full">
          <Image
            src={metadata.image.url}
            alt={metadata.image.alt}
            fill
            className="rounded-lg object-cover"
          />
        </div>
      )}

      {/* Post Header */}
      <header className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">{metadata.title}</h1>
        <time className="text-gray-600" dateTime={metadata.date}>
          {formatDate(metadata.date)}
        </time>
        <p className="mt-4 text-lg text-gray-700">{metadata.description}</p>
      </header>

      {/* MDX Content */}
      <MDXContent content={content} />
    </article>
  );
}
