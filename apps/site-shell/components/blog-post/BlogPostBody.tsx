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
  slug: string; // T011: Required for relative image path resolution
}

export function BlogPostBody({ source, playlists = [], slug }: BlogPostBodyProps) {
  // Create a custom components map that injects the slug into the Image component
  const components = {
    ...blogPostMDXComponents,
    Image: (props: any) => {
      // Get the base Image component (OptimizedImage)
      const ImageComponent = blogPostMDXComponents.Image;
      // Pass the slug along with other props
      return <ImageComponent {...props} slug={slug} />;
    },
  };

  const mdxProps: MDXRemoteProps = {
    source,
    components,
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
