import React from "react"
import { Container, Row, Col} from "react-bootstrap"
import SpotifyWebApi from "spotify-web-api-node"
import axios from "axios"


const spotifyApi = new SpotifyWebApi({
  clientId: "b3f26e3f562d4f57a30c6b5af6b6bbc4",
})

const Track = ({track,search,dj}) => {

  //for dj
  const handleDelete = () =>{
    axios.delete("http://localhost:3001/deleteSong/"+track.id)
  }

  const handleUp = () =>{
    axios.put("http://localhost:3001/"+track.id+"/moveUp",{
      position: track.position,
      queueId: track.queueId
    })
  }

  const handleDown = () =>{
    axios.put("http://localhost:3001/"+track.id+"/moveDown",{
      position: track.position,
      queueId: track.queueId
    })
  }

  //for everybody
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
  //

  return (
    <div className="d-flex m-2 align-items-center" style={{background:"#302A2A"}}>
      <img src={track.albumUrl} style={{ height: "64px", width: "64px" }} alt="" />
      <div className="ml-4 mr-5">
        <div style={{ color: "white" }}>{track.title}</div>
        <div className="text-muted">{track.artist}</div>
      </div>

      {search ?
       <></>:
      <><div style={{ marginLeft:"5%" }}>
          <div >
            <div style={{ color: "green" }}>LIKES: {track.likes}</div>
            <div style={{ color: "red" }}>DISLIKES: {track.dislikes}</div>
          </div>
        </div>
        <div style={{marginLeft:"10%"}}>
            <div>
              <button style={{ background:"transparent", fontSize:"40px",marginRight:"10px", border:"none"}} onClick={handleLike}>👍</button>
              <button style={{ background:"transparent", fontSize:"40px", marginLeft:"10px", border:"none"}} onClick={handleDislike}>👎</button>
            </div>
          </div></>}

      {dj ?
      <>
      <div style={{marginLeft:"10%"}}>
        <div>
          <button style={{background:"transparent", fontSize:"20px", border:"none"}} onClick={handleUp}>🔺</button>
        </div>
        <div>
          <button style={{background:"transparent", fontSize:"20px", border:"none"}} onClick={handleDown}>🔻</button>
        </div>
      </div> 
        <button style={{ background:"transparent", fontSize:"40px", border:"none"}} onClick={handleDelete}>✖</button>
        </>
      :
        <></>
      }
    </div>
  );
}

export default Track;