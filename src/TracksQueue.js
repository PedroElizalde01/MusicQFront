import { useState, useEffect } from "react"
import axios from "axios"
import Track from './Track';

export default function TracksQueue(queueId, {spotifyApi}){
const [tracks, setTracks] = useState([])

useEffect(() =>{ 
    axios.get("http://localhost:3001/"+queueId.queueId+"/songs")
    .then(function(res){
        setTracks(res.data)
        //res.data.map((song) => {return setTracks(tracks.push(song))})
    })
},[])

console.log(tracks)

    return(
    <div className="tracks-queue">
        <div className="dashboard" style={{color:"white"}}> Queue Id: {queueId.queueId}</div> 
        <div>
            {tracks.length > 0 ?
                tracks.map((track) =>
                <Track track={track} key={track.uri} title={"test"}/>
                ):
                <h2 style={{color:"grey"}}>Search and add a song</h2> // add spinner -Pedro
            }
            
        </div>
    </div>
    )
}
