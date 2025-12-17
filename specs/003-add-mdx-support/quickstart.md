# Quickstart: MDX Content Pipeline

**Feature**: 003-add-mdx-support  
**Date**: 2025-12-15  
**Status**: ✅ Implemented

## Overview

This guide explains how to add MDX content to the blog using the new content pipeline.

## Implementation Paths

| Component | Path |
|-----------|------|
| Types | `apps/site-shell/lib/mdx/types.ts` |
| Parser | `apps/site-shell/lib/mdx/parser.ts` |
| Loader | `apps/site-shell/lib/mdx/loader.ts` |
| Validator | `apps/site-shell/lib/mdx/validator.ts` |
| Component Registry | `apps/site-shell/components/mdx/index.ts` |
| MDX Renderer | `apps/site-shell/components/mdx/MDXContent.tsx` |
| Post Page | `apps/site-shell/app/posts/[slug]/page.tsx` |
| Content Directory | `content/posts/` |

## Prerequisites

- Node.js 18+ LTS
- Access to the monorepo at `/workspaces/blog`
- Understanding of YAML frontmatter syntax

## Adding a New MDX Post

### 1. Create the MDX File

Create a new `.mdx` file in the content directory:

```
content/posts/your-post-slug.mdx
```

The filename becomes the URL slug: `your-post-slug.mdx` → `/posts/your-post-slug`

### 2. Add Required Frontmatter

Every MDX file must start with YAML frontmatter containing these required fields:

```yaml
---
title: "Your Post Title"
date: "2025-12-15"
description: "A brief description of your post (max 200 characters)."
---
```

### 3. Add Optional Image (if desired)

```yaml
---
title: "Your Post Title"
date: "2025-12-15"
description: "A brief description of your post."
image:
  url: "https://example.com/your-image.jpg"
  alt: "Descriptive alt text for accessibility"
---
```

### 4. Write Your Content

After the frontmatter, write your content using standard Markdown and MDX:

```mdx
---
title: "Getting Started with TypeScript"
date: "2025-12-15"
description: "Learn the basics of TypeScript for modern web development."
---

## Introduction

This is a paragraph with **bold** and *italic* text.

### Code Examples

Here's some TypeScript code:

```typescript
const greeting: string = "Hello, World!";
console.log(greeting);
```

## Conclusion

That's all for now!
```

## Frontmatter Reference

| Field | Required | Format | Description |
|-------|----------|--------|-------------|
| `title` | Yes | String | Post title displayed on page |
| `date` | Yes | `YYYY-MM-DD` | Publication date |
| `description` | Yes | String (≤200 chars) | Summary for previews |
| `image.url` | No | Valid URL | Hero image source |
| `image.alt` | No* | String | Alt text (*required if image.url present) |

## Validation Rules

The build will fail if:

- **Missing required field**: Title, date, or description is not provided
- **Invalid date format**: Date is not in `YYYY-MM-DD` format
- **Invalid date value**: Date is not a real calendar date
- **Duplicate slugs**: Two files have the same filename
- **Missing alt text**: Image URL provided without alt text

## Example: Demo MDX Entry

```mdx
---
title: "Welcome to MDX"
date: "2025-12-15"
description: "This is a demo post proving the MDX pipeline works end-to-end."
---

## Hello, MDX!

This is the demo entry for the MDX content pipeline. If you're seeing this
page rendered at `/posts/demo-mdx`, the pipeline is working correctly.

### Features Demonstrated

- Frontmatter parsing ✓
- Markdown rendering ✓
- Build-time validation ✓

## Next Steps

Add your own MDX files to `/content/posts/` and they'll automatically
appear as new routes.
```

## Local Development

1. Start the development server:
   ```bash
   cd apps/site-shell
   npm run dev
   ```

2. Navigate to `http://localhost:3000/posts/demo-mdx`

3. Edit `content/posts/demo-mdx.mdx` and see changes on refresh

## Troubleshooting

### Build Fails with "Missing required field"

Check your frontmatter for typos. Common issues:
- Field name is misspelled (e.g., `titel` instead of `title`)
- Missing colon after field name
- Incorrect indentation for image fields

### Build Fails with "Invalid date format"

Ensure date is exactly `YYYY-MM-DD`:
- ✅ `2025-12-15`
- ❌ `12/15/2025`
- ❌ `2025-12-15T00:00:00Z`

### Build Fails with "Duplicate slug"

Two files have the same name. Rename one of them:
- Check the error message for conflicting file paths
- Rename one file to have a unique slug

## Component Whitelist

Only approved components can be used in MDX files. Using unrecognized
components will render them as escaped text with a build warning.

Contact the development team to add new components to the whitelist.
