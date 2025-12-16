/**
 * MDX Component Whitelist Registry
 *
 * Add components here to make them available in MDX files.
 * Unrecognized components will render as text with a warning.
 *
 * @see /specs/003-add-mdx-support/data-model.md
 */

import type { ComponentType } from 'react';

/**
 * Whitelist of approved MDX components.
 * Key becomes the tag name available in MDX files.
 */
export const mdxComponents: Record<string, ComponentType<Record<string, unknown>>> = {
  // No custom components for initial demo phase
  // Example future additions:
  // Callout: CalloutComponent,
  // CodeBlock: CodeBlockComponent,
};
