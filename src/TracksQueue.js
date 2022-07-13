import { useState, useEffect } from "react"
import axios from "axios"
import Track from './Track';

export default function TracksQueue({tracks,search,dj}){

    function handleClick(queueId, position) {
        axios.delete("http://localhost:3001/" + queueId,{
            position,
        }).then(function(res){
            console.log(res.data.count + " deleted songs")
        })        
    }

    return(
    <div className="tracks-queue">
        <div style={{textAlign:"left"}}>
        {tracks.length > 0 ?
                tracks.map((track) =>
                <div key={track.id} style={{ cursor: "pointer"}} >
                    <Track track={track} search={search} dj={dj}/>
                </div>
                ):
                <h2 style={{color:"grey"}}>Search and add a song</h2> // add spinner -Pedro
            }
        </div>
    </div>
    )
}
