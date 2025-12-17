# SEO Metadata Framework Research

**Feature**: 009-seo-metadata  
**Date**: 2025-12-17  
**Phase**: 0 - Research

## Research Questions

### R1: Next.js Metadata API Best Practices

**Question**: What is the recommended approach for implementing SEO metadata in Next.js 14+ App Router?

**Decision**: Use the native Next.js Metadata API via `generateMetadata()` function and static `metadata` exports.

**Rationale**: 
- Next.js 14+ provides built-in Metadata API that handles server-side rendering of meta tags
- Works seamlessly with static generation and server components
- Automatic deduplication and merging of metadata from layout to page
- TypeScript-first with strong typing via `Metadata` type from `next`
- No browser globals needed; runs entirely on server

**Alternatives Considered**:
- `next/head` (deprecated in App Router)
- Third-party libraries like `next-seo` (unnecessary overhead, Next.js native API is sufficient)
- Custom head injection (bypasses Next.js optimizations)

**Implementation Pattern**:
```typescript
// Static metadata export for layouts/pages
export const metadata: Metadata = { ... };

// Dynamic metadata for pages with params
export async function generateMetadata({ params }): Promise<Metadata> { ... }
```

---

### R2: Existing Metadata Structure Analysis

**Question**: What metadata infrastructure already exists in the codebase?

**Decision**: Extend the existing `SiteMetadata` type and `getSiteMetadata()` function rather than creating parallel structures.

**Rationale**:
- `lib/types.ts` already defines `SiteMetadata` with `title`, `description`, `ogImage`
- `lib/site-shell.ts` provides `getSiteMetadata()` and centralized brand config
- `app/layout.tsx` already implements basic OpenGraph metadata
- `app/blog/[slug]/page.tsx` has partial implementation of `generateMetadata()` with OG and Twitter tags

**Current State**:
| Component | Location | Status |
|-----------|----------|--------|
| SiteMetadata type | `lib/types.ts` | Exists but needs extension |
| Global config | `lib/site-shell.ts` | Has title, description, ogImage |
| Root layout metadata | `app/layout.tsx` | Basic OG, needs Twitter |
| Blog post metadata | `app/blog/[slug]/page.tsx` | Has OG/Twitter, needs refinement |

**Gap Analysis**:
1. Missing: Twitter card tags in root layout
2. Missing: Canonical URL generation utility
3. Missing: Share image URL validation
4. Missing: Build-time frontmatter validation
5. Missing: Default share image fallback logic
6. Missing: Locale/siteName in global config

---

### R3: Canonical URL Generation Strategy

**Question**: How to generate absolute canonical URLs without browser globals?

**Decision**: Use `NEXT_PUBLIC_SITE_URL` environment variable with fallback to configured default.

**Rationale**:
- Environment variable already used in `app/layout.tsx`: `process.env.NEXT_PUBLIC_SITE_URL ?? 'https://get2know.io'`
- Works at build time (static generation) and request time (SSR)
- No dependency on `window.location` or request headers for canonical URL
- Consistent across all environments when properly configured

**Implementation Pattern**:
```typescript
// lib/seo/url-builder.ts
export function buildCanonicalUrl(path: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://get2know.io';
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteUrl.replace(/\/$/, '')}${normalizedPath}`;
}
```

**Edge Cases**:
- Trailing slashes: Strip from base URL, normalize on path
- Relative paths in frontmatter: Resolve to absolute using `buildCanonicalUrl()`
- Draft posts: Use full slug path to avoid collision

---

### R4: Share Image URL Validation

**Question**: How to validate share image URLs at build time per FR-007?

**Decision**: Implement build-time validation script that performs HTTP HEAD requests with timeout and concurrency controls.

**Rationale**:
- Spec requires: 5-second timeout per URL, max 10 concurrent validations
- Fail build on broken URLs to prevent social preview failures
- Only allow canonical host domain or pre-approved CDN origins
- Log validation errors to CI for debugging

**Implementation Pattern**:
```typescript
// lib/seo/image-validator.ts
interface ValidationResult {
  url: string;
  valid: boolean;
  error?: string;
}

async function validateShareImageUrl(
  url: string, 
  allowedOrigins: string[]
): Promise<ValidationResult> {
  // 1. Check URL origin against allowlist
  // 2. HTTP HEAD with 5s timeout
  // 3. Return validation result
}

// scripts/validate-seo.ts (build script)
async function validateAllShareImages(): Promise<void> {
  // 1. Collect all share image URLs from posts
  // 2. Validate with Promise.all + pLimit(10) for concurrency
  // 3. Report errors, exit non-zero on failure
}
```

**Allowed Origins** (from spec):
- Canonical host: `https://get2know.io`
- CDN origins: To be defined in config (e.g., `https://cdn.get2know.io`)

---

### R5: Frontmatter Schema for SEO

**Question**: What frontmatter fields are required/optional for SEO metadata?

**Decision**: Use existing frontmatter structure with documented field mappings to OpenGraph/Twitter.

**Rationale**:
- Spec states: "Every blog post already maintains frontmatter keys for `title`, `description`/`excerpt`, `slug`, `publishedDate`, and `heroImage`"
- Current `BlogPostFrontmatter` type in `lib/mdx/blog-post-types.ts` already has these fields
- Map existing fields rather than introducing new SEO-specific frontmatter

**Field Mapping**:
| Frontmatter Field | OG Tag | Twitter Tag |
|-------------------|--------|-------------|
| `title` | `og:title` | `twitter:title` |
| `description` | `og:description` | `twitter:description` |
| `date` | `og:article:published_time` | - |
| `hero.src` / `image` | `og:image` | `twitter:image` |
| (derived from slug) | `og:url` | - |

**Fallback Strategy**:
1. Missing `description` → Generate from first ~160 chars of content
2. Missing `hero`/`image` → Use global default share image
3. Missing mandatory fields → Build-time warning (FR-008)

---

### R6: Twitter Card Configuration

**Question**: Which Twitter card type and what metadata fields are required?

**Decision**: Use `summary_large_image` for posts with hero images, `summary` for posts without.

**Rationale**:
- Spec clarifies: "Q: Which Twitter card type should blog posts use? → A: `summary_large_image`"
- `summary_large_image` provides larger visual impact for content marketing
- Fallback to `summary` when no image available

**Required Twitter Tags**:
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{title}" />
<meta name="twitter:description" content="{description}" />
<meta name="twitter:image" content="{absolute_image_url}" />
```

**Existing Implementation**: `app/blog/[slug]/page.tsx` already implements this logic correctly.

---

## Dependencies

| Dependency | Purpose | Version |
|------------|---------|---------|
| Next.js Metadata API | Built-in, no additional deps | Next.js 14+ |
| `p-limit` | Concurrency control for validation | ^5.0.0 |

**Note**: `p-limit` may be needed for share image validation concurrency. Evaluate if native Promise patterns suffice.

## Risk Mitigations

| Risk | Mitigation |
|------|------------|
| Incomplete frontmatter | Build-time warnings via validation script; graceful fallbacks |
| Broken share images | URL validation at build time; fail build on errors |
| Canonical misconfiguration | Environment-specific validation; document required env vars |
| Performance impact | Concurrent validation with limits; cached/static metadata |

## Next Steps

1. **Phase 1**: Create data model for SEO configuration types
2. **Phase 1**: Define API contracts for metadata utilities
3. **Phase 1**: Generate quickstart documentation
