/**
 * Blog Post Body Component
 * Renders MDX content with component mappings using next-mdx-remote/rsc
 * @see /specs/006-blog-post-route/tasks.md T011
 */

import { MDXRemote, type MDXRemoteProps } from 'next-mdx-remote/rsc';
import { blogPostMDXComponents } from '@/lib/mdx/blog-post-components';
import type { PlaylistRef } from '@/lib/mdx/blog-post-types';

export interface BlogPostBodyProps {
  source: string;
  playlists?: PlaylistRef[] | undefined;
}

export function BlogPostBody({ source, playlists = [] }: BlogPostBodyProps) {
  const mdxProps: MDXRemoteProps = {
    source,
    components: blogPostMDXComponents,
    options: {
      scope: {
        props: {
          playlists,
        },
      },
    },
  };

  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <MDXRemote {...mdxProps} />
    </div>
  );
}
