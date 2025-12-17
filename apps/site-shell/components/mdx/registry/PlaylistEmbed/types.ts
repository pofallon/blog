/**
 * PlaylistEmbed Component Types
 * @see /specs/008-mdx-component-registry/contracts/playlist-embed.ts
 */

import { z } from 'zod';

// ============================================================================
// Props Schema
// ============================================================================

/**
 * PlaylistEmbed Props Schema
 * Validates and provides defaults for PlaylistEmbed component props.
 * @see FR-004: PlaylistEmbed component with playlist-style embed parity
 */
export const PlaylistEmbedPropsSchema = z.object({
  /** YouTube playlist ID (required) - must start with "PL" */
  playlistId: z
    .string()
    .regex(/^PL[a-zA-Z0-9_-]+$/, 'Invalid YouTube playlist ID format'),
  /** Accessible title for iframe */
  title: z.string().default('YouTube Playlist'),
  /** Embed height in pixels (200-800) */
  height: z.number().int().min(200).max(800).default(400),
  /** Whether to display playlist title */
  showTitle: z.boolean().default(true),
  /** Whether to autoplay first video */
  autoplay: z.boolean().default(false),
});

/**
 * Inferred TypeScript type from Zod schema
 */
export type PlaylistEmbedProps = z.infer<typeof PlaylistEmbedPropsSchema>;

/**
 * Input type (before defaults applied)
 */
export type PlaylistEmbedInput = z.input<typeof PlaylistEmbedPropsSchema>;

// ============================================================================
// Registry Entry Definition
// ============================================================================

/**
 * PlaylistEmbed registry entry configuration
 * Used to register the component in the MDX component registry.
 */
export const PlaylistEmbedRegistryConfig = {
  name: 'PlaylistEmbed',
  version: '1.0.0',
  description:
    'Embeds a YouTube playlist with play controls and track list. Mirrors the existing playlist-style embed functionality.',
  requiredProps: ['playlistId'],
  optionalProps: ['title', 'height', 'showTitle', 'autoplay'],
  defaultProps: {
    title: 'YouTube Playlist',
    height: 400,
    showTitle: true,
    autoplay: false,
  },
  dependencies: ['YOUTUBE_API_KEY'],
  examples: [
    {
      title: 'Basic Usage',
      code: '<PlaylistEmbed playlistId="PL2yQDdvlhXf8d-EXLaKIt-naTcllN5Gzt" />',
      description: 'Embed a YouTube playlist with default settings.',
    },
    {
      title: 'Custom Height',
      code: '<PlaylistEmbed playlistId="PL2yQDdvlhXf8d-EXLaKIt-naTcllN5Gzt" height={600} />',
      description: 'Embed with a taller height for better visibility.',
    },
    {
      title: 'Autoplay Disabled Title',
      code: '<PlaylistEmbed playlistId="PL2yQDdvlhXf8d-EXLaKIt-naTcllN5Gzt" showTitle={false} autoplay />',
      description: 'Start playing automatically without showing the title.',
    },
  ],
  deprecated: false,
} as const;

// ============================================================================
// Fallback State Types
// ============================================================================

/**
 * Fallback state when PlaylistEmbed cannot render normally
 * @see FR-005: Graceful fallback content
 */
export interface PlaylistEmbedFallbackState {
  /** Reason for fallback */
  reason: 'invalid-id' | 'missing-credential' | 'api-error' | 'network-error';
  /** Human-readable message */
  message: string;
  /** Whether basic embed is still available */
  basicEmbedAvailable: boolean;
}

/**
 * Get fallback state based on error condition
 */
export function getPlaylistFallbackState(
  reason: PlaylistEmbedFallbackState['reason'],
  playlistId?: string
): PlaylistEmbedFallbackState {
  switch (reason) {
    case 'invalid-id':
      return {
        reason,
        message: `Invalid playlist ID format${playlistId ? `: "${playlistId}"` : ''}`,
        basicEmbedAvailable: false,
      };
    case 'missing-credential':
      return {
        reason,
        message: 'Enhanced playlist features unavailable',
        basicEmbedAvailable: true,
      };
    case 'api-error':
      return {
        reason,
        message: 'Could not load playlist metadata',
        basicEmbedAvailable: true,
      };
    case 'network-error':
      return {
        reason,
        message: 'Network error loading playlist',
        basicEmbedAvailable: true,
      };
  }
}

// ============================================================================
// YouTube Metadata Types (for enhanced features)
// ============================================================================

/**
 * YouTube playlist metadata from API
 */
export interface PlaylistMetadata {
  /** Playlist title */
  title: string;
  /** Playlist description */
  description: string;
  /** Number of videos in playlist */
  videoCount: number;
  /** Thumbnail URL */
  thumbnailUrl: string;
  /** Channel name */
  channelTitle: string;
}
