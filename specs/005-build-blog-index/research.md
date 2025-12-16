# Research: Minimal Blog Index

**Feature**: 005-build-blog-index  
**Date**: 2025-12-16  
**Status**: Complete

## Research Tasks

### 1. Extending MDX Loader for Index Listing

**Task**: Determine how to extend the existing MDX loader to support sorted post listings

**Decision**: Add `getAllPostsSorted()` function to existing `lib/mdx/loader.ts`

**Rationale**:
- Existing `getAllPosts()` returns unsorted posts; extend rather than replace
- Sort by `metadata.date` descending, then alphabetically by `metadata.title` as tiebreaker
- Filter out future-dated posts at load time (per spec edge case)
- Maintains single source of truth for content loading

**Alternatives Considered**:
- New separate module - Rejected: duplicates content scanning logic
- Sort in component - Rejected: repeated work on every render
- GraphQL-style layer - Rejected: overengineering for static site

---

### 2. Date Comparison and Sorting

**Task**: Define date comparison strategy for sorting and future-date filtering

**Decision**: Parse ISO dates as JavaScript Date objects for comparison

**Rationale**:
- Frontmatter dates are already validated as `YYYY-MM-DD` format
- `new Date(dateString)` handles ISO format reliably
- Compare against `new Date()` for future-date exclusion
- Sort comparison: `dateB.getTime() - dateA.getTime()` for descending order

**Implementation**:
```typescript
function comparePosts(a: MDXEntry, b: MDXEntry): number {
  const dateA = new Date(a.metadata.date);
  const dateB = new Date(b.metadata.date);
  
  if (dateA.getTime() !== dateB.getTime()) {
    return dateB.getTime() - dateA.getTime(); // Newest first
  }
  
  // Tiebreaker: alphabetical by title (A→Z)
  return a.metadata.title.localeCompare(b.metadata.title);
}
```

---

### 3. Fallback Description Strategy

**Task**: Define how to generate excerpt when `frontmatter.description` is missing

**Decision**: Extract first ~160 characters from MDX body content

**Rationale**:
- Spec requires auto-excerpt from first ~160 chars
- Strip MDX syntax (headers, code blocks, JSX) before truncating
- Use simple regex replacement rather than full AST parsing
- Add ellipsis if truncated

**Implementation**:
```typescript
function generateExcerpt(content: string, maxLength = 160): string {
  // Strip MDX/Markdown syntax
  const plainText = content
    .replace(/^#+\s+.*/gm, '') // Remove headers
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/<[^>]+>/g, '') // Remove JSX/HTML tags
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links → text only
    .replace(/[*_`~]/g, '') // Remove formatting chars
    .trim();
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  return plainText.substring(0, maxLength).trim() + '…';
}
```

---

### 4. BlogIndexEntry View Model

**Task**: Define the view model for index page display

**Decision**: Create `BlogIndexEntry` type that transforms `MDXEntry` for UI consumption

**Rationale**:
- Separates data layer (MDXEntry) from presentation layer
- Pre-formats date for display (e.g., "May 2, 2020")
- Handles description fallback at transformation time
- Includes computed `url` field for routing

**Fields**:
- `title`: string - from frontmatter
- `formattedDate`: string - human-readable date
- `summary`: string - description or auto-excerpt
- `url`: string - canonical post URL (e.g., `/posts/demo-mdx`)
- `slug`: string - raw slug for keys/ids

---

### 5. URL/Slug Routing Strategy

**Task**: Determine how to link from index to individual posts

**Decision**: Use existing `/posts/[slug]` route structure

**Rationale**:
- Posts currently route to `/posts/{slug}` via `app/posts/[slug]/page.tsx`
- Index links should use `href="/posts/{slug}"` format
- Spec mentions `/blog/playlist-reinvent-2019/` but current implementation uses `/posts/`
- Legacy content in `/content/blog/` may need separate handling (out of scope for this feature)

**Note**: The existing Gatsby site used `/blog/{slug}` routes. The Next.js migration uses `/posts/{slug}`. This is a known URL structure change that may need a redirect strategy in a future spec.

---

### 6. Empty State Handling

**Task**: Define empty state display when no posts exist

**Decision**: Render static message per spec requirement

**Rationale**:
- Spec explicitly defines: "No posts yet. Check back soon!"
- No spinner or loading state needed (static generation)
- Simple conditional render in component

**Implementation**:
```tsx
{posts.length === 0 ? (
  <p>No posts yet. Check back soon!</p>
) : (
  <PostList posts={posts} />
)}
```

---

### 7. Accessibility Requirements

**Task**: Define accessibility patterns for the index page

**Decision**: Use semantic HTML with keyboard navigation support

**Rationale**:
- Spec requires: "semantic list or section headings, keyboard-focusable links"
- Use `<article>` or `<section>` for each post entry
- Use `<h1>` for page title, `<h2>` for post titles within list
- Ensure entire card is clickable via wrapping `<Link>` or focusable `<a>`

**Implementation Pattern**:
```tsx
<main>
  <h1>Blog</h1>
  <section aria-label="Blog posts">
    {posts.map(post => (
      <article key={post.slug}>
        <Link href={post.url}>
          <h2>{post.title}</h2>
          <time dateTime={post.date}>{post.formattedDate}</time>
          <p>{post.summary}</p>
        </Link>
      </article>
    ))}
  </section>
</main>
```

---

### 8. Build-Time Validation for Slug Consistency

**Task**: Evaluate slug mismatch detection per spec edge case

**Decision**: Defer to existing slug verification system

**Rationale**:
- `verify-slugs.ts` CLI already handles slug consistency checks
- Runs as `prebuild` script via `npm run verify-slugs`
- Adding duplicate checks to index loading would be redundant
- Build fails on slug issues before index page is generated

**Existing System**:
- `/src/lib/slug/verify.ts` - verification logic
- `/src/cli/verify-slugs.ts` - CLI entry point
- Runs automatically on `npm run build`

---

## Technology Decisions Summary

| Component | Choice | Location |
|-----------|--------|----------|
| Content Loading | Extend `getAllPosts()` | `lib/mdx/loader.ts` |
| Sorting | Date descending + title alpha | `lib/mdx/loader.ts` |
| Date Formatting | `toLocaleDateString()` with options | `lib/mdx/loader.ts` |
| Excerpt Generation | Regex-based stripping | `lib/mdx/loader.ts` |
| View Model | `BlogIndexEntry` type | `lib/mdx/types.ts` |
| UI Component | `BlogPostCard` | `components/blog/` |
| Page | Server Component | `app/blog/page.tsx` |

## Dependencies

No new dependencies required. Feature uses existing:
- `next-mdx-remote` (content rendering)
- `gray-matter` (frontmatter parsing)
- `zod` (validation)

## Open Questions Resolved

All technical questions resolved through this research phase:
- ✅ How to sort posts → Date descending with title tiebreaker
- ✅ How to handle missing description → Auto-excerpt from body
- ✅ How to route to posts → Existing `/posts/[slug]` pattern
- ✅ How to handle empty state → Static message per spec
- ✅ How to handle future dates → Filter at load time
