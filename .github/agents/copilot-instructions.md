# blog Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-12-15

## Active Technologies
- TypeScript 5.x (strict) on Next.js 14 App Router + Next.js 14, React 18, Tailwind CSS 3.x, PostCSS, ESLint, Prettier (002-nextjs-app-shell)
- N/A (static shell, no data layer yet) (002-nextjs-app-shell)
- TypeScript 5.6+ with strict mode enabled + Next.js 14.2, next-mdx-remote, gray-matter (frontmatter parsing), zod (schema validation) (003-add-mdx-support)
- Filesystem (`/content/posts/` flat directory structure) (003-add-mdx-support)
- Node.js 18+ / TypeScript 5+ (strict mode per constitution) + gatsby-source-filesystem (existing), transliteration library (e.g., `slugify` or `transliteration`) (004-preserve-slugs)
- JSON file for slug manifest (`specs/004-preserve-slugs/slug-manifest.json`) (004-preserve-slugs)
- TypeScript 5.6+, React 18.3, Next.js 14.2 (App Router) + next-mdx-remote, gray-matter, zod (existing from 003-add-mdx-support) (005-build-blog-index)
- File-based MDX content in `/content/posts/` (existing) (005-build-blog-index)
- TypeScript 5.9+ (strict mode), React 18+, Next.js 14+ (App Router) + next-mdx-remote, existing slug library (`src/lib/slug`), Tailwind CSS (006-blog-post-route)
- File-based MDX content in `content/blog/` directory (006-blog-post-route)
- TypeScript 5.6+ with strict mode + Next.js 14.2+, next/image, next-mdx-remote 5.0, gray-matter, zod (007-add-image-handling)
- Local filesystem in `content/images/<post-slug>/` directories (007-add-image-handling)
- TypeScript 5.6+, React 18.3, Next.js 14.2 + next-mdx-remote 5.0, gray-matter 4.0, zod 4.2 (008-mdx-component-registry)
- N/A (registry is code-based; credentials via environment variables) (008-mdx-component-registry)
- TypeScript 5+ with strict mode + Next.js 14+ (App Router), next-mdx-remote, gray-matter (009-seo-metadata)
- File-based (MDX frontmatter in `content/blog/`) (009-seo-metadata)

- Markdown runbooks + AWS Amplify CLI ≥ 12.10 / AWS CLI v2.15 (Node.js 18 LTS) + AWS Amplify Console, AWS CLI Amplify service commands (`update-branch`, `create-branch`, `list-branches`), GitHub branch protection + Actions alerts (001-pause-amplify-builds)

## Project Structure

```text
src/
tests/
```

## Commands

# Add commands for Markdown runbooks + AWS Amplify CLI ≥ 12.10 / AWS CLI v2.15 (Node.js 18 LTS)

## Code Style

Markdown runbooks + AWS Amplify CLI ≥ 12.10 / AWS CLI v2.15 (Node.js 18 LTS): Follow standard conventions

## Recent Changes
- 009-seo-metadata: Added TypeScript 5+ with strict mode + Next.js 14+ (App Router), next-mdx-remote, gray-matter
- 008-mdx-component-registry: Added TypeScript 5.6+, React 18.3, Next.js 14.2 + next-mdx-remote 5.0, gray-matter 4.0, zod 4.2
- 007-add-image-handling: Added TypeScript 5.6+ with strict mode + Next.js 14.2+, next/image, next-mdx-remote 5.0, gray-matter, zod


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
