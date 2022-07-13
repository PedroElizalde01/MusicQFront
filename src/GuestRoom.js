import { useState, useEffect } from "react"
import TrackSearchResult from "./TrackSearchResult"
import { Container, Form } from "react-bootstrap"
import SpotifyWebApi from "spotify-web-api-node"
import TracksQueue from "./TracksQueue"
import axios from "axios"
import Modal from 'react-modal';
import { QRCodeSVG } from 'qrcode.react';
import { BrowserRouter, Route, Routes, Link, useParams} from 'react-router-dom';
import './Room.css'

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
})

export default function GuestRoom() {
  let {queueId} = useParams()
  const [accessToken,setAccessToken] = useState()
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [tracks, setTracks] = useState([])
  const [modal, setModal] = useState(false)
  const [position, setPosition] = useState(1)
  const link = "http://localhost:3000/join/"+queueId
  

  function openModal(){
    setModal(true)
  }

  function closeModal(){
    setModal(false)
  }

  useEffect( () => {
    axios.get("http://localhost:3001/"+queueId+"/lastSong")
    .then((res) => {
      const n = res.data.position
      console.log("oldPosition: " + n)
      if(n != undefined) setPosition(n + 1);
      console.log("position: " + position)
      
    })
  },[search])
  
//saves song in certain queue
  function chooseTrack(track) {
    //add condition if queue is empty -Pedro 
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
    setSearch("")
  }

  //get all songs from certain queue
  useEffect(() =>{ 
    axios.get("http://localhost:3001/"+queueId+"/songs") 
    .then(function(res){
      setInterval(setTracks(res.data),5000)
    })
})

//save guest info in database
  useEffect(() => {
    axios.post("http://localhost:3001/queue="+queueId)
    .then((res) =>{
      setAccessToken(res.data.accessToken)
      spotifyApi.setAccessToken(res.data.accessToken)
    })
  },[])

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
            <input type="radio" id="ratio" name="fav_language" value="HTML"/>
            <label id="ratio">Disable</label>
            <br/>
            <input type="radio" id="ratio" name="fav_language" value="CSS"/>
            <label id="ratio">Most Liked</label>
            <br/>
            <input type="radio" id="ratio" name="fav_language" value="JavaScript"/>
            <label id="ratio">Most Disliked</label>
            <br/>
          </form> 
          </div>
        </Modal>

      <Form.Control
        type="search"
        placeholder="Search Songs/Artists"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="flex-grow-1 my-2" style={{ overflowY: "auto", textAlign: "left"}}>
        {searchResults.map(track => (
          <TrackSearchResult
            track={track}
            key={track.uri}
            chooseTrack={chooseTrack}
          />
        ))}
        <h1 style={{color:"white"}}>Next Up</h1>
        {searchResults.length === 0 && (
          <div className="text-center" style={{ whiteSpace: "pre" }}>
            <TracksQueue tracks={tracks} search={false} dj={false}/>
          </div>
        )}
      </div>
      <div>
      </div>
    </Container>
  )
}
