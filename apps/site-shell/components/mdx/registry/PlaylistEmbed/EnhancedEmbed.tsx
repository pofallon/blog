/**
 * Enhanced PlaylistEmbed Component
 * Displays playlist with metadata when API key is available
 * @see /specs/008-mdx-component-registry/data-model.md
 */

'use client';

import type { PlaylistMetadata, PlaylistEmbedProps } from './types';
import { YouTubeEmbed } from './YouTubeEmbed';

export interface EnhancedEmbedProps extends PlaylistEmbedProps {
  /** Fetched playlist metadata */
  metadata: PlaylistMetadata;
}

/**
 * Enhanced PlaylistEmbed with metadata display
 * Shows thumbnail, title, video count, and channel info
 */
export function EnhancedEmbed({
  playlistId,
  title,
  height,
  showTitle,
  autoplay,
  metadata,
}: EnhancedEmbedProps) {
  return (
    <div className="enhanced-playlist-embed my-6">
      {/* Metadata Header */}
      <div className="playlist-metadata mb-4 flex items-start gap-4">
        {metadata.thumbnailUrl && (
          <div className="flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={metadata.thumbnailUrl}
              alt={`${metadata.title} thumbnail`}
              className="rounded-lg w-32 h-24 object-cover"
              loading="lazy"
            />
          </div>
        )}
        <div className="flex-1">
          {showTitle && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {metadata.title || title}
            </h3>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {metadata.channelTitle}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            {metadata.videoCount} videos
          </p>
          {metadata.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
              {metadata.description}
            </p>
          )}
        </div>
      </div>
      
      {/* YouTube Embed */}
      <YouTubeEmbed
        playlistId={playlistId}
        title={metadata.title || title}
        height={height}
        autoplay={autoplay}
      />
    </div>
  );
}

/**
 * Basic embed wrapper for when metadata is not available
 * Provides consistent styling with enhanced version
 */
export function BasicEmbed({
  playlistId,
  title,
  height,
  showTitle,
  autoplay,
}: Omit<EnhancedEmbedProps, 'metadata'>) {
  return (
    <div className="basic-playlist-embed my-6">
      {showTitle && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h3>
      )}
      <YouTubeEmbed
        playlistId={playlistId}
        title={title}
        height={height}
        autoplay={autoplay}
      />
    </div>
  );
}
