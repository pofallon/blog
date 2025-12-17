# Quickstart: Blog Post Page Route

**Feature**: 006-blog-post-route  
**Date**: 2025-12-17

## Prerequisites

- Node.js 18+ LTS
- Existing blog content in `content/blog/{slug}/index.md`
- Completed specs: 004-preserve-slugs, 005-build-blog-index

## Quick Implementation Steps

### 1. Create Dynamic Route

```bash
mkdir -p src/app/blog/\[slug\]
touch src/app/blog/\[slug\]/page.tsx
```

### 2. Basic Page Structure

```typescript
// src/app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPostSlugs, transformToPageModel } from '@/lib/mdx/loader';
import { BlogPostHeader } from '@/components/blog-post/BlogPostHeader';
import { BlogPostBody } from '@/components/blog-post/BlogPostBody';
import { BlogPostNav } from '@/components/blog-post/BlogPostNav';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const doc = await getPostBySlug(params.slug);
  if (!doc) return { title: 'Not Found' };
  
  return {
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    alternates: {
      canonical: `https://get2know.io/blog/${params.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const doc = await getPostBySlug(params.slug);
  if (!doc) notFound();
  
  const post = await transformToPageModel(doc);
  
  return (
    <article className="prose md:prose-lg">
      <BlogPostHeader
        title={post.title}
        date={post.formattedDate}
        description={post.description}
        heroImage={post.heroImage}
      />
      <BlogPostBody content={post.compiledContent} />
      <BlogPostNav />
    </article>
  );
}
```

### 3. Create Loader Functions

```typescript
// src/lib/mdx/loader.ts
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';

const CONTENT_DIR = path.join(process.cwd(), 'content/blog');

export async function getPostBySlug(slug: string) {
  const postDir = path.join(CONTENT_DIR, slug);
  const indexPath = path.join(postDir, 'index.md');
  
  try {
    const content = await fs.readFile(indexPath, 'utf-8');
    const { data, content: body } = matter(content);
    
    return {
      slug,
      content: body,
      frontmatter: {
        title: data.title || 'Untitled Post',
        date: data.date || 'Unknown Date',
        description: data.description,
        image: data.image,
      },
      filePath: indexPath,
    };
  } catch {
    return null;
  }
}

export async function getAllPostSlugs() {
  const entries = await fs.readdir(CONTENT_DIR, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name);
}

export async function transformToPageModel(doc) {
  const date = new Date(doc.frontmatter.date);
  const formattedDate = isNaN(date.getTime())
    ? doc.frontmatter.date
    : date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

  const compiledContent = await serialize(doc.content);

  return {
    slug: doc.slug,
    title: doc.frontmatter.title,
    formattedDate,
    rawDate: doc.frontmatter.date,
    description: doc.frontmatter.description || '',
    canonicalUrl: `https://get2know.io/blog/${doc.slug}`,
    compiledContent,
    heroImage: null, // Implement image processing as needed
  };
}
```

### 4. Add URL Normalization Middleware

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Only handle /blog/* routes
  if (!pathname.startsWith('/blog/')) return;
  
  // Normalize: lowercase, no trailing slash
  const normalized = pathname.toLowerCase().replace(/\/$/, '');
  
  if (pathname !== normalized) {
    const url = request.nextUrl.clone();
    url.pathname = normalized;
    return NextResponse.redirect(url, 301);
  }
}

export const config = {
  matcher: '/blog/:path*',
};
```

### 5. Create Not Found Handler

```typescript
// src/app/blog/[slug]/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-center py-12">
      <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
      <p className="mb-6">The blog post you're looking for doesn't exist.</p>
      <Link href="/blog" className="text-blue-600 hover:underline">
        ← Back to Blog
      </Link>
    </div>
  );
}
```

## Verification

```bash
# Build to verify static generation
npm run build

# Check a valid slug loads
curl -I http://localhost:3000/blog/playlist-reinvent-2019

# Check 404 handling
curl -I http://localhost:3000/blog/nonexistent-post

# Check redirect (uppercase → lowercase)
curl -I http://localhost:3000/blog/Playlist-Reinvent-2019
```

## Key Files

| File | Purpose |
|------|---------|
| `src/app/blog/[slug]/page.tsx` | Dynamic route page component |
| `src/app/blog/[slug]/not-found.tsx` | 404 handler for missing posts |
| `src/lib/mdx/loader.ts` | Content loading utilities |
| `src/middleware.ts` | URL normalization redirects |
| `src/components/blog-post/*.tsx` | Post rendering components |

## Dependencies

```bash
npm install next-mdx-remote gray-matter
```

## Success Criteria Checklist

- [ ] Valid slugs return 200 with post content
- [ ] Invalid slugs return 404 with navigation to /blog
- [ ] Non-canonical URLs redirect 301 to canonical
- [ ] Title, date, description display correctly
- [ ] MDX content renders with component mappings
- [ ] SEO metadata exposed in page head
