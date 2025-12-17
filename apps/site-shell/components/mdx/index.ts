/**
 * MDX Component Whitelist Registry
 *
 * Add components here to make them available in MDX files.
 * Unrecognized components will render as text with a warning.
 *
 * @see /specs/003-add-mdx-support/data-model.md
 * @see /specs/008-mdx-component-registry/data-model.md
 */

import type { ComponentType } from 'react';

// Re-export registry utilities for external use
export {
  registry,
  getComponent,
  getRegisteredComponents,
  registeredComponents,
  hasComponent,
  getRegisteredComponentNames,
  registerComponent,
} from './registry/registry';

export type { RegistryEntry, RegistryExample, ComponentRegistry } from './registry/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- MDX components receive arbitrary props
type MDXComponentProps = any;

/**
 * Whitelist of approved MDX components.
 * Key becomes the tag name available in MDX files.
 */
export const mdxComponents: Record<string, ComponentType<MDXComponentProps>> = {
  // No custom components for initial demo phase
  // Example future additions:
  // Callout: CalloutComponent,
  // CodeBlock: CodeBlockComponent,
};
