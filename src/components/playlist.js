import React from "react"

const Playlist = ({content, title}) =>
  <div>
    <h3>{title || content.title}</h3>
    <ul>
      {content.videos.map(v => <li key={v.id}><a href={v.videoUrl}>{v.title}</a></li>)}
    </ul>
  </div>


export default Playlist