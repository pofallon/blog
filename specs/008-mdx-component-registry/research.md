# Research: Custom MDX Component Registry

**Feature**: 008-mdx-component-registry  
**Date**: 2025-12-17  
**Status**: Complete

## Research Questions

### RQ-1: How should the component registry be structured?

**Decision**: Code-based registry using a TypeScript Map with component metadata.

**Rationale**: The existing codebase already has `mdxComponents` in `components/mdx/index.ts` which uses a simple object mapping. Extending this with a typed registry that includes metadata (description, props schema, version) provides:
- Type safety at build time
- Self-documenting component catalog
- Validation hooks for prop checking
- Future extensibility for governance

**Alternatives Considered**:
1. **JSON/YAML configuration file**: Rejected—loses TypeScript type checking and requires additional build step for validation.
2. **Database-backed registry**: Rejected—over-engineering for ~30 posts; adds operational complexity.
3. **Dynamic imports**: Rejected—complicates SSR and loses static analysis benefits.

---

### RQ-2: How does next-mdx-remote integrate with custom components?

**Decision**: Pass components via the `components` prop to `MDXRemote`.

**Rationale**: The existing `MDXContent.tsx` already implements this pattern with a Proxy wrapper for unknown component handling. The registry extends this by:
1. Exporting registered components from `components/mdx/registry/registry.ts`
2. Merging registry exports with HTML element overrides in `blog-post-components.tsx`
3. Maintaining the Proxy pattern for graceful fallback on unregistered components

**Pattern from Codebase** (MDXContent.tsx:18-35):
```typescript
const componentProxy = new Proxy(mdxComponents, {
  get(target, prop) {
    if (typeof prop === 'string' && prop in target) {
      return target[prop];
    }
    // Log warning for unrecognized components
    if (typeof prop === 'string') {
      const firstChar = prop.charAt(0);
      if (firstChar && firstChar === firstChar.toUpperCase()) {
        console.warn(`⚠️  Unrecognized MDX component: <${prop}>.`);
      }
    }
    return undefined;
  },
});
```

---

### RQ-3: What is the existing playlist implementation and how do we achieve parity?

**Decision**: Create `PlaylistEmbed` component that accepts YouTube playlist IDs and renders an embedded player.

**Rationale**: The existing content (`content/blog/playlist-reinvent-2019/index.md`) shows:
- Frontmatter defines playlists array: `playlists: [{ name: alexa, id: PL2yQDdvlhXf8d-EXLaKIt-naTcllN5Gzt }, ...]`
- Content uses `ReinventProcessor` and `Playlist` components accessing `props.playlists`
- The Gatsby plugin `gatsby-transformer-playlists` fetched YouTube metadata

**Parity Strategy**:
1. `PlaylistEmbed` accepts `playlistId` prop directly (simplifies usage)
2. Renders YouTube iframe embed for core functionality (no API key required)
3. Optional YouTube Data API integration for enhanced metadata (requires API key)
4. Falls back to basic embed when API key missing

**Current Placeholder** (blog-post-components.tsx:120):
```typescript
Playlist: PlaceholderComponent,
```

---

### RQ-4: How should optional credentials be handled?

**Decision**: Environment variables with graceful degradation pattern.

**Rationale**: Per FR-007, credentials must never break builds. Implementation:
1. Read credentials via `process.env.YOUTUBE_API_KEY` (build-time) or runtime env
2. Component checks credential availability at render time
3. Missing credentials → render basic YouTube embed without enhanced metadata
4. Invalid credentials → log structured error, render basic embed

**Environment Variable Pattern**:
```typescript
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

function PlaylistEmbed({ playlistId }: PlaylistEmbedProps) {
  const hasEnhancedFeatures = Boolean(YOUTUBE_API_KEY);
  
  if (!hasEnhancedFeatures) {
    return <YouTubeEmbed playlistId={playlistId} />;
  }
  
  // Enhanced rendering with metadata...
}
```

**Logging Pattern** (per FR-006):
```typescript
console.warn(JSON.stringify({
  component: 'registry',
  severity: 'warning',
  message: 'YouTube API key not configured',
  feature: 'enhanced-metadata',
}));
```

---

### RQ-5: What validation should occur at build time vs runtime?

**Decision**: Build-time validation for component registration; runtime validation for props and credentials.

**Rationale**:
- **Build-time**: The Proxy handler in MDXContent.tsx already logs unknown components. Extend with structured logging for governance tracking (FR-009).
- **Runtime**: Prop validation via Zod schemas. Invalid props → use defaults + log warning.

**Validation Layers**:
| Layer | What | When | Action on Failure |
|-------|------|------|-------------------|
| Registry | Component exists | Build/render | Warning + fallback placeholder |
| Props | Required props present | Render | Use defaults + log |
| Props | Prop types valid | Render | Use defaults + log |
| Credentials | API key format | Runtime init | Disable enhanced features + log |
| Credentials | API key valid | API call | Disable enhanced features + log |

---

### RQ-6: How should the registry documentation be exposed to authors?

**Decision**: Generate `docs/mdx-components.md` from registry metadata.

**Rationale**: Per FR-008, documentation must be discoverable. Options:
1. **Manual docs**: Error-prone, drifts from code
2. **Inline comments**: Not visible to non-developers
3. **Generated docs**: Single source of truth from registry metadata

**Implementation**:
- Registry entries include `description`, `props`, `examples`
- Build script generates markdown from registry
- Output to `docs/mdx-components.md` (existing docs location)

---

### RQ-7: What analytics should be captured for governance (FR-009)?

**Decision**: Log component usage at build time; defer dashboard to post-MVP.

**Rationale**: The spec requires "counts of posts using it and build-time validation incidents." Implementation:
1. During build, MDX parser logs each registered component reference
2. Structured log format allows filtering: `{ component: 'PlaylistEmbed', post: 'slug', event: 'usage' }`
3. Validation incidents logged with severity levels

**Deferred**: Dedicated analytics dashboard—use existing log aggregation initially.

---

## Technology Decisions

### next-mdx-remote Usage

**Decision**: Continue using `next-mdx-remote/rsc` for Server Component compatibility.

**Configuration**:
- Components passed via `components` prop
- Scope for accessing frontmatter data (playlists) via `scope` prop
- Existing serialize() call in `blog-post-loader.ts:260` handles compilation

### Zod for Prop Validation

**Decision**: Use existing Zod 4.2 dependency for prop schema validation.

**Rationale**: Already used for frontmatter validation in `validator.ts`. Consistent patterns.

### YouTube Embed Strategy

**Decision**: Client-side iframe embed for core functionality; optional server-side metadata fetch.

**Rationale**:
- Iframe embeds are stateless, require no API key
- YouTube Data API requires key, provides metadata (title, thumbnail, duration)
- Progressive enhancement: basic → enhanced based on credentials

---

## Dependencies Analysis

### Existing Dependencies (No Changes)

| Package | Version | Usage |
|---------|---------|-------|
| next-mdx-remote | ^5.0.0 | MDX rendering |
| gray-matter | ^4.0.2 | Frontmatter parsing |
| zod | ^4.2.0 | Validation schemas |
| react | 18.3.1 | Component rendering |

### New Dependencies (Evaluation)

| Package | Version | Usage | Decision |
|---------|---------|-------|----------|
| None required | — | — | YouTube embeds are native iframes |

**Note**: YouTube Data API is a REST endpoint, no client library needed. Use native fetch.

---

## Risk Mitigation

### Performance Impact (Risk #2)

**Mitigation Strategy**:
1. YouTube iframes are lazy-loaded (`loading="lazy"`)
2. Facade pattern: show thumbnail, load iframe on interaction
3. Measure LCP impact with Lighthouse during implementation
4. If LCP increase >500ms, implement lite-youtube-embed pattern

### Credential Handling (Risk #3)

**Mitigation Strategy**:
1. Never commit credentials to source
2. Environment variables only via AWS Amplify environment config
3. Validation at startup logs credential status (present/missing, never value)
4. Fallback to basic embed is automatic and silent to users

---

## Open Items Resolved

| Item | Resolution |
|------|------------|
| Registry structure | Code-based TypeScript Map with metadata |
| Playlist parity | YouTube iframe embed + optional API enhancement |
| Credential handling | Environment variables with graceful degradation |
| Validation timing | Build-time for registration; runtime for props/credentials |
| Documentation | Generated from registry metadata |
