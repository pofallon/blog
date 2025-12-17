/**
 * Structured Logging Utility for MDX Component Registry
 * @see /specs/008-mdx-component-registry/data-model.md
 */

import type { ComponentUsageLog } from './types';

/**
 * Log a component event with structured format
 * @param entry - Component usage log entry
 */
export function logComponentEvent(entry: ComponentUsageLog): void {
  const logEntry = {
    ...entry,
    tag: 'component:registry',
  };

  // Use appropriate console method based on severity
  switch (entry.severity) {
    case 'error':
      console.error(JSON.stringify(logEntry));
      break;
    case 'warning':
      console.warn(JSON.stringify(logEntry));
      break;
    case 'info':
    default:
      // Only log info in development to reduce noise
      if (process.env.NODE_ENV !== 'production') {
        console.log(JSON.stringify(logEntry));
      }
      break;
  }
}

/**
 * Create a structured log entry for component usage
 * @param component - Component name
 * @param postSlug - Blog post slug
 * @param details - Additional details
 */
export function logComponentUsage(
  component: string,
  postSlug: string,
  details: Record<string, unknown> = {}
): void {
  logComponentEvent({
    timestamp: new Date().toISOString(),
    component,
    event: 'usage',
    postSlug,
    severity: 'info',
    details,
  });
}

/**
 * Create a structured log entry for validation events
 * @param component - Component name
 * @param postSlug - Blog post slug
 * @param valid - Whether validation passed
 * @param details - Validation details
 */
export function logValidationEvent(
  component: string,
  postSlug: string,
  valid: boolean,
  details: Record<string, unknown> = {}
): void {
  logComponentEvent({
    timestamp: new Date().toISOString(),
    component,
    event: 'validation',
    postSlug,
    severity: valid ? 'info' : 'warning',
    details: { valid, ...details },
  });
}

/**
 * Create a structured log entry for fallback events
 * @param component - Component name
 * @param postSlug - Blog post slug
 * @param reason - Reason for fallback
 */
export function logFallbackEvent(
  component: string,
  postSlug: string,
  reason: string
): void {
  logComponentEvent({
    timestamp: new Date().toISOString(),
    component,
    event: 'fallback',
    postSlug,
    severity: 'warning',
    details: { reason },
  });
}

/**
 * Create a structured log entry for component errors
 * @param component - Component name
 * @param postSlug - Blog post slug
 * @param error - Error details
 */
export function logComponentError(
  component: string,
  postSlug: string,
  error: Error | string
): void {
  logComponentEvent({
    timestamp: new Date().toISOString(),
    component,
    event: 'error',
    postSlug,
    severity: 'error',
    details: {
      message: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    },
  });
}
