/**
 * YouTube API Client
 * Fetches playlist metadata when API key is available
 * @see /specs/008-mdx-component-registry/research.md
 */

import type { PlaylistMetadata } from './types';
import { getCredential } from '../credentials';
import { logComponentError } from '../logger';

/** YouTube API playlist response shape */
interface YouTubePlaylistResponse {
  items?: {
    snippet: {
      title: string;
      description: string;
      channelTitle: string;
      thumbnails?: {
        high?: { url: string };
        medium?: { url: string };
        default?: { url: string };
      };
    };
    contentDetails: {
      itemCount: number;
    };
  }[];
}

/**
 * Fetch playlist metadata from YouTube Data API
 * @param playlistId - YouTube playlist ID
 * @returns Playlist metadata or null if unavailable
 */
export async function fetchPlaylistMetadata(
  playlistId: string
): Promise<PlaylistMetadata | null> {
  const apiKey = getCredential('YOUTUBE_API_KEY');
  
  if (!apiKey) {
    // No API key available - this is expected, not an error
    return null;
  }
  
  try {
    const url = new URL('https://www.googleapis.com/youtube/v3/playlists');
    url.searchParams.set('part', 'snippet,contentDetails');
    url.searchParams.set('id', playlistId);
    url.searchParams.set('key', apiKey);
    
    const response = await fetch(url.toString(), {
      // Cache for 1 hour to reduce API calls
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      logComponentError(
        'PlaylistEmbed',
        'api',
        `YouTube API error: ${String(response.status)} - ${errorText}`
      );
      return null;
    }
    
    const data = (await response.json()) as YouTubePlaylistResponse;
    
    if (!data.items || data.items.length === 0) {
      logComponentError(
        'PlaylistEmbed',
        'api',
        `Playlist not found: ${playlistId}`
      );
      return null;
    }
    
    const playlist = data.items[0];
    if (!playlist) {
      logComponentError(
        'PlaylistEmbed',
        'api',
        `Playlist not found: ${playlistId}`
      );
      return null;
    }
    const snippet = playlist.snippet;
    const contentDetails = playlist.contentDetails;
    
    return {
      title: snippet.title,
      description: snippet.description,
      videoCount: contentDetails.itemCount,
      thumbnailUrl: snippet.thumbnails?.high?.url ?? 
                    snippet.thumbnails?.medium?.url ??
                    snippet.thumbnails?.default?.url ?? '',
      channelTitle: snippet.channelTitle,
    };
  } catch (error) {
    logComponentError(
      'PlaylistEmbed',
      'api',
      error instanceof Error ? error : String(error)
    );
    return null;
  }
}

/**
 * Check if enhanced features are available (API key present)
 */
export function hasEnhancedFeatures(): boolean {
  return Boolean(getCredential('YOUTUBE_API_KEY'));
}
