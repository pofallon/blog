# Data Model: Blog Post Page Route

**Feature**: 006-blog-post-route  
**Date**: 2025-12-17  
**Status**: Complete

## Entities

### 1. BlogPostDocument (Source Entity)

Represents the raw MDX content file with parsed frontmatter. This is the source of truth loaded from `content/blog/{slug}/index.md`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `slug` | `string` | Yes | Canonical slug from directory name |
| `content` | `string` | Yes | Raw MDX body content (after frontmatter) |
| `frontmatter` | `BlogPostFrontmatter` | Yes | Parsed YAML frontmatter object |
| `filePath` | `string` | Yes | Absolute path to source file |

**Constraints**:
- Slug must match pattern from 004-preserve-slugs (`/^[a-z0-9-]+$/`)
- Content file must be `index.md` or `index.mdx` in post directory
- Frontmatter must be valid YAML between `---` delimiters

---

### 2. BlogPostFrontmatter (Embedded Entity)

Frontmatter metadata parsed from MDX file header.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `title` | `string` | Yes | "Untitled Post" | Display title |
| `date` | `string` | Yes | "Unknown Date" | ISO 8601 date (YYYY-MM-DD) |
| `description` | `string` | No | Auto-excerpt | Short summary (~160 chars) |
| `image` | `ImageMeta` | No | null | Hero image reference |
| `playlists` | `PlaylistRef[]` | No | [] | YouTube playlist references |

**Validation Rules**:
- `title`: Trim whitespace; if empty after trim, use fallback
- `date`: Must parse as valid date; log warning if invalid
- `description`: Max 200 chars; truncate with ellipsis if longer

---

### 3. BlogPostPageModel (View Model)

View-ready data structure for rendering the blog post page. Transforms `BlogPostDocument` into display-optimized format.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `slug` | `string` | Yes | Canonical slug for URL |
| `title` | `string` | Yes | Display title (with fallback applied) |
| `formattedDate` | `string` | Yes | Human-readable date (e.g., "May 2, 2020") |
| `rawDate` | `string` | Yes | ISO date for sorting/comparisons |
| `description` | `string` | Yes | Description or auto-excerpt |
| `canonicalUrl` | `string` | Yes | Full canonical URL for SEO |
| `compiledContent` | `MDXRemoteSerializeResult` | Yes | Compiled MDX for rendering |
| `heroImage` | `ProcessedImage \| null` | No | Optimized hero image |

**Derivation Rules**:
- `slug`: Copied from `BlogPostDocument.slug`
- `title`: From `frontmatter.title` or "Untitled Post"
- `formattedDate`: `date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })`
- `rawDate`: From `frontmatter.date` (ISO string)
- `description`: From `frontmatter.description` or first 160 chars of content
- `canonicalUrl`: `https://get2know.io/blog/${slug}`
- `compiledContent`: Result of `serialize(content, { mdxOptions })`

---

### 4. BlogPostMetadata (SEO Entity)

Metadata structure for `generateMetadata()` function in Next.js.

| Field | Type | Description |
|-------|------|-------------|
| `title` | `string` | Page title (post title) |
| `description` | `string` | Meta description |
| `openGraph` | `OpenGraphMetadata` | OG tags for social sharing |
| `twitter` | `TwitterMetadata` | Twitter card metadata |
| `alternates.canonical` | `string` | Canonical URL |

---

## TypeScript Type Definitions

```typescript
// src/lib/mdx/types.ts

import { MDXRemoteSerializeResult } from 'next-mdx-remote';

/**
 * Hero image metadata from frontmatter
 */
export interface ImageMeta {
  /** Relative path to image file */
  src: string;
  /** Alt text for accessibility */
  alt?: string;
}

/**
 * YouTube playlist reference in frontmatter
 */
export interface PlaylistRef {
  /** Playlist identifier for embedding */
  name: string;
  /** YouTube playlist ID */
  id: string;
}

/**
 * Raw frontmatter parsed from MDX file
 */
export interface BlogPostFrontmatter {
  title: string;
  date: string;
  description?: string;
  image?: ImageMeta;
  playlists?: PlaylistRef[];
}

/**
 * Source document loaded from content directory
 */
export interface BlogPostDocument {
  /** Canonical slug from directory name */
  slug: string;
  /** Raw MDX content body */
  content: string;
  /** Parsed frontmatter metadata */
  frontmatter: BlogPostFrontmatter;
  /** Absolute filesystem path */
  filePath: string;
}

/**
 * View model for blog post page rendering
 */
export interface BlogPostPageModel {
  /** Canonical slug for URL */
  slug: string;
  /** Display title (with fallback applied) */
  title: string;
  /** Human-readable date (e.g., "May 2, 2020") */
  formattedDate: string;
  /** ISO date string for sorting/comparison */
  rawDate: string;
  /** Description or auto-excerpt */
  description: string;
  /** Full canonical URL */
  canonicalUrl: string;
  /** Compiled MDX for rendering */
  compiledContent: MDXRemoteSerializeResult;
  /** Processed hero image (optional) */
  heroImage: ProcessedImage | null;
}

/**
 * Processed image for optimized display
 */
export interface ProcessedImage {
  /** Optimized image URL */
  src: string;
  /** Image width */
  width: number;
  /** Image height */
  height: number;
  /** Alt text */
  alt: string;
  /** Blur placeholder data URL */
  blurDataURL?: string;
}

/**
 * Page params for dynamic route
 */
export interface BlogPostParams {
  slug: string;
}
```

---

## Utility Functions

### getPostBySlug

Loads a single blog post by slug.

```typescript
// src/lib/mdx/loader.ts

export async function getPostBySlug(slug: string): Promise<BlogPostDocument | null> {
  const contentDir = path.join(process.cwd(), 'content/blog');
  const postDir = path.join(contentDir, slug);
  
  // Check for index.md or index.mdx
  const indexPath = await findIndexFile(postDir);
  if (!indexPath) {
    return null;
  }
  
  const fileContent = await fs.readFile(indexPath, 'utf-8');
  const { data: frontmatter, content } = matter(fileContent);
  
  // Log warnings for missing required fields
  if (!frontmatter.title) {
    console.warn(`[006] Missing title in ${slug}/index.md`);
  }
  if (!frontmatter.date) {
    console.warn(`[006] Missing date in ${slug}/index.md`);
  }
  
  return {
    slug,
    content,
    frontmatter: {
      title: frontmatter.title || 'Untitled Post',
      date: frontmatter.date || 'Unknown Date',
      description: frontmatter.description,
      image: frontmatter.image,
      playlists: frontmatter.playlists,
    },
    filePath: indexPath,
  };
}
```

### transformToPageModel

Converts document to view model.

```typescript
// src/lib/mdx/loader.ts

export async function transformToPageModel(
  doc: BlogPostDocument
): Promise<BlogPostPageModel> {
  const { slug, content, frontmatter } = doc;
  
  // Format date for display
  const date = new Date(frontmatter.date);
  const formattedDate = isNaN(date.getTime())
    ? frontmatter.date  // Keep original string if invalid
    : date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
  
  // Generate description fallback
  const description = frontmatter.description || generateExcerpt(content, 160);
  
  // Compile MDX content
  const compiledContent = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypePrism],
    },
  });
  
  // Process hero image if present
  const heroImage = frontmatter.image
    ? await processImage(frontmatter.image, doc.filePath)
    : null;
  
  return {
    slug,
    title: frontmatter.title,
    formattedDate,
    rawDate: frontmatter.date,
    description,
    canonicalUrl: `https://get2know.io/blog/${slug}`,
    compiledContent,
    heroImage,
  };
}
```

### getAllPostSlugs

Returns all valid slugs for static generation.

```typescript
// src/lib/mdx/loader.ts

export async function getAllPostSlugs(): Promise<string[]> {
  const contentDir = path.join(process.cwd(), 'content/blog');
  const entries = await fs.readdir(contentDir, { withFileTypes: true });
  
  const slugs: string[] = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const hasIndex = await findIndexFile(path.join(contentDir, entry.name));
      if (hasIndex) {
        slugs.push(entry.name);
      }
    }
  }
  
  return slugs;
}
```

---

## Entity Relationships

```
┌─────────────────────────┐
│   Content Directory     │
│   /content/blog/        │
└───────────┬─────────────┘
            │ contains (1:N)
            ▼
┌─────────────────────────┐
│   BlogPostDocument      │ ← Source entity
│   - slug                │
│   - content             │
│   - frontmatter         │
│   - filePath            │
└───────────┬─────────────┘
            │ transforms to (1:1)
            ▼
┌─────────────────────────┐
│   BlogPostPageModel     │ ← View model
│   - slug                │
│   - title               │
│   - formattedDate       │
│   - description         │
│   - compiledContent     │
│   - canonicalUrl        │
└───────────┬─────────────┘
            │ generates (1:1)
            ▼
┌─────────────────────────┐
│   BlogPostMetadata      │ ← SEO metadata
│   - title               │
│   - description         │
│   - openGraph           │
│   - canonical           │
└─────────────────────────┘
```

---

## Relationship to Existing Entities

### From spec-004 (preserve-slugs)
- `SlugManifestEntry` validates that `BlogPostDocument.slug` matches canonical manifest
- `normalizeForSlug()` used by middleware for redirect logic

### From spec-005 (blog-index)
- `BlogIndexEntry` is a subset of `BlogPostPageModel` (shared fields: slug, title, formattedDate, summary, url)
- Both derive from same content source with consistent transformations

---

## Error Handling

| Condition | Behavior |
|-----------|----------|
| Slug not found | Return `null` from `getPostBySlug()`, trigger `notFound()` in page |
| Missing title | Log warning, use "Untitled Post" fallback |
| Missing/invalid date | Log warning, use raw string or "Unknown Date" |
| Missing description | Auto-generate excerpt from content |
| MDX compilation error | Throw error, surface in build logs |
| Invalid image reference | Log warning, render without hero image |
