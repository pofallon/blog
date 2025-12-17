# Data Model: Custom MDX Component Registry

**Feature**: 008-mdx-component-registry  
**Date**: 2025-12-17  
**Spec**: [spec.md](./spec.md) | **Research**: [research.md](./research.md)

## Entity Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MDX Component Registry System                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────┐     references     ┌─────────────────────┐        │
│  │  RegistryEntry      │◄────────────────────│  MDX Content        │        │
│  │  (per component)    │                     │  (blog posts)       │        │
│  └─────────┬───────────┘                     └─────────────────────┘        │
│            │                                                                 │
│            │ defines                                                         │
│            ▼                                                                 │
│  ┌─────────────────────┐                     ┌─────────────────────┐        │
│  │  PropSchema         │     validates       │  Component Props    │        │
│  │  (Zod schema)       │────────────────────►│  (at render time)   │        │
│  └─────────────────────┘                     └─────────────────────┘        │
│                                                                             │
│  ┌─────────────────────┐                     ┌─────────────────────┐        │
│  │  CredentialPolicy   │     governs         │  Runtime Behavior   │        │
│  │  (env config)       │────────────────────►│  (enhanced/basic)   │        │
│  └─────────────────────┘                     └─────────────────────┘        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Entity: RegistryEntry

Describes an approved interactive element available for use in MDX content.

### Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `name` | `string` | Yes | — | Canonical name used in MDX (e.g., "PlaylistEmbed") |
| `version` | `string` | Yes | — | Semantic version for tracking changes |
| `description` | `string` | Yes | — | Human-readable description for docs |
| `component` | `ComponentType` | Yes | — | React component reference |
| `propsSchema` | `ZodSchema` | Yes | — | Zod schema for prop validation |
| `requiredProps` | `string[]` | No | `[]` | List of required prop names |
| `optionalProps` | `string[]` | No | `[]` | List of optional prop names |
| `defaultProps` | `Record<string, unknown>` | No | `{}` | Default values for optional props |
| `dependencies` | `string[]` | No | `[]` | External dependencies (APIs, credentials) |
| `examples` | `Example[]` | No | `[]` | Usage examples for documentation |
| `deprecated` | `boolean` | No | `false` | Whether component is deprecated |
| `deprecationMessage` | `string` | No | — | Message shown when deprecated |

### Validation Rules

- `name` must be PascalCase and unique in registry
- `version` must be valid semver
- `propsSchema` must be a valid Zod schema
- `requiredProps` elements must exist in `propsSchema`

### TypeScript Interface

```typescript
import type { ComponentType } from 'react';
import type { ZodSchema } from 'zod';

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
 * @see FR-001: Registry stores canonical name, description, allowed props
 */
export interface RegistryEntry<P = unknown> {
  /** Canonical name used in MDX files */
  name: string;
  /** Semantic version for change tracking */
  version: string;
  /** Human-readable description for author documentation */
  description: string;
  /** React component implementation */
  component: ComponentType<P>;
  /** Zod schema for prop validation */
  propsSchema: ZodSchema<P>;
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
```

---

## Entity: PlaylistEmbedProps

Props for the PlaylistEmbed component implementing FR-004.

### Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `playlistId` | `string` | Yes | — | YouTube playlist ID |
| `title` | `string` | No | "YouTube Playlist" | Accessible title for iframe |
| `height` | `number` | No | `400` | Embed height in pixels |
| `showTitle` | `boolean` | No | `true` | Whether to show playlist title |
| `autoplay` | `boolean` | No | `false` | Whether to autoplay first video |

### Validation Rules

- `playlistId` must match YouTube playlist ID format (`PL` prefix + alphanumeric)
- `height` must be positive integer between 200 and 800
- Invalid `playlistId` triggers graceful fallback

### TypeScript Interface

```typescript
import { z } from 'zod';

/**
 * PlaylistEmbed Props Schema
 * @see FR-004: PlaylistEmbed component with playlist-style embed parity
 */
export const PlaylistEmbedPropsSchema = z.object({
  /** YouTube playlist ID (required) */
  playlistId: z.string()
    .regex(/^PL[a-zA-Z0-9_-]+$/, 'Invalid YouTube playlist ID format'),
  /** Accessible title for iframe */
  title: z.string().default('YouTube Playlist'),
  /** Embed height in pixels */
  height: z.number().int().min(200).max(800).default(400),
  /** Whether to display playlist title */
  showTitle: z.boolean().default(true),
  /** Whether to autoplay first video */
  autoplay: z.boolean().default(false),
});

export type PlaylistEmbedProps = z.infer<typeof PlaylistEmbedPropsSchema>;
```

---

## Entity: CredentialPolicy

Configuration for optional API credentials (FR-005, FR-007).

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `envVar` | `string` | Yes | Environment variable name |
| `required` | `boolean` | No | Whether credential is mandatory (default: false) |
| `fallbackBehavior` | `string` | Yes | What happens when missing |
| `validationPattern` | `RegExp` | No | Pattern to validate credential format |
| `monitoringTag` | `string` | Yes | Tag for log filtering |

### TypeScript Interface

```typescript
/**
 * Credential Policy for optional API integrations
 * @see FR-007: Optional credentials never stop builds
 */
export interface CredentialPolicy {
  /** Environment variable name (e.g., "YOUTUBE_API_KEY") */
  envVar: string;
  /** Whether credential is required for basic functionality */
  required: boolean;
  /** Behavior when credential missing: "fallback" | "disable" */
  fallbackBehavior: 'fallback' | 'disable';
  /** Regex pattern to validate credential format */
  validationPattern?: RegExp;
  /** Tag for structured logging */
  monitoringTag: string;
}

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
```

---

## Entity: ValidationResult

Result of prop validation at render time (FR-006).

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `valid` | `boolean` | Whether validation passed |
| `errors` | `ValidationError[]` | List of validation errors |
| `warnings` | `ValidationWarning[]` | List of validation warnings |
| `appliedDefaults` | `string[]` | Props where defaults were applied |

### TypeScript Interface

```typescript
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
```

---

## Entity: ComponentUsageLog

Structured log entry for analytics (FR-009).

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | `string` | ISO 8601 timestamp |
| `component` | `string` | Component canonical name |
| `event` | `string` | Event type: "usage", "validation", "error" |
| `postSlug` | `string` | Blog post slug where component used |
| `severity` | `string` | Log level: "info", "warning", "error" |
| `details` | `object` | Additional event-specific data |

### TypeScript Interface

```typescript
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

/**
 * Log a component event with structured format
 */
export function logComponentEvent(entry: ComponentUsageLog): void {
  console.log(JSON.stringify({
    ...entry,
    tag: 'component:registry',
  }));
}
```

---

## State Transitions

### Component Rendering States

```
┌─────────────────┐
│   MDX Parse     │
└────────┬────────┘
         │ component referenced
         ▼
┌─────────────────┐     not found     ┌─────────────────┐
│ Registry Lookup │──────────────────►│ Fallback        │
└────────┬────────┘                   │ Placeholder     │
         │ found                      └─────────────────┘
         ▼
┌─────────────────┐     invalid       ┌─────────────────┐
│ Props Validate  │──────────────────►│ Default Props   │
└────────┬────────┘                   │ + Warning       │
         │ valid                      └────────┬────────┘
         ▼                                     │
┌─────────────────┐                            │
│ Credential      │◄───────────────────────────┘
│ Check           │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐  ┌────────┐
│Enhanced│  │Basic   │
│Render  │  │Render  │
└────────┘  └────────┘
```

---

## Relationships

| From | To | Cardinality | Description |
|------|----|-------------|-------------|
| RegistryEntry | React Component | 1:1 | Each entry wraps exactly one component |
| RegistryEntry | PropSchema | 1:1 | Each entry has exactly one validation schema |
| RegistryEntry | CredentialPolicy | 1:N | Entry may depend on multiple credentials |
| MDX Content | RegistryEntry | N:N | Posts can use multiple components; components used by multiple posts |
| ValidationResult | RegistryEntry | N:1 | Each render produces one result per component |
