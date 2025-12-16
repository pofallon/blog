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
- 005-build-blog-index: Added TypeScript 5.6+, React 18.3, Next.js 14.2 (App Router) + next-mdx-remote, gray-matter, zod (existing from 003-add-mdx-support)
- 004-preserve-slugs: Added Node.js 18+ / TypeScript 5+ (strict mode per constitution) + gatsby-source-filesystem (existing), transliteration library (e.g., `slugify` or `transliteration`)
- 003-add-mdx-support: Added TypeScript 5.6+ with strict mode enabled + Next.js 14.2, next-mdx-remote, gray-matter (frontmatter parsing), zod (schema validation)


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
