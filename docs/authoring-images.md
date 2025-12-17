# Authoring Images for Blog Posts

This guide explains how to add images to your blog posts using the enhanced image handling system.

## Quick Start

1. **Create an image directory** for your post:
   ```
   content/images/<your-post-slug>/
   ```

2. **Add images** to that directory:
   ```
   content/images/my-post/hero.jpg
   content/images/my-post/screenshot.png
   ```

3. **Reference in your post** (see sections below)

---

## Hero Images

Hero images appear at the top of your blog post, above the content.

### Adding a Hero Image

Add the `hero` field to your post's frontmatter:

```yaml
---
title: "My Post Title"
date: "2025-12-17"
hero:
  src: "hero.jpg"
  alt: "A descriptive alt text for accessibility"
  caption: "Photo credit: Jane Doe"      # optional
  focalPoint: "center top"               # optional
---
```

### Hero Image Fields

| Field | Required | Description |
|-------|----------|-------------|
| `src` | Yes | Filename in `content/images/<slug>/` |
| `alt` | Yes | Accessibility description (screen readers) |
| `caption` | No | Credit/caption shown below image |
| `focalPoint` | No | CSS object-position for cropping (default: `center`) |

### Focal Point Values

Common values: `center`, `top`, `bottom`, `left`, `right`, `center top`, `center bottom`, etc.

---

## Inline Images

Use the `<Image>` component in your MDX content for inline images.

### Basic Usage

```mdx
<Image src="screenshot.png" alt="Dashboard view" />
```

### With Caption

```mdx
<Image 
  src="diagram.png" 
  alt="Architecture diagram" 
  caption="System architecture overview" 
/>
```

### Image Component Props

| Prop | Required | Description |
|------|----------|-------------|
| `src` | Yes | Filename in `content/images/<slug>/` |
| `alt` | Yes | Accessibility description |
| `caption` | No | Caption displayed below image |
| `width` | No | Override width (auto-detected) |
| `height` | No | Override height (auto-detected) |

---

## Directory Structure

```
content/
├── images/
│   └── my-post-slug/           # Must match your post's slug
│       ├── hero.jpg            # Hero image (any name works)
│       ├── screenshot-1.png    # Inline images
│       └── diagram.svg
└── blog/
    └── my-post-slug/
        └── index.mdx           # Your post content
```

**Important**: The image directory name must exactly match your post's slug (the folder name under `content/blog/`).

---

## Image Guidelines

### Recommended Formats

| Format | Best For |
|--------|----------|
| WebP | Photos (best compression) |
| JPEG | Photos (universal support) |
| PNG | Screenshots, transparency |
| SVG | Diagrams, icons |
| GIF | Simple animations |

### Size Recommendations

- **Hero images**: 1920×1080px or larger
- **Inline images**: 1200px wide max
- **File size**: Under 500KB (build warns if larger)

### Performance Tips

1. **Optimize before uploading**: Use tools like TinyPNG or Squoosh
2. **Use WebP when possible**: Better compression than JPEG
3. **Right-size images**: Don't use 4K images if 1920px is sufficient
4. **Provide alt text**: Always include meaningful descriptions

---

## Troubleshooting

### "Image file not found" error

- Verify the image exists in `content/images/<post-slug>/`
- Check that filenames are case-sensitive exact matches
- Ensure the slug matches your post directory name

### "Missing alt text" warning

- Add the `alt` attribute to your `<Image>` component
- Add the `alt` field to your `hero` frontmatter
- Empty alt is allowed for decorative images

### Image not appearing

1. Restart dev server after adding new images
2. Check browser console for 404 errors
3. Verify the path is relative (no leading `/`)

### Build takes too long

- Large images are resized automatically, but start with optimized files
- Consider using WebP format for photos

---

## Examples

### Complete Post with Hero

```yaml
---
title: "Building a Modern Blog"
date: "2025-12-17"
description: "A guide to building blogs with Next.js"
hero:
  src: "hero-banner.jpg"
  alt: "Code on a laptop screen"
  caption: "Photo by Unsplash"
  focalPoint: "center"
---

Your post content starts here...
```

### Multiple Inline Images

```mdx
## Introduction

Here's our starting point:

<Image src="before.png" alt="Before screenshot" caption="Initial state" />

After making changes:

<Image src="after.png" alt="After screenshot" caption="Final result" />
```

---

## Need Help?

- Check the spec: `/specs/007-add-image-handling/spec.md`
- Review quickstart: `/specs/007-add-image-handling/quickstart.md`
