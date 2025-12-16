# Research: MDX Content Pipeline

**Feature**: 003-add-mdx-support  
**Date**: 2025-12-15  
**Status**: Complete

## Research Tasks

### 1. MDX Rendering in Next.js App Router

**Task**: Evaluate MDX rendering libraries compatible with Next.js 14 App Router

**Decision**: Use `next-mdx-remote` for server-side MDX compilation

**Rationale**:
- Official recommendation for dynamic MDX content in App Router
- Supports RSC (React Server Components) via `next-mdx-remote/rsc`
- Separates content from code (MDX files can live outside app directory)
- Active maintenance and Next.js version compatibility
- Supports custom components via `MDXRemote` component props

**Alternatives Considered**:
- `@next/mdx` - Requires MDX files inside `app/` directory; not suitable for `/content/posts/` structure
- `mdx-bundler` - More complex setup, bundle-time evaluation; overkill for this use case
- `contentlayer` - Project appears unmaintained; compatibility concerns with Next.js 14

---

### 2. Frontmatter Parsing Strategy

**Task**: Determine best approach for extracting and validating frontmatter metadata

**Decision**: Use `gray-matter` for parsing + `zod` for schema validation

**Rationale**:
- `gray-matter` is the de-facto standard for frontmatter parsing (used by Gatsby, Hugo, etc.)
- Zero dependencies, fast, battle-tested
- `zod` provides runtime type validation with excellent TypeScript inference
- Zod schemas generate types automatically, ensuring contract stays in sync
- Clear error messages for validation failures (meets FR-002 requirement)

**Alternatives Considered**:
- `front-matter` npm package - Fewer features than gray-matter
- Manual YAML parsing - More code, more bugs, less maintainable
- `yup` for validation - Similar to zod but less TypeScript-native

---

### 3. Build-Time Validation Approach

**Task**: Determine when and how to validate MDX files

**Decision**: Validate during content loading at build time (static generation)

**Rationale**:
- Next.js `generateStaticParams` runs at build time, natural validation point
- Validation errors surface immediately in build logs
- Throwing errors in loader halts build (meets FR-002)
- Summary logging via Node.js console during build

**Implementation**:
```typescript
// Validation occurs in lib/mdx/loader.ts
// 1. Read all .mdx files from /content/posts/
// 2. Parse frontmatter with gray-matter
// 3. Validate each against Zod schema
// 4. Throw with file path and field name on failure
// 5. Log summary (pass/fail counts, warnings)
```

---

### 4. Slug Generation Strategy

**Task**: Define how route slugs are derived from MDX files

**Decision**: Derive slug from filename (strip `.mdx` extension)

**Rationale**:
- Simple, predictable, editor-friendly
- `demo-mdx.mdx` → `/posts/demo-mdx`
- No frontmatter slug field needed (reduces complexity)
- Duplicate detection: scan all files, build slug map, error if duplicates

**Edge Cases**:
- Files with spaces: recommend kebab-case filenames
- Non-ASCII characters: URL-encode or reject at validation

---

### 5. Component Whitelist Strategy

**Task**: Define how to handle custom MDX components

**Decision**: Explicit component registry in `components/mdx/index.ts`

**Rationale**:
- Meets spec requirement for approved component whitelist
- Unknown components render as escaped text (per edge case in spec)
- Build-time warning logged for unrecognized components
- Easy to extend: add component to registry object

**Implementation**:
```typescript
// components/mdx/index.ts
export const mdxComponents = {
  // Approved components
  Image: CustomImage,
  CodeBlock: CodeBlock,
  // Add more as needed
};
```

---

### 6. Content Directory Structure

**Task**: Confirm directory structure and file organization

**Decision**: Flat structure in `/content/posts/` at monorepo root

**Rationale**:
- Matches FR-003 requirement explicitly
- Simple for editors: single folder, no nested directories
- Demo file: `/content/posts/demo-mdx.mdx`
- Image assets: reference via public directory or external URLs

**Path Resolution**:
- Content path: `path.join(process.cwd(), '../../content/posts')` from `apps/site-shell`
- Or use monorepo root detection for robustness

---

### 7. Performance Considerations

**Task**: Ensure build time constraint (<10% increase) is achievable

**Decision**: Lazy load MDX compilation, minimal dependencies

**Rationale**:
- `next-mdx-remote/rsc` compiles MDX on-demand during static generation
- Gray-matter parsing is sub-millisecond per file
- Zod validation is negligible overhead
- Single demo file = minimal build impact

**Monitoring**:
- Compare build times before/after implementation
- Log individual file processing times if needed

---

## Technology Decisions Summary

| Component | Choice | Package |
|-----------|--------|---------|
| MDX Rendering | Server-side with RSC support | `next-mdx-remote` |
| Frontmatter Parsing | YAML extraction | `gray-matter` |
| Schema Validation | Runtime type checking | `zod` |
| Slug Generation | Filename-based | Built-in (path.basename) |
| Component Registry | Explicit whitelist | Custom module |

## Dependencies to Add

```json
{
  "dependencies": {
    "next-mdx-remote": "^5.0.0",
    "gray-matter": "^4.0.3",
    "zod": "^3.23.0"
  }
}
```

## Open Questions Resolved

All NEEDS CLARIFICATION items from Technical Context have been resolved through this research phase.
