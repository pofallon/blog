# Content Folder Structure

This document describes how to organize blog content for deterministic URL generation.

## Directory Structure

All blog posts must follow this structure:

```
content/blog/
└── {collection}/          # Collection folder (becomes the URL slug)
    └── index.md           # Required: exactly one markdown file
```

### Example

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

| Rule                    | Good Example        | Bad Example        |
| ----------------------- | ------------------- | ------------------ |
| Use lowercase           | `my-post/`          | `My-Post/`         |
| Use hyphens for spaces  | `my-first-post/`    | `my first post/`   |
| ASCII characters only   | `cafe/`             | `café/`            |
| No special characters   | `my-post/`          | `my_post!/`        |
| No numbers at start     | `post-2024/`        | `2024-post/` (ok but avoid) |

## How Slugs Are Generated

The URL slug is derived directly from the collection folder name:

1. The folder name is converted to lowercase
2. Spaces are replaced with hyphens
3. Non-ASCII characters are transliterated (e.g., `é` → `e`)
4. Special characters are removed
5. Consecutive hyphens are collapsed
6. Leading/trailing hyphens are trimmed

### Examples

| Folder Name           | Generated Slug        |
| --------------------- | --------------------- |
| `my-post`             | `/my-post/`           |
| `My-Post`             | `/my-post/`           |
| `My First Post`       | `/my-first-post/`     |
| `café-guide`          | `/cafe-guide/`        |
| `post--with--hyphens` | `/post-with-hyphens/` |

## Commands

### Preview a Slug

Before creating a post, preview what the URL will be:

```bash
npm run slug:preview -- "content/blog/my-new-post/index.md"
# Output: /my-new-post/
```

### Verify All Slugs

Check that all content files match the canonical manifest:

```bash
npm run verify-slugs
```

### Update Manifest

When you intentionally add or rename posts, update the manifest:

```bash
npm run slug:update-manifest
```

Then commit the updated manifest file.

## Creating a New Post

1. **Create the collection folder**:
   ```bash
   mkdir -p content/blog/my-new-topic
   ```

2. **Create index.md with frontmatter**:
   ```markdown
   ---
   title: "My New Topic"
   date: 2025-01-15
   description: "A brief description of the post"
   ---

   Your content here...
   ```

3. **Preview the slug** (optional):
   ```bash
   npm run slug:preview -- "content/blog/my-new-topic/index.md"
   ```

4. **Update the manifest**:
   ```bash
   npm run slug:update-manifest
   ```

5. **Commit your changes**:
   ```bash
   git add content/blog/my-new-topic/
   git add specs/004-preserve-slugs/slug-manifest.json
   git commit -m "feat: add my-new-topic post"
   ```

## CI/CD Integration

The `verify-slugs` command runs automatically before builds:

- Build fails if any slug doesn't match the manifest
- Build fails if folder structure is invalid
- Build fails if slug collision is detected (two posts with same slug)

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
# Collision example
content/blog/my-post/index.md     # → /my-post/
content/blog/My-Post/index.md     # → /my-post/ (collision!)
```
