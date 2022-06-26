import { useState, useEffect } from "react"
import useAuth from "./useAuth"
import Player from "./Player"
import TrackSearchResult from "./TrackSearchResult"
import { Container, Form } from "react-bootstrap"
import SpotifyWebApi from "spotify-web-api-node"
import TracksQueue from "./TracksQueue"
import axios from "axios"
import Modal from 'react-modal';

const spotifyApi = new SpotifyWebApi({
  clientId: "b3f26e3f562d4f57a30c6b5af6b6bbc4",
})

export default function Room({ code }) {
  const [accessToken, queueId] = useAuth(code)
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [playingTrack, setPlayingTrack] = useState()


  function chooseTrack(track) {
      axios.post("http://localhost:3001/addSong",{
        uri:track.uri,
        queueId: queueId,
        likes: 0,
        dislikes: 0
      })
      .then(() => console.log("SONG ENQUEUED SUCCESSFULLY"))
      .catch(() => console.log("ERROR"))
    setPlayingTrack(track)
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
      <Form.Control
        type="search"
        placeholder="Search Songs/Artists"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
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
            <TracksQueue queueId={queueId} spotifyApi={spotifyApi}/>
          </div>
        )}
      </div>
      <div>
        <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
      </div>
    </Container>
  )
}
