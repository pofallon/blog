/**
 * Blog post card component for index listing
 * @see /specs/005-build-blog-index/research.md
 */

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { BlogIndexEntry } from '@/lib/mdx/types';

interface BlogPostCardProps {
  post: BlogIndexEntry;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Link href={post.url} className="block group">
      <Card className="h-full group-hover:border-g2k-brass/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg group-hover:text-primary transition-colors duration-150">
            {post.title}
          </CardTitle>
          <CardDescription>
            <time dateTime={post.rawDate}>{post.formattedDate}</time>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {post.summary}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
