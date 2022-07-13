import { useState, useEffect } from "react"
import useAuth from "./useAuth"
import Player from "./Player"
import TrackSearchResult from "./TrackSearchResult"
import { Container, Form } from "react-bootstrap"
import SpotifyWebApi from "spotify-web-api-node"
import axios from "axios"
import Modal from 'react-modal';
import './Room.css'
import { QRCodeSVG } from 'qrcode.react';

const spotifyApi = new SpotifyWebApi({
  clientId: "b3f26e3f562d4f57a30c6b5af6b6bbc4",
})

export default function Room( {code} ) {
  const [accessToken, queueId] = useAuth(code)
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [playingTrack, setPlayingTrack] = useState()
  const [position, setPosition] = useState(1)
  const [tracks, setTracks] = useState([])
  const [modal, setModal] = useState(false)
  const [mode, setMode] = useState("default")
  const link = "http://localhost:3000/join/"+queueId

  function openModal(){
    setModal(true)
  }

  function closeModal(){
    setModal(false)
  }


//tracks order by most liked
const likedTracks = () =>{ 
  axios.get("http://localhost:3001/"+queueId+"/likedSongs") 
  .then(function(res){
    setInterval(setTracks(res.data),5000)
  })
}

//tracks order by most disliked
const dislikedTracks = () =>{ 
  axios.get("http://localhost:3001/"+queueId+"/dislikedSongs") 
  .then(function(res){
    setInterval(setTracks(res.data),5000)
  })
}

  useEffect( () => {
    axios.get("http://localhost:3001/"+queueId+"/lastSong")
    .then((res) => {
      const n = res.data.position
      if(n !== undefined) setPosition(n + 1);      
    })
  },[search])

 
  function chooseTrack(track) {
      axios.post("http://localhost:3001/addSong",{
        uri: track.uri,
        title: track.title,
        artist: track.artist,
        albumUrl: track.albumUrl,
        duration: track.duration,
        queueId: queueId,
        position: position,
        likes: 0,
        dislikes: 0
      })
      .then((res) => {
        if(tracks.length === 1) {
          setPlayingTrack(res.data)
          console.log("playing track is now: " + res.data)
        }
        console.log("SONG ENQUEUED SUCCESSFULLY")
      })
      .catch(() => console.log("ERROR"))
      tracks.push(track)
      console.log(tracks.length)
    setSearch("")
  }

  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken, queueId])

  useEffect(() => {
    if (!search) return setSearchResults([])
    if (!accessToken) return

    let cancel = false
    spotifyApi.searchTracks(search).then(res => {
      if (cancel) return
      setSearchResults(
        res.body.tracks.items.map(track => {
          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: track.album.images[2].url,
            duration: track.duration_ms,
          }
        })
      )
    })
    return () => (cancel = true)
  }, [search, accessToken, queueId])


  return (
    <Container className="d-flex flex-column py-2" style={{ height: "100vh", backgroundColor:"rgba(25, 20, 20, 1)"}}>
      <div>
        <a id="header" href="http://localhost:3000" className="button" style={{borderRadius:"12px", float:"left", textAlign:"center", border:"none"}}> ◀ </a>
        <button id="header" className="button" style={{borderRadius:"12px", float:"right", textAlign:"center", border:"none"}} onClick={openModal}> ℹ </button>
      </div>
      <Modal
          isOpen={modal}
          contentLabel="onRequestClose Example"
          onRequestClose={closeModal}
          className="Modal"
          overlayClassName="Overlay"
          ariaHideApp={false}>
          <button className="button" onClick={closeModal} style={{fontSize:"30px", float:"right", border:"none"}}>✖</button>
          <div className="d-flex">
            <h3 style={{color:"white"}}>Your Queue ID: {queueId}</h3>
            </div>
            <div className="d-flex">
            <QRCodeSVG className="qrCode" value={link}/>
            <h1 style={{}}></h1>
            <button className="button" style={{marginTop:"auto", marginBottom:"auto",padding:"4px",left:"20%"}} onClick={()=>setMode("default")}>Default</button>
            <button className="button" style={{marginTop:"auto", marginBottom:"auto",padding:"4px",left:"20%"}} onClick={()=>setMode("likes")}>Likes</button>
            <button className="button" style={{marginTop:"auto", marginBottom:"auto",padding:"4px",left:"20%"}} onClick={()=>setMode("dislikes")}>Dislikes</button>
          </div>
        </Modal>
      <Form.Control
        type="search"
        placeholder="Search Songs"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <h1 style={{color:"white", textAlign:"left", marginTop:"10px"}}>Next Up</h1>
      <div className="flex-grow-1 my-2" style={{ overflowY: "auto", textAlign: "left" }}>
        {searchResults.map(track => (
          <TrackSearchResult
            track={track}
            key={track.uri}
            chooseTrack={chooseTrack}
          />
        ))}
        </div>
        <>        
      <div>
        <Player accessToken={accessToken} orderBy={mode} queueId={queueId} />
      </div> </>
      
    </Container>
  )
}
