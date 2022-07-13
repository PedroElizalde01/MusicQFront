import { useState, useEffect } from "react"
import useAuth from "./useAuth"
import Player from "./Player"
import TrackSearchResult from "./TrackSearchResult"
import { Container, Form } from "react-bootstrap"
import SpotifyWebApi from "spotify-web-api-node"
import TracksQueue from "./TracksQueue"
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
  const [position, setPosition] = useState(0)
  const [tracks, setTracks] = useState([])
  const [modal, setModal] = useState(false)
  const link = "http://localhost:3000/join/"+queueId

  function openModal(){
    setModal(true)
  }

  function closeModal(){
    setModal(false)
  }

  //tracks order by default
  useEffect(() =>{ 
    axios.get("http://localhost:3001/"+queueId+"/songs")
    .then(function(res){
      setInterval(setTracks(res.data),5000)
    })
})

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
      console.log("oldPosition: " + n)
      if(n !== undefined) setPosition(n + 1);
      console.log("position: " + position)
      
    })
  },[search])


  function chooseTrack(track) {
    //if queue is empty play song -Pedro 
    if(tracks.length === 0) setPlayingTrack(track)
      axios.post("http://localhost:3001/addSong",{
        uri: track.uri,
        title: track.title,
        artist: track.artist,
        albumUrl: track.albumUrl,
        queueId: queueId,
        position: position,
        likes: 0,
        dislikes: 0
      })
      .then(() => console.log("SONG ENQUEUED SUCCESSFULLY"))
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
          }
        })
      )
    })
    return () => (cancel = true)
  }, [search, accessToken, queueId])


  return (
    <Container className="d-flex flex-column py-2" style={{ height: "100vh", backgroundColor:"rgba(25, 20, 20, 1)"}}>
      <div>
        <a href="http://localhost:3000" className="button" style={{borderRadius:"50%", float:"left", textAlign:"center"}}> ◀ </a>
        <button className="button" style={{borderRadius:"50%", float:"right", textAlign:"center"}} onClick={openModal}> i </button>
      </div>
      <Modal
          isOpen={modal}
          contentLabel="onRequestClose Example"
          onRequestClose={closeModal}
          className="Modal"
          overlayClassName="Overlay"
          ariaHideApp={false}>
          <button className="button" onClick={closeModal} style={{fontSize:"20px",height:"60px",width:"60px", borderRadius:"50%", float:"right"}}>x</button>
          <div className="d-flex">
            <h3 style={{color:"white"}}>Your Queue ID: {queueId}</h3>
            </div>
            <div className="d-flex">
            <QRCodeSVG className="qrCode" value={link}/>
            <form>
            <input type="radio" id="html" checked="checked" name="fav_language" value="HTML"/>
            <label for="html">HTML</label>
            <br/>
            <input type="radio" id="css" name="fav_language" value="CSS"/>
            <label for="css">CSS</label>
            <br/>
            <input type="radio" id="javascript" name="fav_language" value="JavaScript"/>
            <label for="javascript">JavaScript</label>
            <br/>
          </form> 
          </div>
        </Modal>
      <Form.Control
        type="search"
        placeholder="Search Songs"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <h1 style={{color:"white"}}>Next Up</h1>
      <div className="flex-grow-1 my-2" style={{ overflowY: "auto", textAlign: "left" }}>
        {searchResults.map(track => (
          <TrackSearchResult
            track={track}
            key={track.uri}
            chooseTrack={chooseTrack}
          />
        ))}
        {searchResults.length === 0 && (
          <div className="text-center" style={{ whiteSpace: "pre" }}>
            <TracksQueue tracks={tracks} search={false} dj={true}/>
          </div>
        )}
      </div>
      <div>
        <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
      </div>
    </Container>
  )
}
