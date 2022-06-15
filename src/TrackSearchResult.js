import React from "react"
import Track from "./Track"

export default function TrackSearchResult({ track, chooseTrack }) {
  function handlePlay() {
    chooseTrack(track)
  }

  return (
    <div
      style={{ cursor: "pointer" }}
      onClick={handlePlay}>
      <Track track={track}/>
    </div>
  )
}
