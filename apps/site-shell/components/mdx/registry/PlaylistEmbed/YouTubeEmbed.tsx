/**
 * YouTube Embed Component
 * Basic YouTube iframe embed with lazy loading
 * @see /specs/008-mdx-component-registry/research.md
 */

export interface YouTubeEmbedProps {
  /** YouTube playlist ID */
  playlistId: string;
  /** Accessible title for iframe */
  title?: string;
  /** Embed height in pixels */
  height?: number;
  /** Whether to autoplay first video */
  autoplay?: boolean;
}

/**
 * Generate YouTube embed URL for a playlist
 */
function getPlaylistEmbedUrl(playlistId: string, autoplay: boolean = false): string {
  const baseUrl = 'https://www.youtube.com/embed/videoseries';
  const params = new URLSearchParams({
    list: playlistId,
    ...(autoplay ? { autoplay: '1' } : {}),
  });
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Basic YouTube Playlist Embed
 * Uses native iframe with lazy loading for performance
 */
export function YouTubeEmbed({
  playlistId,
  title = 'YouTube Playlist',
  height = 400,
  autoplay = false,
}: YouTubeEmbedProps) {
  const embedUrl = getPlaylistEmbedUrl(playlistId, autoplay);

  return (
    <div className="youtube-embed my-6">
      <iframe
        src={embedUrl}
        title={title}
        width="100%"
        height={height}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="rounded-lg border-0"
        style={{
          aspectRatio: '16/9',
          maxHeight: `${String(height)}px`,
        }}
      />
    </div>
  );
}
