import { useState, useEffect } from "react"
import axios from "axios"
import Track from './Track';

export default function TracksQueue(queueId){
const [tracks, setTracks] = useState()

useEffect(() =>{
    axios.get("http://localhost:3001/"+queueId+"/songs")
.then(res =>{
    setTracks(res.data)
});
})

//{tracks.map((track) => (
//    <Track 
//    track ={track.uri} 
//    />
//))}

return TracksQueue = () =>{
    return(
    <div className="tracks-queue">
        <div className="dashboard">{tracks ? tracks : null}</div>
    </div>
    )
}
}
