/**
 * Blog Post MDX Component Mappings
 * Custom components for rendering MDX content in blog posts
 * @see /specs/006-blog-post-route/research.md RQ-8
 * @see /specs/007-add-image-handling/tasks.md T016
 * @see /specs/008-mdx-component-registry/data-model.md
 */

import React, { type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { OptimizedImage } from '@/components/blog/OptimizedImage';
import { getRegisteredComponents } from '@/components/mdx/index';

/**
 * Custom image component with lazy loading
 */
function BlogImage(props: ComponentPropsWithoutRef<'img'>) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} loading="lazy" className="rounded-lg my-4" alt={props.alt || ''} />
  );
}

/**
 * Custom iframe component with lazy loading for embeds
 */
function BlogIframe(props: ComponentPropsWithoutRef<'iframe'>) {
  return (
    <iframe
      {...props}
      loading="lazy"
      className="w-full aspect-video rounded-lg my-4"
    />
  );
}

/**
 * Custom blockquote for styled quotes
 */
function BlogBlockquote(props: ComponentPropsWithoutRef<'blockquote'>) {
  return (
    <blockquote
      {...props}
      className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-600 dark:text-gray-400"
    />
  );
}

/**
 * Custom anchor with external link handling
 */
function BlogAnchor(props: ComponentPropsWithoutRef<'a'>) {
  const isExternal =
    props.href?.startsWith('http') || props.href?.startsWith('//');

  return (
    <a
      {...props}
      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
      {...(isExternal
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {})}
    />
  );
}

/**
 * Custom code block wrapper
 */
function BlogPre(props: ComponentPropsWithoutRef<'pre'>) {
  return (
    <pre
      {...props}
      className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto my-4"
    />
  );
}

/**
 * Custom inline code
 */
function BlogCode(props: ComponentPropsWithoutRef<'code'>) {
  // Check if it's inline code (not inside a pre block)
  const isInline = !props.className?.includes('language-');
  
  if (isInline) {
    return (
      <code
        {...props}
        className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm"
      />
    );
  }
  
  return <code {...props} />;
}

/**
 * Placeholder component for unknown/legacy Gatsby components
 * Renders children or a notice about missing component
 */
function PlaceholderComponent({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

/**
 * MDX component mappings for blog post rendering
 * Override default HTML elements with custom styled components
 * Include placeholders for legacy Gatsby components
 * Merge with registered components from the registry
 */
export const blogPostMDXComponents = {
  // HTML element overrides
  img: BlogImage,
  iframe: BlogIframe,
  blockquote: BlogBlockquote,
  a: BlogAnchor,
  pre: BlogPre,
  code: BlogCode,
  // Custom Image component for MDX (T016)
  Image: OptimizedImage,
  // Legacy Gatsby component placeholders
  ReinventProcessor: PlaceholderComponent,
  // Merge registered components from the registry (includes PlaylistEmbed)
  ...getRegisteredComponents(),
  // Alias legacy Playlist to PlaylistEmbed from registry (with fallback to placeholder)
  Playlist: getRegisteredComponents().PlaylistEmbed ?? PlaceholderComponent,
};
