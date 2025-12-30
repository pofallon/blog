# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog built with Next.js 14 (App Router) as a monorepo. The main application lives in `apps/site-shell/` with content stored separately in `content/`.

**Key Technologies:** Next.js 14, TypeScript (strict mode), Tailwind CSS, Shadcn UI (@radix-ui), MDX for blog posts, Jest + Playwright for testing.

## Commands

Run all commands from the root directory:

```bash
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Production build (includes SEO/merch validation)
npm run lint             # ESLint with --max-warnings=0
npm run format           # Prettier formatting
npm test                 # Run Jest tests
npm run test:watch -w apps/site-shell   # Jest watch mode
npm run test:e2e -w apps/site-shell     # Playwright E2E tests
npm run typecheck -w apps/site-shell    # TypeScript check
```

**Blog content commands:**
```bash
npm run slug:preview -- "content/blog/my-post/index.md"  # Preview URL slug
npm run verify-slugs                                      # Verify slug manifest
npm run slug:update-manifest                              # Update manifest after adding posts
```

## Architecture

### Monorepo Structure
- `apps/site-shell/` - Main Next.js application (npm workspace)
- `content/` - Blog posts, images, merchandise data, projects.json
- `specs/` - Architecture decision records (001-011)
- `docs/` - Content authoring guides

### Content Pipeline
Blog posts use folder-based slugs: `content/blog/{slug}/index.md` → `/blog/{slug}`

The MDX pipeline (`lib/mdx/`) handles:
- Frontmatter parsing with Zod validation (`parser.ts`, `validator.ts`)
- Hero image processing with blur placeholders (`image-loader.ts`)
- Component registration for MDX (`blog-post-components.tsx`)

### Key Lib Modules
- `lib/mdx/loader.ts` - Post loading and index generation
- `lib/seo/` - SEO metadata generation
- `lib/merch/` - Merchandise data loading
- `lib/projects/` - Projects data loading
- `lib/design-tokens.ts` - Theming constants

### Component Organization
- `components/ui/` - Shadcn UI primitives
- `components/mdx/` - MDX-specific components (PlaylistEmbed, etc.)
- `components/blog/` - Blog listing and display
- `components/blog-post/` - Individual post rendering

## Important Notes

- **Use npm, not yarn.** Remove `yarn.lock` if it appears.
- Use absolute imports with `@/` prefix for site-shell code.
- Frontmatter requires: `title`, `date` (YYYY-MM-DD format). Optional: `description`, `hero`, `tags`.
- The slug manifest at `specs/004-preserve-slugs/slug-manifest.json` must be updated when adding posts.
