# Data Model: Minimal Blog Index

**Feature**: 005-build-blog-index  
**Date**: 2025-12-16  
**Status**: Complete

## Entities

### 1. BlogIndexEntry (View Model)

View model for displaying a post entry on the `/blog` index page. Transforms `MDXEntry` from the existing content pipeline into UI-ready data.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `slug` | `string` | Yes | Post identifier (from filename) |
| `title` | `string` | Yes | Display title from frontmatter |
| `formattedDate` | `string` | Yes | Human-readable date (e.g., "May 2, 2020") |
| `rawDate` | `string` | Yes | ISO date for sorting/comparison |
| `summary` | `string` | Yes | Description or auto-excerpt (~160 chars) |
| `url` | `string` | Yes | Canonical post URL (e.g., `/posts/demo-mdx`) |

**Derivation Rules**:
- `slug`: Copied from `MDXEntry.slug`
- `title`: From `MDXEntry.metadata.title` (fallback: "Untitled Post")
- `formattedDate`: Transform `date` via `toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })`
- `rawDate`: From `MDXEntry.metadata.date` (for sorting)
- `summary`: From `MDXEntry.metadata.description` or auto-excerpt from `content`
- `url`: Template `/posts/${slug}`

---

### 2. MDXEntry (Existing - Extended)

Already defined in spec-003. For reference:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `slug` | `string` | Yes | Route identifier derived from filename |
| `metadata` | `FrontmatterMetadata` | Yes | Validated frontmatter data |
| `content` | `string` | Yes | Raw MDX content (body after frontmatter) |
| `filePath` | `string` | Yes | Absolute path to source file |

---

### 3. FrontmatterMetadata (Existing - Reference)

Already defined in spec-003. Required fields for blog posts:

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `title` | `string` | Yes | Non-empty, trimmed |
| `date` | `string` | Yes | ISO format `YYYY-MM-DD` |
| `description` | `string` | Yes | Non-empty, max 200 chars |
| `image` | `ImageMeta` | No | Optional hero image |

---

## TypeScript Type Definitions

```typescript
// lib/mdx/types.ts (additions)

/**
 * View model for blog index page entries
 * Transforms MDXEntry for UI consumption
 */
export interface BlogIndexEntry {
  /** Post identifier from filename */
  slug: string;
  /** Display title from frontmatter */
  title: string;
  /** Human-readable date (e.g., "May 2, 2020") */
  formattedDate: string;
  /** ISO date string for sorting/comparison */
  rawDate: string;
  /** Description or auto-generated excerpt */
  summary: string;
  /** Canonical URL path (e.g., "/posts/demo-mdx") */
  url: string;
}

/**
 * Configuration options for post listing
 */
export interface BlogIndexOptions {
  /** Include future-dated posts (default: false) */
  includeFuture?: boolean;
  /** Maximum number of posts to return (default: unlimited) */
  limit?: number;
}
```

---

## Utility Functions

### transformToBlogIndexEntry

Converts an `MDXEntry` to a `BlogIndexEntry` for display.

```typescript
// lib/mdx/loader.ts (new function)

export function transformToBlogIndexEntry(entry: MDXEntry): BlogIndexEntry {
  const title = entry.metadata.title || 'Untitled Post';
  const date = new Date(entry.metadata.date);
  
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  
  const summary = entry.metadata.description || generateExcerpt(entry.content);
  
  return {
    slug: entry.slug,
    title,
    formattedDate,
    rawDate: entry.metadata.date,
    summary,
    url: `/posts/${entry.slug}`,
  };
}
```

### generateExcerpt

Creates auto-excerpt from MDX body content when description is missing.

```typescript
// lib/mdx/loader.ts (new function)

function generateExcerpt(content: string, maxLength = 160): string {
  const plainText = content
    .replace(/^#+\s+.*/gm, '')           // Remove headers
    .replace(/```[\s\S]*?```/g, '')      // Remove code blocks
    .replace(/<[^>]+>/g, '')             // Remove JSX/HTML tags
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links → text only
    .replace(/[*_`~]/g, '')              // Remove formatting chars
    .replace(/\n+/g, ' ')                // Normalize whitespace
    .trim();
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  // Truncate at word boundary
  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '…';
}
```

### getAllPostsForIndex

Returns sorted, filtered posts ready for index display.

```typescript
// lib/mdx/loader.ts (new function)

export function getAllPostsForIndex(
  options: BlogIndexOptions = {}
): BlogIndexEntry[] {
  const { includeFuture = false, limit } = options;
  const { posts } = getAllPosts();
  const now = new Date();
  
  // Filter future-dated posts
  let filteredPosts = posts;
  if (!includeFuture) {
    filteredPosts = posts.filter(post => {
      const postDate = new Date(post.metadata.date);
      return postDate <= now;
    });
  }
  
  // Sort by date descending, then title ascending
  const sortedPosts = filteredPosts.sort((a, b) => {
    const dateA = new Date(a.metadata.date);
    const dateB = new Date(b.metadata.date);
    
    if (dateA.getTime() !== dateB.getTime()) {
      return dateB.getTime() - dateA.getTime(); // Newest first
    }
    
    return a.metadata.title.localeCompare(b.metadata.title); // A→Z tiebreaker
  });
  
  // Apply limit if specified
  const limitedPosts = limit ? sortedPosts.slice(0, limit) : sortedPosts;
  
  // Transform to view model
  return limitedPosts.map(transformToBlogIndexEntry);
}
```

---

## Entity Relationships

```
┌─────────────────────┐
│  ContentDirectory   │
│  /content/posts/    │
└──────────┬──────────┘
           │ contains (1:N)
           ▼
┌─────────────────────┐
│     MDXEntry        │ ← Existing from spec-003
│  - slug             │
│  - metadata         │
│  - content          │
└──────────┬──────────┘
           │ transforms to (1:1)
           ▼
┌─────────────────────┐
│  BlogIndexEntry     │ ← NEW for spec-005
│  - slug             │
│  - title            │
│  - formattedDate    │
│  - summary          │
│  - url              │
└─────────────────────┘
```

---

## Validation Rules

### Existing (from spec-003)
- Title must be non-empty string
- Date must be `YYYY-MM-DD` format and valid calendar date
- Description must be non-empty (but fallback exists)

### New (for spec-005)
- **Future date filtering**: Posts with date > current date excluded by default
- **Title fallback**: Missing/empty title renders as "Untitled Post"
- **Description fallback**: Missing description auto-generates excerpt

---

## State Transitions

None. `BlogIndexEntry` is a read-only view model computed at build time.

---

## Error Handling

| Condition | Behavior |
|-----------|----------|
| No posts found | Return empty array; UI shows "No posts yet. Check back soon!" |
| Invalid date in post | Build fails (existing validation) |
| Missing description | Auto-generate excerpt from content |
| Missing title | Fallback to "Untitled Post" |
| Content directory missing | Return empty array (existing behavior) |
