import React from 'react'

const reinvent = (playlist) => {
  const {videos, title, ...newPlaylist} = playlist
  newPlaylist.title = title.replace(/^AWS re:Invent \d{4}.*\| /, '')

  newPlaylist.videos = videos.map(video => {
    let {title, ...newVideo} = video
    title = title.replace(/^AWS re:Invent \d{4}:\s*/, '')
    title = title.replace(/\s*\(.*?\)\s*/g, '')
    title = title.replace(/\s*\[.*?\]\s*/g, '')
    newVideo.title = title
    return newVideo
  })
  
  return newPlaylist
}

export const ReinventProcessor = ({ playlist, children }) => {

  const processor = reinvent
  const content = processor(playlist)

  return (
    <div>
      { React.cloneElement(children, { content }) }
    </div>
  )

}