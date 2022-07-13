import axios from "axios"
import { useState, useEffect } from "react"
import SpotifyPlayer from "react-spotify-web-playback"
import TracksQueue from "./TracksQueue"

export default function Player({ accessToken, orderBy, queueId}) {
  const [play, setPlay] = useState(false)
  const [ tracks, setTracks] = useState([])
  const [ currentUri, setUri] = useState(tracks[0]?.uri)
  const [ trackEnd, setTrackEnd] = useState()
  console.log(orderBy)

  useEffect(() => setPlay(true), [currentUri])

  useEffect(() =>{ 
    if(orderBy === "default"){
      axios.get("http://localhost:3001/"+queueId+"/songs")
      .then(function(res){
        setInterval(setTracks(res.data),5000)
      })
  }else if(orderBy === "likes"){
    axios.get("http://localhost:3001/"+queueId+"/likedSongs")
    .then(function(res){
      setInterval(setTracks(res.data),5000)
    })
  }else{
    axios.get("http://localhost:3001/"+queueId+"/dislikedSongs")
    .then(function(res){
      setInterval(setTracks(res.data),5000)
    })
  }
})

// CHECK IF CURRENT TRACK IS IN PREVIOUS TRACK

  function handleNextTrack(previousTrack){
    console.log(tracks[0].uri)
    console.log(previousTrack[0].uri)
    if(tracks[0].uri === previousTrack[0].uri){ 
      axios.delete("http://localhost:3001/deleteSong/"+tracks[0].id)
      //axios.put("http://localhost:3001/"+tracks[1].id+"/putFirst")
      setTrackEnd(false)
      console.log(tracks.shift())
      console.log(tracks[0].uri)
      setUri(tracks[0].uri)
    }
    setTrackEnd(true)
  }

  if (!accessToken) return null
  return (
    <div>
      <div className="text-center" style={{ whiteSpace: "pre" }}>
            <TracksQueue tracks={tracks} search={false} dj={true}/>
          </div>

    <SpotifyPlayer
    name={"MusicQ Player"}
      token={accessToken}
      showSaveIcon
      autoPlay={play}
      callback={state => {
        if (!state.isPlaying) setPlay(true)
        handleNextTrack(state.previousTracks)
      }}
      play={true}
      uris={tracks[0]?.uri}
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