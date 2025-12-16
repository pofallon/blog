# Quickstart: Minimal Blog Index

**Feature**: 005-build-blog-index  
**Date**: 2025-12-16  
**Status**: Planned

## Overview

This guide explains how the blog index page works and how to add posts that appear on it.

## Implementation Paths

| Component | Path |
|-----------|------|
| Blog Index Page | `apps/site-shell/app/blog/page.tsx` |
| Index Loader | `apps/site-shell/lib/mdx/loader.ts` |
| Types | `apps/site-shell/lib/mdx/types.ts` |
| Post Card Component | `apps/site-shell/components/blog/BlogPostCard.tsx` |
| Content Directory | `content/posts/` |

## How It Works

### Data Flow

1. **Build Time**: `getAllPostsForIndex()` scans `/content/posts/` for MDX files
2. **Sorting**: Posts are sorted by date (newest first), then by title (A→Z) for same dates
3. **Filtering**: Future-dated posts are excluded from the listing
4. **Transformation**: `MDXEntry` objects become `BlogIndexEntry` view models
5. **Rendering**: Blog page displays posts using `BlogPostCard` component

### URL Structure

- Index page: `/blog`
- Individual posts: `/posts/{slug}` (e.g., `/posts/demo-mdx`)

## Adding a New Post

### 1. Create MDX File

Create a new file in the content directory:

```
content/posts/my-new-post.mdx
```

The filename becomes the URL slug: `my-new-post.mdx` → `/posts/my-new-post`

### 2. Add Frontmatter

```yaml
---
title: "My New Post Title"
date: "2025-12-16"
description: "A brief description of my post (max 200 characters)."
---
```

### 3. Write Content

```mdx
## Introduction

Your content here...

### Subheading

More content...
```

### 4. Build or Dev Server

The post will automatically appear on `/blog` after rebuild:

```bash
cd apps/site-shell
npm run dev
```

## Frontmatter Reference

| Field | Required | Format | Description |
|-------|----------|--------|-------------|
| `title` | Yes | String | Post title displayed on page |
| `date` | Yes | `YYYY-MM-DD` | Publication date |
| `description` | Yes* | String (≤200 chars) | Summary for index listing |
| `image.url` | No | Valid URL | Hero image source |
| `image.alt` | No** | String | Alt text |

*If description is missing, an auto-excerpt from the first ~160 characters is used.
**Required if image.url is provided.

## Display Rules

### Sorting

Posts are sorted by:
1. **Date** (newest first)
2. **Title** (A→Z) as tiebreaker for same dates

### Future-Dated Posts

Posts with a date in the future are **hidden** from the index until that date arrives. Use this to schedule posts.

### Empty State

When no posts exist (or all are future-dated), the page displays:

> "No posts yet. Check back soon!"

## Example Post

```mdx
---
title: "Getting Started with TypeScript"
date: "2025-12-15"
description: "Learn the basics of TypeScript for modern web development."
---

## Introduction

TypeScript adds static typing to JavaScript, helping you catch errors early...

### Why TypeScript?

- Type safety
- Better IDE support
- Improved refactoring

## Conclusion

Start using TypeScript today!
```

## Local Development

```bash
# Start development server
cd apps/site-shell
npm run dev

# View the blog index
open http://localhost:3000/blog

# View a specific post
open http://localhost:3000/posts/demo-mdx
```

## Troubleshooting

### Post Not Appearing

1. **Check the date**: Is it in the future? Future posts are hidden.
2. **Check frontmatter**: Ensure valid YAML syntax and required fields.
3. **Check file extension**: File must end in `.mdx`
4. **Check content directory**: File must be in `/content/posts/`

### Wrong Sort Order

1. **Check date format**: Must be `YYYY-MM-DD` (e.g., `2025-12-16`)
2. **Same date?**: Posts with identical dates sort by title A→Z

### Build Failure

1. **Check error message**: Frontmatter validation provides specific field errors
2. **Verify date validity**: Date must be a real calendar date
3. **Check for duplicates**: No two posts can have the same filename
