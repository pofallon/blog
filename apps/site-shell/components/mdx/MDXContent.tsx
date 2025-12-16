/**
 * MDX Content Renderer Component
 * Uses next-mdx-remote/rsc for server-side MDX compilation
 */

import { MDXRemote } from 'next-mdx-remote/rsc';
import { mdxComponents } from './index';

type MDXContentProps = {
  content: string;
};

/**
 * Custom component wrapper that handles unrecognized components
 */
function createComponentProxy() {
  return new Proxy(mdxComponents, {
    get(target, prop: string) {
      if (prop in target) {
        return target[prop];
      }
      // Log warning for unrecognized components (capitalized names = React components)
      const firstChar = prop.charAt(0);
      if (typeof prop === 'string' && firstChar && firstChar === firstChar.toUpperCase()) {
        console.warn(
          `⚠️  Unrecognized MDX component: <${prop}>. Add it to the component whitelist to enable.`
        );
      }
      // Return undefined to let MDX handle it as text
      return undefined;
    },
  });
}

/**
 * Render MDX content with whitelisted components
 */
export function MDXContent({ content }: MDXContentProps) {
  const components = createComponentProxy();

  return (
    <div className="prose prose-lg max-w-none">
      <MDXRemote source={content} components={components} />
    </div>
  );
}
