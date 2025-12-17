/**
 * Component Registry Type Definitions
 * @see /specs/008-mdx-component-registry/data-model.md
 */

import type { ComponentType } from 'react';
import type { z } from 'zod';

// ============================================================================
// Registry Entry Types
// ============================================================================

/**
 * Usage example for documentation generation
 */
export interface RegistryExample {
  /** Example title */
  title: string;
  /** MDX code snippet */
  code: string;
  /** Optional description */
  description?: string;
}

/**
 * Component Registry Entry
 * Describes an approved interactive element available for use in MDX content.
 * @see FR-001: Registry stores canonical name, description, allowed props
 */
export interface RegistryEntry<P = unknown> {
  /** Canonical name used in MDX files (PascalCase) */
  name: string;
  /** Semantic version for change tracking */
  version: string;
  /** Human-readable description for author documentation */
  description: string;
  /** React component implementation */
  component: ComponentType<P>;
  /** Zod schema for prop validation */
  propsSchema: z.ZodType<P>;
  /** List of required prop names */
  requiredProps: string[];
  /** List of optional prop names with defaults */
  optionalProps: string[];
  /** Default values applied when props missing */
  defaultProps: Partial<P>;
  /** External dependencies (e.g., "YOUTUBE_API_KEY") */
  dependencies: string[];
  /** Usage examples for documentation */
  examples: RegistryExample[];
  /** Deprecation flag */
  deprecated: boolean;
  /** Message when deprecated */
  deprecationMessage?: string;
}

// ============================================================================
// Validation Types
// ============================================================================

/**
 * Validation error with structured details
 */
export interface ValidationError {
  /** Prop name that failed validation */
  prop: string;
  /** Error message */
  message: string;
  /** Received value (for logging) */
  received?: unknown;
  /** Expected type/format */
  expected: string;
}

/**
 * Validation warning for non-blocking issues
 */
export interface ValidationWarning {
  /** Prop name with issue */
  prop: string;
  /** Warning message */
  message: string;
  /** Suggestion for fixing */
  suggestion?: string;
}

/**
 * Validation result from prop checking
 * @see FR-006: Actionable validation output
 */
export interface ValidationResult {
  /** Whether validation passed (errors.length === 0) */
  valid: boolean;
  /** Blocking errors that prevent rendering */
  errors: ValidationError[];
  /** Non-blocking warnings */
  warnings: ValidationWarning[];
  /** Props where defaults were applied */
  appliedDefaults: string[];
}

// ============================================================================
// Credential Policy Types
// ============================================================================

/**
 * Credential Policy for optional API integrations
 * @see FR-007: Optional credentials never stop builds
 */
export interface CredentialPolicy {
  /** Environment variable name (e.g., "YOUTUBE_API_KEY") */
  envVar: string;
  /** Whether credential is required for basic functionality */
  required: boolean;
  /** Behavior when credential missing */
  fallbackBehavior: 'fallback' | 'disable';
  /** Regex pattern to validate credential format */
  validationPattern?: RegExp;
  /** Tag for structured logging */
  monitoringTag: string;
}

// ============================================================================
// Analytics Types
// ============================================================================

/**
 * Structured log entry for component analytics
 * @see FR-009: Usage analytics for governance
 */
export interface ComponentUsageLog {
  /** ISO 8601 timestamp */
  timestamp: string;
  /** Component canonical name */
  component: string;
  /** Event type */
  event: 'usage' | 'validation' | 'error' | 'fallback';
  /** Blog post slug */
  postSlug: string;
  /** Severity level */
  severity: 'info' | 'warning' | 'error';
  /** Event-specific details */
  details: Record<string, unknown>;
}

// ============================================================================
// Registry Map Type
// ============================================================================

/**
 * Component registry map type
 */
export type ComponentRegistry = Map<string, RegistryEntry>;
