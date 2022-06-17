import { useState, useEffect } from "react"
import axios from "axios"
import Track from './Track';

export default function TracksQueue(queueId){
const [tracks, setTracks] = useState([])
const [queue, setQueue] = useState()

console.log()

//useEffect(() =>{
//    axios.get("http://localhost:3001/queueId/cl4f3x7g5000760bn21ioj4os")
//    .then(res =>{
//        setQueue(res.data.id)
//        console.log(res.data.id)
//    })
//},setQueue)

//useEffect(() =>{
//    axios.get("http://localhost:3001/cl4f3x7g5000760bn21ioj4os/songs")
//.then(res =>{
//    console.log(res.data)
//    setTracks(res.data)
//});
//},[tracks, setTracks])

//{tracks.map((track) => (
//    <Track 
//    track ={track.uri} 
//    />
//))}

return TracksQueue = () =>{
    return(
    <div className="tracks-queue">
        <div className="dashboard" style={{color:"white"}}>Queue Id: {queueId.queueId}</div>
    </div>
    )
}
}
