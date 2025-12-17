/**
 * Blog post card component for index listing
 * @see /specs/005-build-blog-index/research.md
 */

import Link from 'next/link';
import type { BlogIndexEntry } from '@/lib/mdx/types';

interface BlogPostCardProps {
  post: BlogIndexEntry;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Link
      href={post.url}
      className="block rounded-2xl border border-shell-border bg-white p-5 transition-colors hover:border-shell-accent focus:outline-none focus:ring-2 focus:ring-shell-accent focus:ring-offset-2"
    >
      <article>
        <h2 className="text-lg font-semibold text-shell-foreground mb-2">
          {post.title}
        </h2>
        <time dateTime={post.rawDate} className="text-sm text-shell-muted">
          {post.formattedDate}
        </time>
        <p className="mt-2 text-sm text-shell-muted line-clamp-3">
          {post.summary}
        </p>
      </article>
    </Link>
  );
}
