# Contracts: Blog Post Page Route

**Feature**: 006-blog-post-route  
**Date**: 2025-12-17

## Overview

This directory contains type definitions and schemas for the blog post page route feature.

## Files

### blog-post-types.ts

TypeScript interface definitions for:
- `BlogPostDocument` - Source document from content directory
- `BlogPostFrontmatter` - Parsed frontmatter metadata
- `BlogPostPageModel` - View model for page rendering
- `BlogPostMetadata` - SEO metadata for Next.js generateMetadata()
- Function signatures for loader utilities

### blog-post-document.schema.json

JSON Schema for validating blog post documents. Can be used for:
- Build-time content validation
- IDE autocompletion in content files
- API response validation if content is served via API

## Usage

```typescript
import type {
  BlogPostDocument,
  BlogPostPageModel,
  BlogPostParams
} from '@/specs/006-blog-post-route/contracts/blog-post-types';

// Or copy types to src/lib/mdx/types.ts for production use
```

## Relationship to Other Specs

- **004-preserve-slugs**: `BlogPostDocument.slug` uses normalization from slug library
- **005-build-blog-index**: `BlogPostPageModel` shares fields with `BlogIndexEntry`
