import { getAllPostsForIndex } from '@/lib/mdx/loader';
import { BlogPostCard, EmptyState } from '@/components/blog';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata(
  {
    title: 'Blog',
    description: 'Latest blog posts and articles from get2know.io.',
  },
  '/blog'
);

export default function BlogPage() {
  const posts = getAllPostsForIndex();

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-bold text-shell-foreground">Blog</h1>
      <section aria-label="Blog posts" className="space-y-4">
        {posts.length === 0 ? (
          <EmptyState />
        ) : (
          posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))
        )}
      </section>
    </main>
  );
}
