/**
 * PlaylistEmbed Fallback Component
 * Displays graceful fallback for invalid or error states
 * @see /specs/008-mdx-component-registry/contracts/playlist-embed.ts
 */

import type { PlaylistEmbedFallbackState } from './types';

export interface PlaylistFallbackProps {
  /** Fallback state with reason and message */
  state: PlaylistEmbedFallbackState;
  /** Optional playlist ID to display */
  playlistId?: string;
}

/**
 * Fallback display for PlaylistEmbed component
 * Shows appropriate messaging based on error type
 */
export function PlaylistFallback({ state, playlistId }: PlaylistFallbackProps) {
  const getIcon = () => {
    switch (state.reason) {
      case 'invalid-id':
        return '⚠️';
      case 'network-error':
        return '🌐';
      case 'api-error':
        return '⚙️';
      case 'missing-credential':
        return 'ℹ️';
      default:
        return '⚠️';
    }
  };

  const getBackgroundColor = () => {
    switch (state.reason) {
      case 'invalid-id':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'network-error':
      case 'api-error':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'missing-credential':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
    }
  };

  const getTextColor = () => {
    switch (state.reason) {
      case 'invalid-id':
        return 'text-red-700 dark:text-red-300';
      case 'network-error':
      case 'api-error':
        return 'text-yellow-700 dark:text-yellow-300';
      case 'missing-credential':
        return 'text-blue-700 dark:text-blue-300';
      default:
        return 'text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div
      className={`playlist-fallback rounded-lg border p-4 my-6 ${getBackgroundColor()}`}
      role="alert"
    >
      <div className={`flex items-start gap-3 ${getTextColor()}`}>
        <span className="text-2xl" aria-hidden="true">
          {getIcon()}
        </span>
        <div className="flex-1">
          <p className="font-medium">{state.message}</p>
          {playlistId && state.reason === 'invalid-id' && (
            <p className="text-sm mt-1 opacity-75">
              Playlist ID: <code className="bg-black/10 px-1 rounded">{playlistId}</code>
            </p>
          )}
          {state.basicEmbedAvailable && state.reason !== 'invalid-id' && (
            <p className="text-sm mt-1 opacity-75">
              The basic playlist view is still available.
            </p>
          )}
          {state.reason === 'invalid-id' && (
            <p className="text-sm mt-2">
              Expected format: <code className="bg-black/10 px-1 rounded">PL...</code> (YouTube playlist ID)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
