/**
 * Prop Validation Wrapper HOC
 * Wraps components with Zod schema validation and default application
 * @see /specs/008-mdx-component-registry/data-model.md
 */

import type { ComponentType } from 'react';
import type { z } from 'zod';
import { validateProps } from './validation';
import { logValidationEvent, logComponentError } from './logger';
import { FallbackPlaceholder } from './FallbackPlaceholder';

interface WithValidationOptions {
  /** Component name for logging */
  componentName: string;
  /** Post slug for logging context (optional, can be passed via props) */
  postSlug?: string;
  /** Default props to apply */
  defaultProps?: Record<string, unknown>;
}

/**
 * Higher-order component that wraps a component with Zod validation
 * @param WrappedComponent - Component to wrap
 * @param schema - Zod schema for prop validation
 * @param options - Validation options
 */
export function withValidation<P extends object>(
  WrappedComponent: ComponentType<P>,
  schema: z.ZodType<P>,
  options: WithValidationOptions
): ComponentType<Partial<P> & { __postSlug?: string }> {
  const { componentName, defaultProps = {} } = options;

  function ValidatedComponent(props: Partial<P> & { __postSlug?: string }) {
    const postSlug = props.__postSlug || options.postSlug || 'unknown';
    
    // Merge defaults with provided props
    const mergedProps = { ...defaultProps, ...props };
    
    // Remove internal props before validation
    const { __postSlug, ...propsToValidate } = mergedProps;
    
    // Validate props against schema
    const result = validateProps(schema, propsToValidate, componentName);
    
    // Log validation result
    logValidationEvent(componentName, postSlug, result.valid, {
      appliedDefaults: result.appliedDefaults,
      errorCount: result.errors.length,
      warningCount: result.warnings.length,
    });
    
    // If validation failed, show fallback
    if (!result.valid || !result.validatedProps) {
      logComponentError(
        componentName,
        postSlug,
        `Validation failed: ${result.errors.map(e => e.message).join(', ')}`
      );
      
      return (
        <FallbackPlaceholder
          componentName={componentName}
          reason="invalid-props"
        />
      );
    }
    
    // Log warnings in development
    if (result.warnings.length > 0 && process.env.NODE_ENV !== 'production') {
      for (const warning of result.warnings) {
        console.warn(
          `[${componentName}] Warning for prop "${warning.prop}": ${warning.message}`
        );
      }
    }
    
    // Log applied defaults in development
    if (result.appliedDefaults.length > 0 && process.env.NODE_ENV !== 'production') {
      console.debug(
        `[${componentName}] Applied defaults for: ${result.appliedDefaults.join(', ')}`
      );
    }
    
    // Render with validated props
    return <WrappedComponent {...result.validatedProps} />;
  }
  
  ValidatedComponent.displayName = `withValidation(${componentName})`;
  
  return ValidatedComponent;
}

/**
 * Create a validated component entry for the registry
 * Convenience function that combines component with validation
 */
export function createValidatedComponent<P extends object>(
  Component: ComponentType<P>,
  schema: z.ZodType<P>,
  componentName: string,
  defaultProps: Partial<P> = {}
): ComponentType<Partial<P>> {
  return withValidation(Component, schema, {
    componentName,
    defaultProps: defaultProps as Record<string, unknown>,
  });
}
