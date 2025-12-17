/**
 * MDX Content Renderer Component
 * Uses next-mdx-remote/rsc for server-side MDX compilation
 * @see /specs/008-mdx-component-registry/data-model.md
 */

import { MDXRemote, type MDXRemoteProps } from 'next-mdx-remote/rsc';
import { mdxComponents, hasComponent, getComponent } from './index';
import { logComponentEvent, logFallbackEvent } from './registry/logger';
import { FallbackPlaceholder } from './registry/FallbackPlaceholder';

type MDXContentProps = {
  content: string;
  /** Optional post slug for analytics tracking */
  postSlug?: string;
};

/**
 * Create a component proxy that validates against registry and emits structured warnings
 * @param postSlug - Blog post slug for logging context
 */
function createComponentProxy(postSlug: string = 'unknown') {
  return new Proxy(mdxComponents, {
    get(target, prop) {
      if (typeof prop === 'string' && prop in target) {
        return target[prop];
      }
      
      // Check registry for component
      if (typeof prop === 'string') {
        const firstChar = prop.charAt(0);
        const isComponentName = firstChar && firstChar === firstChar.toUpperCase();
        
        if (isComponentName) {
          // Check if registered in the component registry
          if (hasComponent(prop)) {
            const entry = getComponent(prop);
            if (entry) {
              // Check for deprecation
              if (entry.deprecated) {
                logComponentEvent({
                  timestamp: new Date().toISOString(),
                  component: prop,
                  event: 'usage',
                  postSlug,
                  severity: 'warning',
                  details: { 
                    deprecated: true,
                    message: entry.deprecationMessage 
                  },
                });
                // Return wrapper that shows deprecation notice in dev
                return function DeprecatedWrapper(props: Record<string, unknown>) {
                  return (
                    <FallbackPlaceholder
                      componentName={prop}
                      reason="deprecated"
                      deprecationMessage={entry.deprecationMessage}
                    >
                      <entry.component {...props} />
                    </FallbackPlaceholder>
                  );
                };
              }
              return entry.component;
            }
          }
          
          // Log warning for unrecognized components with structured format
          logFallbackEvent(prop, postSlug, 'component_not_registered');
          console.warn(
            `⚠️  Unrecognized MDX component: <${prop}>. Add it to the component registry to enable.`
          );
        }
      }
      // Return undefined to let MDX handle it as text
      return undefined;
    },
  });
}

/**
 * Render MDX content with whitelisted components
 */
export function MDXContent({ content, postSlug = 'unknown' }: MDXContentProps) {
  const componentProxy = createComponentProxy(postSlug);
  
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
