/**
 * Blog post card component for index listing
 * @see /specs/005-build-blog-index/research.md
 */

import Link from 'next/link';
import Image from 'next/image';
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
      <Card className="h-full group-hover:border-g2k-brass/40 overflow-hidden">
        {post.heroImage && (
          <div className="relative aspect-video w-full overflow-hidden border-b border-shell-border">
            <Image
              src={post.heroImage.src}
              alt={post.heroImage.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              placeholder={post.heroImage.blurDataURL ? 'blur' : 'empty'}
              blurDataURL={post.heroImage.blurDataURL}
            />
          </div>
        )}
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
