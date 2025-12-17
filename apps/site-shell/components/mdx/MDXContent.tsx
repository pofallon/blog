/**
 * MDX Content Renderer Component
 * Uses next-mdx-remote/rsc for server-side MDX compilation
 */

import { MDXRemote, type MDXRemoteProps } from 'next-mdx-remote/rsc';
import { mdxComponents } from './index';

type MDXContentProps = {
  content: string;
};

/**
 * Custom component wrapper that handles unrecognized components.
 * Logs warnings at render time for unknown component tags.
 * Created once at module level for performance.
 */
const componentProxy = new Proxy(mdxComponents, {
  get(target, prop) {
    if (typeof prop === 'string' && prop in target) {
      return target[prop];
    }
    // Log warning for unrecognized components (capitalized names = React components)
    if (typeof prop === 'string') {
      const firstChar = prop.charAt(0);
      if (firstChar && firstChar === firstChar.toUpperCase()) {
        console.warn(
          `⚠️  Unrecognized MDX component: <${prop}>. Add it to the component whitelist to enable.`
        );
      }
    }
    // Return undefined to let MDX handle it as text
    return undefined;
  },
});

/**
 * Render MDX content with whitelisted components
 */
export async function MDXContent({ content }: MDXContentProps) {
  const mdxProps: MDXRemoteProps = {
    source: content,
    components: componentProxy,
  };

  return (
    <div className="prose prose-lg max-w-none">
      <MDXRemote {...mdxProps} />
    </div>
  );
}
