/**
 * PlaylistEmbed Component
 * Embeds a YouTube playlist with validation and fallback handling
 * @see /specs/008-mdx-component-registry/data-model.md
 */

'use client';

import { useMemo, useCallback, useSyncExternalStore } from 'react';
import { 
  type PlaylistEmbedInput,
  type PlaylistMetadata,
  PlaylistEmbedPropsSchema,
  getPlaylistFallbackState,
} from './types';
import { YouTubeEmbed } from './YouTubeEmbed';
import { EnhancedEmbed, BasicEmbed } from './EnhancedEmbed';
import { PlaylistFallback } from './Fallback';
import { hasCredential } from '../credentials';
import { fetchPlaylistMetadata, hasEnhancedFeatures } from './api';
import { logValidationEvent, logFallbackEvent } from '../logger';

/** Simple metadata cache for client-side rendering */
const metadataCache = new Map<string, PlaylistMetadata | null>();
const errorCache = new Set<string>();
const pendingCache = new Set<string>();

/** Subscribe to cache changes (no-op, cache is synchronous) */
const subscribe = (): (() => void) => () => undefined;

/**
 * Hook to fetch and cache playlist metadata
 */
function usePlaylistMetadata(playlistId: string | null, enabled: boolean) {
  const getSnapshot = useCallback(() => {
    if (!playlistId || !enabled) return { metadata: null, error: false };
    return { 
      metadata: metadataCache.get(playlistId) ?? null,
      error: errorCache.has(playlistId)
    };
  }, [playlistId, enabled]);
  
  const getServerSnapshot = useCallback(() => ({ metadata: null, error: false }), []);
  
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  
  // Trigger fetch if not cached
  if (playlistId && enabled && !metadataCache.has(playlistId) && !errorCache.has(playlistId) && !pendingCache.has(playlistId)) {
    pendingCache.add(playlistId);
    void fetchPlaylistMetadata(playlistId)
      .then((data) => {
        metadataCache.set(playlistId, data);
        pendingCache.delete(playlistId);
      })
      .catch(() => {
        errorCache.add(playlistId);
        pendingCache.delete(playlistId);
        logFallbackEvent('PlaylistEmbed', 'unknown', 'api_error');
      });
  }
  
  return state;
}

/**
 * PlaylistEmbed Component
 * Renders YouTube playlists with validation and graceful fallback
 */
export function PlaylistEmbed(props: PlaylistEmbedInput) {
  // Validate props using Zod schema
  const parseResult = useMemo(() => PlaylistEmbedPropsSchema.safeParse(props), [props]);
  
  // Check for enhanced features availability (re-checks at render for auto-enable)
  const canUseEnhanced = hasEnhancedFeatures();
  
  // Get validated playlistId
  const playlistId = parseResult.success ? parseResult.data.playlistId : null;
  
  // Fetch metadata when enhanced features are available
  const { metadata, error: fetchError } = usePlaylistMetadata(playlistId, canUseEnhanced);
  
  if (!parseResult.success) {
    // Log validation failure
    logValidationEvent('PlaylistEmbed', 'unknown', false, {
      errors: parseResult.error.issues.map((e) => ({
        path: e.path.map(String).join('.'),
        message: e.message,
      })),
    });
    
    // Check if it's an invalid ID error
    const idError = parseResult.error.issues.find((e) => 
      e.path.some((p) => String(p) === 'playlistId')
    );
    if (idError) {
      const fallbackState = getPlaylistFallbackState('invalid-id', props.playlistId);
      return <PlaylistFallback state={fallbackState} />;
    }
    
    // For other validation errors, try with defaults
    const defaultProps = {
      playlistId: props.playlistId || '',
      title: 'YouTube Playlist',
      height: 400,
      showTitle: true,
      autoplay: false,
    };
    
    // If playlistId is still invalid, show fallback
    if (!defaultProps.playlistId || !/^PL[a-zA-Z0-9_-]+$/.test(defaultProps.playlistId)) {
      const fallbackState = getPlaylistFallbackState('invalid-id', props.playlistId);
      return <PlaylistFallback state={fallbackState} />;
    }
    
    // Try to render with defaults
    return (
      <YouTubeEmbed
        playlistId={defaultProps.playlistId}
        title={defaultProps.title}
        height={defaultProps.height}
        autoplay={defaultProps.autoplay}
      />
    );
  }
  
  const validatedProps = parseResult.data;
  
  // Check credential status for enhanced features
  const hasYouTubeApiKey = hasCredential('YOUTUBE_API_KEY');
  
  if (!hasYouTubeApiKey) {
    // Log that we're using basic embed due to missing credential
    logFallbackEvent('PlaylistEmbed', 'unknown', 'missing_credential');
  }
  
  // Show API error fallback if fetch failed
  if (fetchError) {
    const fallbackState = getPlaylistFallbackState('api-error');
    return (
      <div>
        <PlaylistFallback state={fallbackState} />
        {/* Still show basic embed when API fails */}
        <BasicEmbed
          playlistId={validatedProps.playlistId}
          title={validatedProps.title}
          height={validatedProps.height}
          showTitle={validatedProps.showTitle}
          autoplay={validatedProps.autoplay}
        />
      </div>
    );
  }
  
  // Enhanced embed with metadata (when available)
  if (metadata && canUseEnhanced) {
    return (
      <EnhancedEmbed
        playlistId={validatedProps.playlistId}
        title={validatedProps.title}
        height={validatedProps.height}
        showTitle={validatedProps.showTitle}
        autoplay={validatedProps.autoplay}
        metadata={metadata}
      />
    );
  }
  
  // Basic embed (loading state or no enhanced features)
  return (
    <BasicEmbed
      playlistId={validatedProps.playlistId}
      title={validatedProps.title}
      height={validatedProps.height}
      showTitle={validatedProps.showTitle}
      autoplay={validatedProps.autoplay}
    />
  );
}

// Default export for convenience
export default PlaylistEmbed;
