import React from "react"
import { Container, Row, Col} from "react-bootstrap"
import SpotifyWebApi from "spotify-web-api-node"
import axios from "axios"


const spotifyApi = new SpotifyWebApi({
  clientId: "b3f26e3f562d4f57a30c6b5af6b6bbc4",
})

const Track = ({track,search,dj}) => {

  const handleDelete = () =>{
    axios.delete("http://localhost:3001/deleteSong/"+track.id)
  }

  const handleLike = () => {
    const oldLikes = track.likes;
    axios.put("http://localhost:3001/"+track.id+"/like",{
      oldLikes,
    })
  }

  const handleDislike = () => {
    const oldDislikes = track.dislikes;
    axios.put("http://localhost:3001/"+track.id+"/dislike",{
      oldDislikes,
    })
  }

  return (
    <div className="d-flex m-2 align-items-center">
      <img src={track.albumUrl} style={{ height: "64px", width: "64px" }} alt="" />
      <div className="ml-4 mr-5">
        <div style={{ color: "white" }}>{track.title}</div>
        <div className="text-muted">{track.artist}</div>
      </div>

      {search ?
       <></>:
      <div style={{ bottom: "10%" }}>
        <div style={{position: "absolute", right:"50%"}}>
          <div style={{color:"green"}}>LIKES: {track.likes}</div>
          <div style={{color:"red"}}>DISLIKES: {track.dislikes}</div>
        </div>
        <div style={{position: "absolute", right:"26%"}}>
          <button style={{color:"green"}} onClick={handleLike}>LIKE</button>
          <button style={{color:"red"}} onClick={handleDislike}>DISLIKE</button>
        </div> 
      </div>}

      {dj ?
      <div style={{position: "absolute", right:"15%"}}>
        <div>
        <button style={{color:"red"}} onClick={handleDelete}>X</button>
        </div>
        </div> :
        <></>
      }
    </div>
  );
}

export default Track;