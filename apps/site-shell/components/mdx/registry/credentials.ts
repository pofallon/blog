/**
 * Credential Policy Configuration
 * Manages optional API credentials with graceful degradation
 * @see /specs/008-mdx-component-registry/data-model.md
 */

import type { CredentialPolicy } from './types';
import { logComponentEvent } from './logger';

/**
 * Credential policies for registry components
 */
export const credentialPolicies: Record<string, CredentialPolicy> = {
  YOUTUBE_API_KEY: {
    envVar: 'YOUTUBE_API_KEY',
    required: false,
    fallbackBehavior: 'fallback',
    validationPattern: /^AIza[a-zA-Z0-9_-]{35}$/,
    monitoringTag: 'credential:youtube',
  },
};

/**
 * Check if a credential is available and valid
 * @param credentialName - Name of credential policy to check
 * @returns True if credential is present and valid format
 */
export function hasCredential(credentialName: string): boolean {
  const policy = credentialPolicies[credentialName];
  if (!policy) {
    return false;
  }

  const value = process.env[policy.envVar];
  if (!value) {
    return false;
  }

  // If there's a validation pattern, check it
  if (policy.validationPattern && !policy.validationPattern.test(value)) {
    return false;
  }

  return true;
}

/**
 * Get credential value if available
 * @param credentialName - Name of credential policy
 * @returns Credential value or undefined
 */
export function getCredential(credentialName: string): string | undefined {
  const policy = credentialPolicies[credentialName];
  if (!policy) {
    return undefined;
  }

  const value = process.env[policy.envVar];
  if (!value) {
    return undefined;
  }

  // Validate format if pattern exists
  if (policy.validationPattern && !policy.validationPattern.test(value)) {
    logComponentEvent({
      timestamp: new Date().toISOString(),
      component: 'credentials',
      event: 'validation',
      postSlug: 'system',
      severity: 'warning',
      details: {
        credential: credentialName,
        reason: 'invalid_format',
        tag: policy.monitoringTag,
      },
    });
    return undefined;
  }

  return value;
}

/**
 * Log credential status at startup (called during module init)
 * Logs presence/absence without revealing values
 */
export function logCredentialStatus(): void {
  for (const [name, policy] of Object.entries(credentialPolicies)) {
    const isPresent = hasCredential(name);
    const severity = isPresent ? 'info' : (policy.required ? 'error' : 'warning');
    
    logComponentEvent({
      timestamp: new Date().toISOString(),
      component: 'credentials',
      event: isPresent ? 'usage' : 'fallback',
      postSlug: 'system-init',
      severity,
      details: {
        credential: name,
        present: isPresent,
        required: policy.required,
        fallbackBehavior: policy.fallbackBehavior,
        tag: policy.monitoringTag,
      },
    });
  }
}

/**
 * Get fallback behavior for a credential
 * @param credentialName - Name of credential policy
 * @returns Fallback behavior or 'disable' if unknown
 */
export function getCredentialFallbackBehavior(
  credentialName: string
): 'fallback' | 'disable' {
  const policy = credentialPolicies[credentialName];
  return policy?.fallbackBehavior ?? 'disable';
}

// Log credential status at module initialization
logCredentialStatus();
