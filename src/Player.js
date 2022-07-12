import { useState, useEffect } from "react"
import SpotifyPlayer from "react-spotify-web-playback"

export default function Player({ accessToken, trackUri }) {
  const [play, setPlay] = useState(false)
  const [ tracks, setTracks] = useState([])

  useEffect(() => setPlay(true), [trackUri])

  const handlePlay = () => {
    console.log("empieza asi: "+tracks)
    const newTracks = [...tracks,"spotify:track:166Dyvfibu4SOygA4vub85"]
    setTracks(newTracks)
    console.log("termina asi: " + newTracks)
  }

  if (!accessToken) return null
  return (
    <div>
      <button type="button" onClick={handlePlay}>add song</button>
    <SpotifyPlayer
      token={accessToken}
      showSaveIcon
      callback={state => {
        if (!state.isPlaying) setPlay(false)
      }}
      play={true}
      uris={tracks}
      styles={{
        trackNameColor:"white",
        sliderColor:"rgba(30, 215, 96, 1)",
        sliderHandleColor:"rgba(30, 215, 96, 1)",
        color:"white",
        bgColor:"rgba(25, 20, 20, 1)"
    }}
    />
    </div>
  )
}