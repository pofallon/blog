# SEO Metadata Framework Quickstart

**Feature**: 009-seo-metadata  
**Version**: 1.0.0

## Overview

This document provides a quick reference for working with the SEO metadata framework in the Get2Know blog. The framework centralizes SEO configuration and generates OpenGraph/Twitter metadata for all pages.

## For Content Authors

### Blog Post Frontmatter

Every blog post should include these fields for optimal SEO:

```yaml
---
title: "Your Post Title"              # Required - Used for og:title, twitter:title
date: "2025-12-17"                    # Required - ISO 8601 format
description: "A brief summary..."     # Recommended - ~160 chars for og:description
hero:
  src: "hero.png"                     # Recommended - Share image for social
  alt: "Description of the image"     # Required if hero present
  caption: "Optional caption"         # Optional
---
```

### Field Guidelines

| Field | Requirement | Notes |
|-------|-------------|-------|
| `title` | **Required** | Keep under 60 characters |
| `date` | **Required** | Format: YYYY-MM-DD |
| `description` | Recommended | 150-160 characters optimal |
| `hero.src` | Recommended | Place image in post directory |
| `hero.alt` | Required with hero | Describe the image |

### What Happens If Fields Are Missing?

- **Missing `description`**: Auto-generated from first 160 chars of content
- **Missing `hero`**: Uses site default share image
- **Missing `title` or `date`**: Build warning (post may not render correctly)

## For Developers

### Quick Setup

The SEO module is located at `apps/site-shell/lib/seo/`.

```typescript
import { 
  buildPageMetadata,
  buildBlogPostMetadata,
  buildCanonicalUrl,
  getGlobalSEOConfig 
} from '@/lib/seo';
```

### Adding Metadata to a New Page

**Option 1: Static Metadata Export**

```typescript
// app/about/page.tsx
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata(
  { title: 'About Us', description: 'Learn about our team' },
  '/about'
);

export default function AboutPage() {
  return <div>...</div>;
}
```

**Option 2: Dynamic Metadata (with params)**

```typescript
// app/[category]/page.tsx
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }): Promise<Metadata> {
  const { category } = await params;
  return buildPageMetadata(
    { title: `${category} Posts` },
    `/${category}`
  );
}
```

### Blog Post Metadata

Blog posts use `buildBlogPostMetadata()` which handles:
- OpenGraph article type
- Twitter summary_large_image card
- Canonical URL generation
- Hero image resolution

```typescript
// Already implemented in app/blog/[slug]/page.tsx
import { buildBlogPostMetadata } from '@/lib/seo';

export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = await params;
  const doc = getPostBySlug(slug);
  return buildBlogPostMetadata(doc.frontmatter, slug);
}
```

### URL Utilities

```typescript
import { buildCanonicalUrl, resolveShareImageUrl } from '@/lib/seo';

// Build canonical URL
const url = buildCanonicalUrl('/blog/my-post');
// → 'https://get2know.io/blog/my-post'

// Resolve share image
const imageUrl = resolveShareImageUrl('hero.png', 'my-post');
// → 'https://get2know.io/blog-images/my-post/hero.png'
```

## Environment Configuration

### Required Variables

```bash
# .env or .env.local
NEXT_PUBLIC_SITE_URL=https://get2know.io
```

### Default Fallback

If `NEXT_PUBLIC_SITE_URL` is not set, defaults to `https://get2know.io`.

## Build Validation

SEO validation runs during build to catch issues:

```bash
# Run validation manually
npm run validate:seo

# Runs automatically in:
npm run build
```

### Validation Checks

| Check | Severity | Action |
|-------|----------|--------|
| Missing title | Error | Fix required |
| Missing description | Warning | Log only |
| Missing hero image | Warning | Uses default |
| Invalid image origin | Error | Fix required |
| Unreachable image URL | Error | Fix required |

## Global Configuration

Located in `lib/seo/config.ts`:

```typescript
const globalSEOConfig = {
  siteName: 'Get2Know Labs',
  titleTemplate: '%s | Get2Know Labs',
  defaultDescription: '...',
  canonicalHost: process.env.NEXT_PUBLIC_SITE_URL,
  defaultShareImage: '/assets/site-shell-og.svg',
  locale: 'en_US',
  allowedImageOrigins: [
    'https://get2know.io',
    'https://cdn.get2know.io',
  ],
};
```

## Testing SEO Output

### Verify Generated Tags

1. Build the site: `npm run build`
2. Start production server: `npm run start`
3. View page source or use browser DevTools
4. Check `<head>` for meta tags

### External Validators

- **Facebook**: [Sharing Debugger](https://developers.facebook.com/tools/debug/)
- **Twitter**: [Card Validator](https://cards-dev.twitter.com/validator)
- **LinkedIn**: [Post Inspector](https://www.linkedin.com/post-inspector/)

## Common Issues

### Issue: Share image not appearing on social platforms

**Causes**:
1. Image URL is relative (not absolute)
2. Image origin not in allowlist
3. Image returns non-200 response

**Solution**: Check build logs for validation warnings, ensure image is accessible.

### Issue: Title showing as "[Page] | undefined"

**Cause**: `NEXT_PUBLIC_SITE_URL` not set or global config not loaded.

**Solution**: Verify environment variable is set in deployment.

### Issue: Canonical URL has wrong domain

**Cause**: Environment variable mismatch between local and production.

**Solution**: Set correct `NEXT_PUBLIC_SITE_URL` for each environment.
