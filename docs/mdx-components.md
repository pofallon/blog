# MDX Component Registry

This document describes the available MDX components for use in blog posts.

## Overview

The MDX Component Registry provides a curated set of React components that content authors can use directly in MDX files without importing. All components are validated at build time with helpful error messages.

## Available Components

### PlaylistEmbed

Embeds a YouTube playlist with play controls and track list. Mirrors the existing playlist-style embed functionality.

**Version**: 1.0.0

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `playlistId` | `string` | Yes | — | YouTube playlist ID (must start with "PL") |
| `title` | `string` | No | `"YouTube Playlist"` | Accessible title for iframe |
| `height` | `number` | No | `400` | Embed height in pixels (200-800) |
| `showTitle` | `boolean` | No | `true` | Whether to display playlist title |
| `autoplay` | `boolean` | No | `false` | Whether to autoplay first video |

#### Examples

**Basic Usage**

```mdx
<PlaylistEmbed playlistId="PL2yQDdvlhXf8d-EXLaKIt-naTcllN5Gzt" />
```

Embed a YouTube playlist with default settings.

**Custom Height**

```mdx
<PlaylistEmbed playlistId="PL2yQDdvlhXf8d-EXLaKIt-naTcllN5Gzt" height={600} />
```

Embed with a taller height for better visibility.

**Autoplay Disabled Title**

```mdx
<PlaylistEmbed playlistId="PL2yQDdvlhXf8d-EXLaKIt-naTcllN5Gzt" showTitle={false} autoplay />
```

Start playing automatically without showing the title.

#### Enhanced Features

When a `YOUTUBE_API_KEY` environment variable is configured, PlaylistEmbed displays:
- Playlist thumbnail
- Video count
- Channel name
- Playlist description

Without the API key, the basic YouTube embed is still fully functional.

---

## Adding New Components

To add a new component to the registry:

1. Create the component in `apps/site-shell/components/mdx/registry/YourComponent/`
2. Define a Zod schema for prop validation
3. Register it in `apps/site-shell/components/mdx/registry/registry.ts`
4. Update this documentation

See [quickstart.md](../specs/008-mdx-component-registry/quickstart.md) for detailed instructions.

---

## Troubleshooting

### "Unrecognized MDX component" Warning

**Cause**: Component not registered in the registry.

**Fix**: Ensure the component is registered in `registry.ts` and exported correctly.

### PlaylistEmbed Shows Fallback

**Cause**: Invalid playlist ID or validation error.

**Fix**: Verify the playlist ID starts with "PL" and is a valid YouTube playlist ID.

### Build Fails on MDX Content

**Cause**: Syntax error or invalid props in MDX file.

**Fix**: Check the build logs for the specific file and line number, then verify the component props match the schema.
