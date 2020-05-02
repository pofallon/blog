export const reinvent = (playlist) => {
  playlist.videos.map(video => {
    video.title = video.title.slice(19)
    video.title = video.title.replace(/\s*\(.*?\)\s*/g, '')
    video.title = video.title.replace(/\s*\[.*?\]\s*/g, '')
    return video
  })
  return playlist
}