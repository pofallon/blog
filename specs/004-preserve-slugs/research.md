# Research: Deterministic Slug Preservation

**Feature**: 004-preserve-slugs  
**Date**: 2025-12-16

## Research Tasks

### 1. Gatsby's Current Slug Generation

**Task**: How does Gatsby's `createFilePath` generate slugs from file paths?

**Findings**:
- Gatsby uses `gatsby-source-filesystem` plugin's `createFilePath` helper
- Current implementation in `gatsby-node.js` line 69: `const value = createFilePath({ node, getNode })`
- `createFilePath` derives slug from the file's relative path within its source directory
- For `content/blog/playlist-reinvent-2019/index.md`, the slug becomes `/playlist-reinvent-2019/`
- Pattern: `content/blog/{folder-name}/index.md` → `/{folder-name}/`

**Decision**: Replicate `createFilePath` behavior in new slug function  
**Rationale**: Preserves existing URL structure without breaking changes  
**Alternatives Considered**: 
- Frontmatter-based slugs (rejected: requires content changes)
- Date-prefixed slugs (rejected: differs from current format)

### 2. Transliteration Library Selection

**Task**: Which library best handles non-ASCII character transliteration?

**Findings**:
- `slugify` npm package: Popular, handles Unicode → ASCII, customizable
- `transliteration` npm package: More comprehensive transliteration rules
- `limax` npm package: Specifically designed for URL slugs
- Native approach: Manual regex replacement (less comprehensive)

**Decision**: Use `slugify` package with `strict: true` option  
**Rationale**: Well-maintained, 20M+ weekly downloads, TypeScript types available, handles "café" → "cafe" cases  
**Alternatives Considered**:
- `transliteration` (rejected: more complex API than needed)
- Manual regex (rejected: error-prone for edge cases)

### 3. Manifest Storage Format

**Task**: What format for storing canonical slug mappings?

**Findings**:
- JSON: Simple, human-readable, git-friendly diffs
- YAML: More readable for complex structures
- SQLite: Query capabilities but overkill for this use case
- CSV: Simple but poor for nested data

**Decision**: JSON file at `specs/004-preserve-slugs/slug-manifest.json`  
**Rationale**: Native Node.js parsing, easy git versioning, human-readable for review  
**Alternatives Considered**:
- YAML (rejected: extra dependency)
- Database (rejected: overcomplicated for static list)

### 4. Verification Command Approach

**Task**: How to implement automated slug verification for CI/CD?

**Findings**:
- Node.js script with fs.readdir to enumerate content
- Exit code 0 for success, non-zero for failures
- JSON output for programmatic consumption
- Human-readable summary for console

**Decision**: TypeScript CLI script at `src/cli/verify-slugs.ts`  
**Rationale**: Type-safe, integrates with existing TypeScript migration, outputs both JSON and summary  
**Alternatives Considered**:
- Jest test file (rejected: mixing concerns between unit tests and verification)
- Shell script (rejected: TypeScript consistency per constitution)

### 5. Build Integration Strategy

**Task**: How to integrate validation into Gatsby/Next.js builds?

**Findings**:
- Gatsby: `onPreBuild` lifecycle hook or npm script
- Next.js: prebuild npm script or middleware
- Both: npm `prebuild` script for cross-platform compatibility

**Decision**: npm `verify-slugs` script, called in `prebuild`  
**Rationale**: Framework-agnostic, works for both Gatsby and future Next.js  
**Alternatives Considered**:
- Gatsby-specific plugin (rejected: not portable to Next.js)
- Git pre-commit hook (rejected: doesn't block builds)

### 6. Content Structure Validation

**Task**: How to validate `{collection}/{post}/index.md` structure?

**Findings**:
- Regex pattern matching on relative paths
- Maximum depth check (exactly 2 levels: collection/post)
- File existence check (exactly one index.md per folder)

**Decision**: Validation integrated into slug function with explicit error messages  
**Rationale**: Fail fast with actionable errors per FR-007  
**Alternatives Considered**:
- Separate validation step (rejected: validation and slug generation should be atomic)

## Summary

All NEEDS CLARIFICATION items resolved:
- Slug algorithm: Replicate `createFilePath` behavior
- Transliteration: Use `slugify` package
- Manifest format: JSON in specs directory
- Verification: TypeScript CLI with exit codes
- Build integration: npm prebuild script
- Structure validation: Integrated in slug function
