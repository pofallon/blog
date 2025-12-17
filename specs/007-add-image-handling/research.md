# Research: Blog Image Handling

**Feature**: 007-add-image-handling  
**Date**: 2025-12-17  
**Status**: Complete

## Research Tasks

### 1. Next.js Image Optimization with AWS Amplify

**Task**: Research best practices for `next/image` with AWS Amplify deployment.

**Decision**: Use Next.js `next/image` component with `unoptimized: false` (default) for local development and Amplify deployment.

**Rationale**: 
- AWS Amplify natively supports Next.js Image Optimization API since Amplify Hosting v2
- No additional CDN configuration required
- Automatic format conversion (WebP/AVIF) based on browser support
- Built-in responsive srcset generation matches our breakpoints (480, 768, 1200, 1920px)

**Alternatives Considered**:
- **sharp with custom build**: More control but adds build complexity, violates constitution V
- **External CDN (Cloudinary/Imgix)**: Out of scope per spec assumptions, adds external dependency
- **Static export with pre-generated variants**: Increases build time, storage requirements

### 2. Image Storage Location Pattern

**Task**: Research optimal directory structure for blog images.

**Decision**: Store images in `content/images/<post-slug>/` at repository root.

**Rationale**:
- Aligns with constitution Architectural Decision on content location (content independent of framework)
- Clear ownership: each post's images co-located by slug
- Prevents filename collisions across posts (edge case in spec)
- Enables simple glob patterns for validation at build time

**Alternatives Considered**:
- **`public/images/<post-slug>/`**: Would work for static serving but mixes content with application assets
- **`content/posts/<slug>/images/`**: Co-located but complicates MDX file discovery
- **Single flat directory**: Higher collision risk, harder to clean up unused images

### 3. Hero Image Frontmatter Schema

**Task**: Research frontmatter schema patterns for optional hero images.

**Decision**: Extend existing `ImageMeta` type with additional fields for hero use case.

**Schema**:
```yaml
hero:
  src: "hero.jpg"              # Required: relative path within content/images/<slug>/
  alt: "Description"           # Required: accessibility text (warn if missing per FR-005)
  caption: "Photo credit"      # Optional: displayed caption
  focalPoint: "center"         # Optional: CSS object-position value
```

**Rationale**:
- Matches existing `ImageMeta` pattern in `blog-post-types.ts`
- `focalPoint` enables responsive cropping control (FR-001)
- Zod schema provides build-time validation (FR-005)

**Alternatives Considered**:
- **Flat fields (heroSrc, heroAlt)**: Less extensible, harder to type
- **Full image object with dimensions**: Adds author burden; dimensions derived at build time

### 4. MDX Inline Image Component

**Task**: Research MDX component patterns for inline images.

**Decision**: Create `<Image>` MDX component that wraps `next/image` with responsive sizing.

**Usage in MDX**:
```mdx
<Image src="screenshot.png" alt="Dashboard view" caption="The new dashboard" />
```

**Rationale**:
- Standard MDX component pattern already used in codebase
- Explicit component over markdown image syntax enables validation and optimization
- Caption support addresses FR-004 inline requirements

**Alternatives Considered**:
- **Standard markdown images `![alt](src)`**: No caption support, harder to intercept for optimization
- **rehype plugin for auto-transformation**: Implicit magic, harder to debug, violates principle II transparency

### 5. Image Validation at Build Time

**Task**: Research build-time validation patterns for image references.

**Decision**: Extend existing Zod validation in `lib/mdx/validator.ts` with image existence checks.

**Implementation**:
1. Parse frontmatter for hero image path
2. Scan MDX content for `<Image>` component usage (regex or AST)
3. Verify each referenced file exists in `content/images/<slug>/`
4. Check for width/height availability (derive from file or require in frontmatter)
5. Warn on missing alt text (FR-005)

**Rationale**:
- Existing validation infrastructure in place
- Build fails fast on broken references (FR-005)
- Consistent error format with current MDX pipeline

**Alternatives Considered**:
- **Runtime 404 handling**: Poor UX, hard to debug
- **Separate validation script**: Adds tooling, not integrated with build

### 6. Responsive Breakpoints and Lazy Loading

**Task**: Research implementation for specified breakpoints and lazy loading threshold.

**Decision**: Use `next/image` `sizes` prop with custom breakpoints and native lazy loading.

**Configuration**:
```typescript
const IMAGE_SIZES = "(max-width: 480px) 100vw, (max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px";
const deviceSizes = [480, 768, 1200, 1920];
```

**Lazy Loading**: Native browser lazy loading with `loading="lazy"` and custom IntersectionObserver for 200px threshold via `lazyBoundary="200px"`.

**Rationale**:
- Matches spec FR-006 breakpoints exactly
- `next/image` generates optimized srcset automatically
- Native lazy loading has excellent browser support, IntersectionObserver polyfill not needed

**Alternatives Considered**:
- **Third-party lazy loading library**: Adds bundle size, not needed with native support
- **Custom responsive image generation**: Reinvents wheel, `next/image` handles this

### 7. Empty Hero State Design

**Task**: Research fallback behavior when hero metadata is absent.

**Decision**: Render reserved space with CSS background matching theme, maintaining layout stability.

**Implementation**:
```tsx
// HeroImage.tsx
{heroImage ? (
  <Image ... />
) : (
  <div className="aspect-video bg-slate-100 dark:bg-slate-800" aria-hidden="true" />
)}
```

**Rationale**:
- Matches acceptance scenario 1.2 in spec
- `aspect-video` (16:9) provides consistent height
- Theme-aware background prevents flash of wrong color
- `aria-hidden` prevents screen reader confusion

**Alternatives Considered**:
- **No reserved space**: Causes layout shift (violates FR-002)
- **Default placeholder image**: Adds visual noise, unnecessary for text-focused posts

## Dependencies Summary

| Package | Version | Purpose |
|---------|---------|---------|
| next/image | 14.2+ (built-in) | Image optimization, responsive sizing |
| zod | 4.2+ (existing) | Frontmatter/image schema validation |
| gray-matter | 4.0+ (existing) | Frontmatter parsing |

No new dependencies required. All functionality achievable with existing stack.

## Open Questions Resolved

All NEEDS CLARIFICATION items from spec have been addressed:

| Original Question | Resolution |
|-------------------|------------|
| Build behavior for oversized images | Auto-resize/compress + warning (spec clarification) |
| External URL handling | Warn + render unoptimized (spec clarification) |
| Missing alt text | Warn + allow render with empty alt (spec clarification) |
| Responsive breakpoints | 480, 768, 1200, 1920px (spec clarification) |
| Lazy loading threshold | 200px viewport (spec clarification) |
| Empty hero display | CSS background matching theme (spec clarification) |
