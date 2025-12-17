/**
 * Validation Utilities for MDX Component Registry
 * @see /specs/008-mdx-component-registry/data-model.md
 */

import type { z, ZodError } from 'zod';
import type { ValidationResult, ValidationError, ValidationWarning } from './types';

/**
 * Validate props against a Zod schema with detailed error reporting
 * @param schema - Zod schema to validate against
 * @param props - Props object to validate
 * @param _componentName - Name of component for logging (unused but kept for API consistency)
 * @returns ValidationResult with errors, warnings, and applied defaults
 */
export function validateProps<T>(
  schema: z.ZodType<T>,
  props: unknown,
  _componentName: string
): ValidationResult & { validatedProps: T | null } {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const appliedDefaults: string[] = [];

  try {
    // Parse with schema (applies defaults and transforms)
    const validatedProps = schema.parse(props);

    // Check which defaults were applied
    if (props && typeof props === 'object') {
      const inputProps = props as Record<string, unknown>;
      const outputProps = validatedProps as Record<string, unknown>;

      for (const key of Object.keys(outputProps)) {
        if (!(key in inputProps) && outputProps[key] !== undefined) {
          appliedDefaults.push(key);
        }
      }
    }

    return {
      valid: true,
      errors: [],
      warnings,
      appliedDefaults,
      validatedProps,
    };
  } catch (error) {
    if (isZodError(error)) {
      for (const issue of error.issues) {
        const propPath = issue.path.join('.');
        // Filter path to only string/number for getNestedValue
        const filteredPath = issue.path.filter(
          (p): p is string | number => typeof p === 'string' || typeof p === 'number'
        );
        errors.push({
          prop: propPath || 'root',
          message: issue.message,
          received: getNestedValue(props, filteredPath),
          expected: issue.code,
        });
      }
    } else {
      errors.push({
        prop: 'unknown',
        message: error instanceof Error ? error.message : 'Unknown validation error',
        expected: 'valid props',
      });
    }

    return {
      valid: false,
      errors,
      warnings,
      appliedDefaults,
      validatedProps: null,
    };
  }
}

/**
 * Type guard for ZodError
 */
function isZodError(error: unknown): error is ZodError {
  return (
    error !== null &&
    typeof error === 'object' &&
    'issues' in error &&
    Array.isArray((error as ZodError).issues)
  );
}

/**
 * Get nested value from object using path array
 */
function getNestedValue(obj: unknown, path: (string | number)[]): unknown {
  if (!obj || typeof obj !== 'object') return undefined;

  let current: unknown = obj;
  for (const key of path) {
    if (current === null || current === undefined) return undefined;
    if (typeof current !== 'object') return undefined;
    current = (current as Record<string | number, unknown>)[key];
  }
  return current;
}

/**
 * Check if a component name follows PascalCase convention
 * @param name - Component name to validate
 * @returns True if valid PascalCase
 */
export function isValidComponentName(name: string): boolean {
  return /^[A-Z][a-zA-Z0-9]*$/.test(name);
}

/**
 * Check if a version string is valid semver
 * @param version - Version string to validate
 * @returns True if valid semver format
 */
export function isValidSemver(version: string): boolean {
  return /^\d+\.\d+\.\d+$/.test(version);
}

/**
 * Create a validation warning for deprecated component usage
 */
export function createDeprecationWarning(
  componentName: string,
  message?: string
): ValidationWarning {
  return {
    prop: 'component',
    message: `Component "${componentName}" is deprecated${message ? `: ${message}` : ''}`,
    suggestion: message || 'Consider using an alternative component',
  };
}
