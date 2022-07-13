import React , {useState}from "react"
import axios from "axios"

const Track = ({track,search,dj}) => {
  const [canLike, setCanLike] = useState(search)

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

  function handleSelect(queueId, position) {
    const n = position - 1
    console.log(n)
    axios.delete("http://localhost:3001/" + queueId,{
        n,
    }).then((res) => {
        console.log(res.data.count + " deleted songs")
    })        
}

  return (
    <div className="d-flex m-2 align-items-center" style={{background:"#302A2A", borderRadius:"8px"}} >
      <img src={track.albumUrl} style={{ cursor: "pointer", height: "64px", width: "64px" , margin:"8px"}} alt="" onClick={() => handleSelect(track.queueId, track.position)}/>
      <div className="ml-4 mr-5">
        <div style={{ color: "white" }}>{track.title}</div>
        <div className="text-muted">{track.artist}</div>
      </div>

      {canLike ?
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