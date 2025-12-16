# Quickstart: Slug Preservation System

**Feature**: 004-preserve-slugs  
**Date**: 2025-12-16

## Overview

The slug preservation system ensures deterministic URL generation for blog posts, maintaining compatibility with existing published URLs while supporting the GatsbyJS → Next.js migration.

## Content Folder Structure

All blog posts must follow this structure:

```
content/blog/
└── {collection}/          # Collection folder (becomes the slug)
    └── index.md           # Required: exactly one markdown file
```

**Example**:
```
content/blog/
├── playlist-reinvent-2019/
│   └── index.md           # URL: /playlist-reinvent-2019/
├── my-first-post/
│   └── index.md           # URL: /my-first-post/
└── getting-started-aws/
    └── index.md           # URL: /getting-started-aws/
```

## Naming Rules

| Rule | Example |
|------|---------|
| Use lowercase | `my-post/` ✓ `My-Post/` ✗ |
| Use hyphens for spaces | `my-first-post/` ✓ `my first post/` ✗ |
| ASCII characters only | `cafe/` ✓ `café/` ✗ |
| No special characters | `my-post/` ✓ `my_post!/` ✗ |

## Quick Commands

### Preview a slug before publishing

```bash
# Generate slug from a path (dry run)
npm run slug:preview -- "content/blog/my-new-post/index.md"
# Output: /my-new-post/
```

### Verify all slugs match manifest

```bash
# Run verification (used in CI/CD)
npm run verify-slugs

# Output on success:
# ✓ Scanned 10 files
# ✓ All slugs match canonical manifest
# Exit code: 0

# Output on failure:
# ✗ Scanned 10 files
# ✗ 2 mismatches detected:
#   - content/blog/old-post/index.md
#     Expected: /old-post/
#     Actual: /renamed-post/
# Exit code: 1
```

### Update manifest (requires explicit approval)

```bash
# Review changes first
npm run verify-slugs

# If intentional changes, update manifest
npm run slug:update-manifest

# Commit updated manifest
git add specs/004-preserve-slugs/slug-manifest.json
git commit -m "chore: update slug manifest for new posts"
```

## Creating a New Post

1. **Create folder** with desired URL slug:
   ```bash
   mkdir -p content/blog/my-new-topic
   ```

2. **Add index.md** with frontmatter:
   ```markdown
   ---
   title: "My New Topic"
   date: 2025-12-16
   description: "A brief description"
   ---
   
   Your content here...
   ```

3. **Preview slug**:
   ```bash
   npm run slug:preview -- "content/blog/my-new-topic/index.md"
   # Output: /my-new-topic/
   ```

4. **Run verification** (new posts show as "new"):
   ```bash
   npm run verify-slugs
   ```

5. **Update manifest** to include new post:
   ```bash
   npm run slug:update-manifest
   ```

## CI/CD Integration

The verification command runs automatically during builds:

```json
// package.json
{
  "scripts": {
    "prebuild": "npm run verify-slugs",
    "build": "gatsby build"
  }
}
```

**Build fails if**:
- Any slug doesn't match the manifest
- Folder structure is invalid (wrong depth, missing index.md)
- Slug collision detected (two posts with same slug)

## Troubleshooting

### "Content structure error: wrong depth"

Your post folder is nested too deeply. Move it to `content/blog/{collection}/index.md`.

```bash
# Wrong
content/blog/2024/january/my-post/index.md

# Correct
content/blog/my-post/index.md
```

### "Content structure error: missing index.md"

Each post folder must contain exactly one `index.md` file.

```bash
# Wrong
content/blog/my-post/
└── post.md

# Correct
content/blog/my-post/
└── index.md
```

### "Slug mismatch detected"

The generated slug doesn't match the canonical manifest. Either:

1. **Unintentional change**: Restore the original folder name
2. **Intentional change**: Update manifest with `npm run slug:update-manifest`

### "Slug collision detected"

Two posts resolve to the same URL. Rename one of the conflicting folders.

```bash
# Conflict example
content/blog/my-post/index.md     # → /my-post/
content/blog/My-Post/index.md     # → /my-post/ (collision!)
```

## File Locations

| File | Purpose |
|------|---------|
| `specs/004-preserve-slugs/slug-manifest.json` | Canonical slug mappings |
| `src/lib/slug/index.ts` | Slug generation function |
| `src/cli/verify-slugs.ts` | Verification CLI tool |
