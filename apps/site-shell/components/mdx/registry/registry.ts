/**
 * MDX Component Registry
 * Central registry for approved MDX components with validation
 * @see /specs/008-mdx-component-registry/data-model.md
 */

import type { ComponentType } from 'react';
import type { RegistryEntry, ComponentRegistry } from './types';
import { logComponentEvent } from './logger';

/**
 * Reserved names that cannot be used as component names
 * Prevents collisions with HTML tags and MDX shortcodes
 */
const RESERVED_NAMES = new Set([
  // HTML elements commonly overridden in MDX
  'a', 'img', 'iframe', 'blockquote', 'pre', 'code', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'br', 'div', 'span',
  // MDX special components
  'wrapper', 'MDXContent',
]);

// Import PlaylistEmbed for registration
import { PlaylistEmbed } from './PlaylistEmbed';
import { PlaylistEmbedPropsSchema, PlaylistEmbedRegistryConfig } from './PlaylistEmbed/types';

/**
 * Component Registry Map
 * Stores all registered MDX components with their metadata
 */
export const registry: ComponentRegistry = new Map();

/**
 * Get a component entry from the registry
 * @param name - Canonical component name (PascalCase)
 * @returns Registry entry or undefined if not found
 */
export function getComponent(name: string): RegistryEntry | undefined {
  const entry = registry.get(name);
  
  if (!entry) {
    // Log unknown component lookup for governance tracking
    logComponentEvent({
      timestamp: new Date().toISOString(),
      component: name,
      event: 'error',
      postSlug: 'unknown',
      severity: 'warning',
      details: { reason: 'component_not_found' },
    });
  }
  
  return entry;
}

/**
 * Get all registered component implementations for MDX rendering
 * Returns a plain object mapping component names to React components
 */
export function getRegisteredComponents(): Record<string, ComponentType<unknown>> {
  const components: Record<string, ComponentType<unknown>> = {};
  
  for (const [name, entry] of registry) {
    components[name] = entry.component;
  }
  
  return components;
}

/**
 * Export registered components as a flat object for MDX
 * This is merged with HTML element overrides in blog-post-components.tsx
 */
export const registeredComponents = getRegisteredComponents();

/**
 * Check if a component is registered
 * @param name - Component name to check
 * @returns True if component exists in registry
 */
export function hasComponent(name: string): boolean {
  return registry.has(name);
}

/**
 * Get all registered component names
 * Useful for documentation generation
 */
export function getRegisteredComponentNames(): string[] {
  return Array.from(registry.keys());
}

/**
 * Register a component in the registry
 * Used internally when setting up components
 * @param entry - Registry entry to add
 */
export function registerComponent<P>(entry: RegistryEntry<P>): void {
  // Check for reserved name collision
  if (RESERVED_NAMES.has(entry.name.toLowerCase())) {
    console.error(
      `Cannot register component "${entry.name}": name collides with reserved HTML/MDX element`
    );
    return;
  }
  
  if (registry.has(entry.name)) {
    console.warn(`Component "${entry.name}" is already registered. Overwriting.`);
  }
  registry.set(entry.name, entry as RegistryEntry);
  
  // Log registration for build-time tracking
  logComponentEvent({
    timestamp: new Date().toISOString(),
    component: entry.name,
    event: 'usage',
    postSlug: 'registry-init',
    severity: 'info',
    details: { 
      version: entry.version,
      deprecated: entry.deprecated,
    },
  });
}

// ============================================================================
// Register Built-in Components
// ============================================================================

// Register PlaylistEmbed component
registerComponent({
  name: PlaylistEmbedRegistryConfig.name,
  version: PlaylistEmbedRegistryConfig.version,
  description: PlaylistEmbedRegistryConfig.description,
  component: PlaylistEmbed,
  propsSchema: PlaylistEmbedPropsSchema,
  requiredProps: [...PlaylistEmbedRegistryConfig.requiredProps],
  optionalProps: [...PlaylistEmbedRegistryConfig.optionalProps],
  defaultProps: PlaylistEmbedRegistryConfig.defaultProps,
  dependencies: [...PlaylistEmbedRegistryConfig.dependencies],
  examples: [...PlaylistEmbedRegistryConfig.examples],
  deprecated: PlaylistEmbedRegistryConfig.deprecated,
});
