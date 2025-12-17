# Contracts: Minimal Blog Index

This directory contains type definitions and schema contracts for the blog index feature.

## Files

| File | Description |
|------|-------------|
| `blog-index-types.ts` | TypeScript type definitions for blog index |
| `blog-index-schema.json` | JSON Schema for BlogIndexEntry validation |

## Usage

These contracts define the interface between the MDX content loader and the blog index UI.

### TypeScript Types

Import from the contracts file for type safety:

```typescript
import type { BlogIndexEntry, BlogIndexOptions } from './contracts/blog-index-types';
```

### JSON Schema

Use for runtime validation or API documentation purposes.
