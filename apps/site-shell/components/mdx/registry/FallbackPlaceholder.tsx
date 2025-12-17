/**
 * Fallback Placeholder Component
 * Displays when an unknown or invalid component is referenced in MDX
 * @see /specs/008-mdx-component-registry/data-model.md
 */

import type { ReactNode } from 'react';

export interface FallbackPlaceholderProps {
  /** Name of the component that couldn't be rendered */
  componentName?: string;
  /** Reason for fallback */
  reason?: 'unknown' | 'invalid-props' | 'deprecated' | 'error';
  /** Deprecation message if component is deprecated */
  deprecationMessage?: string | undefined;
  /** Children to render (passthrough for graceful degradation) */
  children?: ReactNode;
}

/**
 * Get Tailwind classes based on fallback reason
 */
function getReasonStyles(reason: FallbackPlaceholderProps['reason']) {
  const baseClasses = 'p-4 my-2 rounded-lg text-sm font-mono';
  
  switch (reason) {
    case 'deprecated':
      return `${baseClasses} bg-amber-100 border border-amber-500 text-amber-800 dark:bg-amber-900/20 dark:border-amber-600 dark:text-amber-200`;
    case 'error':
    case 'invalid-props':
      return `${baseClasses} bg-red-100 border border-red-500 text-red-800 dark:bg-red-900/20 dark:border-red-600 dark:text-red-200`;
    case 'unknown':
    default:
      return `${baseClasses} bg-gray-100 border border-dashed border-gray-400 text-gray-600 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300`;
  }
}

/**
 * Fallback component for unknown/invalid MDX components
 * Renders in development with helpful messaging; silent in production
 */
export function FallbackPlaceholder({
  componentName,
  reason = 'unknown',
  deprecationMessage,
  children,
}: FallbackPlaceholderProps) {
  // In production, just render children or nothing
  if (process.env.NODE_ENV === 'production') {
    return <>{children}</>;
  }

  // In development, show helpful debug info
  const getMessage = () => {
    switch (reason) {
      case 'deprecated':
        return deprecationMessage ? `Component "${componentName ?? 'unknown'}" is deprecated: ${deprecationMessage}` : `Component "${componentName ?? 'unknown'}" is deprecated`;
      case 'invalid-props':
        return `Component "${componentName ?? 'unknown'}" received invalid props`;
      case 'error':
        return `Component "${componentName ?? 'unknown'}" encountered an error`;
      case 'unknown':
      default:
        return `Unknown component "${componentName ?? 'unknown'}"`;
    }
  };

  return (
    <div className={getReasonStyles(reason)} role="alert">
      <strong>⚠️ {getMessage()}</strong>
      {children && (
        <div className="mt-2 opacity-70">
          Content: {children}
        </div>
      )}
    </div>
  );
}
