# Research: Blog Post Page Route

**Feature**: 006-blog-post-route  
**Date**: 2025-12-17  
**Status**: Complete

## Research Questions

### RQ-1: How should Next.js App Router dynamic routes handle blog post slugs?

**Decision**: Use `src/app/blog/[slug]/page.tsx` with `generateStaticParams()` for SSG

**Rationale**:
- App Router's file-based routing provides clear `/blog/[slug]` URL structure
- `generateStaticParams()` pre-generates all blog post pages at build time for optimal performance
- Integrates naturally with existing slug enumeration from `src/lib/slug/enumerate.ts`
- Supports on-demand ISR fallback for new content without full rebuild

**Alternatives Considered**:
- Pages Router (`pages/blog/[slug].tsx`): Rejected; project is migrating to App Router pattern
- Catch-all route (`[...slug]`): Rejected; single-segment slugs don't need catch-all complexity

---

### RQ-2: How should MDX content be loaded and rendered in App Router?

**Decision**: Use `next-mdx-remote` with server-side compilation

**Rationale**:
- Server Components can compile MDX at build/request time without client-side JS bundle
- Supports custom component mappings matching existing Gatsby MDX components
- Handles frontmatter parsing consistently with existing content
- Constitution III requires no content rewrites; next-mdx-remote works with existing MDX files

**Alternatives Considered**:
- `@next/mdx` with file imports: Rejected; requires specific file structure changes
- `mdx-bundler`: More powerful but heavier; not needed for this use case
- Custom remark/rehype pipeline: Rejected; unnecessary complexity

---

### RQ-3: How should non-canonical URL variants (case, trailing slashes) be handled?

**Decision**: Implement Next.js middleware for 301 redirects to canonical slugs

**Rationale**:
- FR-005 requires canonical URL handling
- Edge case spec requires `/blog/My-Post/` → 301 to `/blog/my-post`
- Middleware runs before page rendering, avoiding duplicate content indexing
- Can reuse `normalizeForSlug()` from `src/lib/slug/normalize.ts`

**Alternatives Considered**:
- Handle in page component with redirect: Rejected; renders page before redirect, poor SEO
- next.config.js redirects: Rejected; can't handle dynamic patterns easily
- Let both URLs resolve: Rejected; violates FR-005 and edge case requirements

---

### RQ-4: How should 404 handling work for invalid slugs?

**Decision**: Use Next.js `notFound()` function from `next/navigation`

**Rationale**:
- App Router's `notFound()` triggers the nearest `not-found.tsx` error boundary
- Returns proper 404 HTTP status code (SC-003 requirement)
- Can include navigation back to `/blog` in the not-found component
- Works consistently between SSG and runtime rendering

**Alternatives Considered**:
- Custom error page with redirect: Rejected; changes URL, confuses users
- Return empty state in page: Rejected; doesn't return 404 status
- Throw custom error: Rejected; less idiomatic than `notFound()`

---

### RQ-5: How should SEO metadata be exposed for blog posts?

**Decision**: Use Next.js `generateMetadata()` async function in page file

**Rationale**:
- App Router's metadata API provides type-safe head management
- Supports OpenGraph and Twitter card metadata for social previews
- Can read frontmatter to populate title, description, canonical URL
- Replaces Gatsby's `react-helmet` based SEO component

**Alternatives Considered**:
- Client-side `<Head>`: Rejected; App Router prefers server metadata
- Static metadata export: Rejected; need dynamic per-post metadata
- Keep using react-helmet: Rejected; not designed for App Router

---

### RQ-6: What component structure best supports MDX rendering?

**Decision**: Three-component architecture: Header, Body, Navigation

**Rationale**:
- `BlogPostHeader`: Title, formatted date, description - matches FR-002
- `BlogPostBody`: MDX content with component mappings - matches FR-003
- `BlogPostNav`: Back link to /blog - matches FR-007
- Separates concerns, enables independent styling and testing
- Reuses pattern from existing Gatsby blog-post template

**Alternatives Considered**:
- Single monolithic component: Rejected; harder to maintain and test
- More granular components: Rejected; over-engineering for current scope
- HOC/render props pattern: Rejected; React hooks are cleaner

---

### RQ-7: How should missing metadata fallbacks work?

**Decision**: Apply fallbacks during MDX loading with build-time console warnings

**Rationale**:
- FR-006 requires fallback values ("Untitled Post", "Unknown Date") without blocking
- Warnings in dev console help editorial team fix issues
- Transformation happens in data loading layer, keeping components simple
- Matches existing `BlogIndexEntry` fallback patterns from 005

**Alternatives Considered**:
- Fail build on missing metadata: Rejected; violates FR-006
- Silent fallbacks: Rejected; FR-006 requires build-time warnings
- Runtime error boundaries: Rejected; hides problems too deeply

---

### RQ-8: How should lazy loading for embeds be implemented?

**Decision**: Native HTML attributes (`loading="lazy"`) on images/iframes in MDX components

**Rationale**:
- Edge case spec requires lazy-loaded embeds for long posts
- Native browser support means no additional JS bundle
- Can be implemented in MDX component mappings (img, iframe overrides)
- Supports LCP < 1.5s goal (SC-002)

**Alternatives Considered**:
- Intersection Observer library: Rejected; native lazy loading sufficient
- React.lazy for components: Rejected; content embeds, not component code
- Third-party lazy loading library: Rejected; unnecessary dependency

---

## Technology Decisions Summary

| Area | Decision | Dependency |
|------|----------|------------|
| Routing | App Router dynamic route | Next.js 14+ |
| MDX Rendering | next-mdx-remote | `next-mdx-remote` |
| URL Normalization | Middleware redirects | `src/lib/slug/normalize.ts` |
| 404 Handling | `notFound()` function | `next/navigation` |
| SEO | `generateMetadata()` API | Next.js 14+ |
| Lazy Loading | Native HTML attributes | None |
| Styling | Tailwind CSS prose classes | Existing `tailwindcss` |

---

## Integration Points

### From spec-004 (preserve-slugs)
- `normalizeForSlug()` - URL normalization function
- `enumerateContentFiles()` - List all valid content paths
- `SlugManifestEntry` - Type definitions for slug mappings

### From spec-005 (blog-index)
- `BlogIndexEntry` - View model type (extend for full post)
- `transformToBlogIndexEntry()` - Date formatting logic (reuse pattern)
- Content directory structure assumptions

### Existing Gatsby Components (reference)
- `src/templates/blog-post.js` - Layout structure reference
- `src/components/seo.js` - Meta tag patterns
- `src/components/layout.js` - Site wrapper

---

## Open Questions (Resolved)

All clarifications from spec resolved in session 2025-12-17:
- ✅ Non-canonical URLs → 301 redirect
- ✅ Long MDX bodies → Single page with lazy embeds
- ✅ Missing metadata alerts → Build-time warnings + console logging
- ✅ Performance metric → LCP
- ✅ Accessibility level → WCAG 2.1 AA
