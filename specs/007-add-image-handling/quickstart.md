# Quickstart: Blog Image Handling

**Feature**: 007-add-image-handling  
**Audience**: Content authors and developers

## For Content Authors

### Adding a Hero Image

1. **Create the image directory** for your post:
   ```
   content/images/<your-post-slug>/
   ```

2. **Add your hero image** to the directory:
   ```
   content/images/my-new-post/hero.jpg
   ```

3. **Reference it in frontmatter**:
   ```yaml
   ---
   title: "My New Post"
   date: "2025-12-17"
   description: "A post with a hero image"
   hero:
     src: "hero.jpg"
     alt: "A descriptive alt text for accessibility"
     caption: "Photo credit: Jane Doe"
   ---
   ```

4. **Preview locally**:
   ```bash
   npm run dev
   ```

### Adding Inline Images

1. **Place images** in your post's image directory:
   ```
   content/images/my-new-post/screenshot.png
   content/images/my-new-post/diagram.svg
   ```

2. **Use the Image component** in your MDX:
   ```mdx
   Here's a screenshot of the dashboard:

   <Image src="screenshot.png" alt="Dashboard showing key metrics" caption="The new analytics dashboard" />

   And here's the architecture diagram:

   <Image src="diagram.svg" alt="System architecture diagram" />
   ```

### Image Guidelines

| Aspect | Recommendation |
|--------|----------------|
| **Format** | WebP or JPEG for photos, PNG for screenshots, SVG for diagrams |
| **Max dimensions** | 1920×1080 for hero, 1200px wide for inline |
| **Max file size** | Under 500KB (larger files trigger build warning) |
| **Alt text** | Always provide descriptive alt text for accessibility |

### Troubleshooting

**"Image file not found" error**
- Check the path matches exactly (case-sensitive)
- Ensure image is in `content/images/<post-slug>/`
- Verify post slug matches directory name

**"Missing alt text" warning**
- Add `alt` attribute to hero frontmatter or Image component
- Empty alt is allowed for decorative images

**Image not showing locally**
- Restart dev server after adding new images
- Check browser console for 404 errors

## For Developers

### Quick Setup

```bash
# Dependencies already installed
npm install  # if fresh clone

# Start dev server
npm run dev
```

### Key Files

| File | Purpose |
|------|---------|
| `components/blog/HeroImage.tsx` | Hero image component |
| `components/blog/OptimizedImage.tsx` | MDX inline image component |
| `lib/mdx/image-loader.ts` | Image loading and validation |
| `lib/mdx/image-types.ts` | TypeScript definitions |
| `lib/mdx/image-schemas.ts` | Zod validation schemas |

### Adding Image Support to a Post Page

```typescript
// app/blog/[slug]/page.tsx
import { HeroImage } from '@/components/blog/HeroImage';
import { loadHeroImage } from '@/lib/mdx/image-loader';

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await loadBlogPost(slug);
  const heroImage = await loadHeroImage(slug, post.frontmatter.hero);

  return (
    <article>
      <HeroImage image={heroImage} postTitle={post.frontmatter.title} />
      {/* ... rest of post */}
    </article>
  );
}
```

### Registering MDX Components

```typescript
// lib/mdx/blog-post-components.tsx
import { OptimizedImage } from '@/components/blog/OptimizedImage';

export const mdxComponents = {
  // ... existing components
  Image: OptimizedImage,
};
```

### Running Tests

```bash
# Unit tests
npm test

# E2E tests (includes image rendering)
npm run test:e2e
```

### Build Validation

Image validation runs automatically during build:

```bash
npm run build

# Sample output:
# ✓ Compiled successfully
# ⚠ Warning: Missing alt text for image: content/images/demo/hero.jpg
# ✓ 12 posts processed, 24 images validated
```

## Directory Structure Reference

```
content/
├── images/
│   └── <post-slug>/          # One directory per post
│       ├── hero.jpg          # Hero image (optional)
│       ├── screenshot-1.png  # Inline images
│       └── diagram.svg
└── posts/
    └── <post-slug>.mdx       # Post content

apps/site-shell/
├── components/blog/
│   ├── HeroImage.tsx         # Hero component
│   └── OptimizedImage.tsx    # Inline component
└── lib/mdx/
    ├── image-loader.ts       # Loading logic
    ├── image-types.ts        # Type definitions
    └── image-schemas.ts      # Validation schemas
```
