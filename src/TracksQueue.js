import Song from './Track';


const TracksQueue = ({tracks}) =>{
    return(
    <div className="tracks-queue">
        {tracks.map((track) => (
            <Song 
            track ={track.uri} 
            />
        ))}
    </div>
    )
}

export default TracksQueue;