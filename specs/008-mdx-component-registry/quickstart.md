# Quickstart: Custom MDX Component Registry

**Feature**: 008-mdx-component-registry  
**Prerequisites**: Node.js 18+, npm installed, repository cloned

## Quick Verification

```bash
# From repository root
cd /workspaces/blog

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

Open `http://localhost:3000/blog` and verify existing posts render.

---

## Key File Locations

| Purpose | Path |
|---------|------|
| Component Registry | `apps/site-shell/components/mdx/registry/registry.ts` |
| Registry Types | `apps/site-shell/components/mdx/registry/types.ts` |
| PlaylistEmbed Component | `apps/site-shell/components/mdx/registry/PlaylistEmbed/index.tsx` |
| MDX Component Whitelist | `apps/site-shell/components/mdx/index.ts` |
| MDX Renderer | `apps/site-shell/components/mdx/MDXContent.tsx` |
| Blog Post Components | `apps/site-shell/lib/mdx/blog-post-components.tsx` |

---

## Using Registered Components in MDX

### Basic Usage

Authors can use registered components directly in MDX without imports:

```mdx
---
title: "My Post with Playlist"
date: 2025-12-17
description: "A post featuring an embedded playlist"
---

Here's a playlist from re:Invent 2019:

<PlaylistEmbed playlistId="PL2yQDdvlhXf8d-EXLaKIt-naTcllN5Gzt" />

Continue with regular markdown content...
```

### Available Props

```mdx
<PlaylistEmbed
  playlistId="PL..."   {/* Required: YouTube playlist ID */}
  title="My Playlist"  {/* Optional: iframe title for accessibility */}
  height={500}         {/* Optional: embed height (200-800px) */}
  showTitle={true}     {/* Optional: show playlist title */}
  autoplay={false}     {/* Optional: autoplay first video */}
/>
```

---

## Testing Component Registration

### Unit Test (Jest)

```typescript
// apps/site-shell/tests/unit/registry.test.tsx
import { registry, getComponent } from '@/components/mdx/registry/registry';

describe('Component Registry', () => {
  it('should have PlaylistEmbed registered', () => {
    expect(registry.has('PlaylistEmbed')).toBe(true);
  });

  it('should return component for valid name', () => {
    const entry = getComponent('PlaylistEmbed');
    expect(entry).toBeDefined();
    expect(entry?.name).toBe('PlaylistEmbed');
  });

  it('should return undefined for unknown component', () => {
    const entry = getComponent('UnknownComponent');
    expect(entry).toBeUndefined();
  });
});
```

Run tests:
```bash
npm run test -- --testPathPattern=registry
```

### E2E Test (Playwright)

```typescript
// apps/site-shell/tests/e2e/mdx-components.spec.ts
import { test, expect } from '@playwright/test';

test('PlaylistEmbed renders in blog post', async ({ page }) => {
  // Navigate to a post with PlaylistEmbed
  await page.goto('/blog/test-playlist-post');
  
  // Verify iframe embed is present
  const iframe = page.locator('iframe[src*="youtube.com/embed"]');
  await expect(iframe).toBeVisible();
});

test('Unknown component shows fallback', async ({ page }) => {
  await page.goto('/blog/test-unknown-component');
  
  // Check console for warning (requires page.on('console'))
  // Or verify fallback placeholder renders
});
```

Run E2E tests:
```bash
npm run test:e2e -- --grep "PlaylistEmbed"
```

---

## Adding a New Component to the Registry

### 1. Create Component

```typescript
// apps/site-shell/components/mdx/registry/MyComponent/index.tsx
import { z } from 'zod';

export const MyComponentPropsSchema = z.object({
  message: z.string(),
  variant: z.enum(['info', 'warning']).default('info'),
});

export type MyComponentProps = z.infer<typeof MyComponentPropsSchema>;

export function MyComponent({ message, variant = 'info' }: MyComponentProps) {
  return (
    <div className={`my-component my-component--${variant}`}>
      {message}
    </div>
  );
}
```

### 2. Register Component

```typescript
// apps/site-shell/components/mdx/registry/registry.ts
import { MyComponent, MyComponentPropsSchema } from './MyComponent';
import type { RegistryEntry } from './types';

const myComponentEntry: RegistryEntry<MyComponentProps> = {
  name: 'MyComponent',
  version: '1.0.0',
  description: 'Displays a styled message box',
  component: MyComponent,
  propsSchema: MyComponentPropsSchema,
  requiredProps: ['message'],
  optionalProps: ['variant'],
  defaultProps: { variant: 'info' },
  dependencies: [],
  examples: [
    {
      title: 'Basic',
      code: '<MyComponent message="Hello World" />',
    },
  ],
  deprecated: false,
};

registry.set('MyComponent', myComponentEntry);
```

### 3. Export from Index

```typescript
// apps/site-shell/components/mdx/index.ts
export { registry, getComponent, registeredComponents } from './registry/registry';
```

### 4. Test in MDX

Create a test post:
```mdx
---
title: "Testing MyComponent"
date: 2025-12-17
description: "Testing new component"
---

<MyComponent message="This is a test" variant="warning" />
```

---

## Environment Variables

### Optional: YouTube API Key

For enhanced playlist metadata (thumbnails, titles, durations):

```bash
# .env.local (development)
YOUTUBE_API_KEY=AIza...your-key-here

# AWS Amplify (production)
# Set via Amplify Console > App settings > Environment variables
```

**Without API key**: PlaylistEmbed renders basic YouTube iframe embed (fully functional).

**With API key**: PlaylistEmbed shows enhanced metadata (thumbnails, video count, etc.).

---

## Build Verification

```bash
# Run type checking
npm run typecheck

# Run linting
npm run lint

# Run full build
npm run build
```

Expected output for build:
```
📄 MDX Build Summary:
   Total files: XX
   Valid: XX
   Invalid: 0
   Warnings: X
```

---

## Troubleshooting

### "Unrecognized MDX component" Warning

**Symptom**: Console shows `⚠️ Unrecognized MDX component: <ComponentName>`

**Cause**: Component not registered in registry or not exported from `mdx/index.ts`

**Fix**: 
1. Verify component is in `registry.ts`
2. Verify export in `components/mdx/index.ts`
3. Restart dev server

### PlaylistEmbed Shows Fallback

**Symptom**: Placeholder message instead of YouTube embed

**Cause**: Invalid playlist ID or network issue

**Fix**:
1. Verify playlist ID starts with "PL" and is valid
2. Check browser console for errors
3. Test URL directly: `https://www.youtube.com/playlist?list=PL...`

### Build Fails on MDX Content

**Symptom**: Build error mentioning MDX or component

**Cause**: Syntax error in MDX or invalid props

**Fix**:
1. Check MDX file for unclosed tags
2. Verify prop types match schema
3. Check build logs for specific file/line
