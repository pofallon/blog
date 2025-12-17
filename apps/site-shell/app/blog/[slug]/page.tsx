/**
 * Blog Post Dynamic Route Page
 * Renders individual blog posts at /blog/[slug]
 * @see /specs/006-blog-post-route/
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getPostBySlug,
  getAllPostSlugs,
  transformToPageModel,
} from '@/lib/mdx/blog-post-loader';
import {
  BlogPostHeader,
  BlogPostBody,
  BlogPostNav,
} from '@/components/blog-post';
import type { BlogPostPageProps, BlogPostParams } from '@/lib/mdx/blog-post-types';

/**
 * Generate static params for all blog posts
 * Pre-renders all known slugs at build time
 */
export function generateStaticParams(): BlogPostParams[] {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * Generate metadata for SEO (User Story 2)
 * Returns title, description, canonical URL, OpenGraph, and Twitter card metadata
 */
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getPostBySlug(slug);

  if (!doc) {
    return { title: 'Post Not Found' };
  }

  const title = doc.frontmatter.title;
  const description =
    doc.frontmatter.description || `Read ${title} on get2know.io`;
  const canonicalUrl = `https://get2know.io/blog/${slug}`;

  // Process hero image for social metadata
  const heroImage = doc.frontmatter.image;
  let imageUrl: string | undefined;
  if (heroImage) {
    if (typeof heroImage === 'string') {
      imageUrl = `https://get2know.io/blog-images/${slug}/${heroImage.replace(/^\.\//, '')}`;
    } else {
      imageUrl = heroImage.src.startsWith('http') 
        ? heroImage.src 
        : `https://get2know.io${heroImage.src}`;
    }
  }

  // Base metadata
  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    // OpenGraph metadata (T018)
    openGraph: {
      title,
      description,
      type: 'article',
      url: canonicalUrl,
      siteName: 'get2know.io',
      publishedTime: doc.frontmatter.date,
      ...(imageUrl && {
        images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      }),
    },
    // Twitter card metadata (T019)
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },
  };

  return metadata;
}

/**
 * Blog Post Page Component
 * Server component that loads and renders a single blog post
 */
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  
  // Load the blog post document
  const doc = getPostBySlug(slug);

  // Trigger 404 if post not found (T023)
  if (!doc) {
    notFound();
  }

  // Transform to view model
  const post = await transformToPageModel(doc);

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <BlogPostHeader
        title={post.title}
        formattedDate={post.formattedDate}
        rawDate={post.rawDate}
        description={post.description}
        heroImage={post.heroImage}
      />
      <BlogPostBody source={doc.content} playlists={doc.frontmatter.playlists} />
      <BlogPostNav />
    </article>
  );
}
