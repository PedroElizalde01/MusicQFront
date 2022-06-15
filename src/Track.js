import React from "react"


const Track = ({track}) => {
  return (
    <div className="d-flex m-2 align-items-center">
      <img src={track.albumUrl} style={{ height: "64px", width: "64px" }} alt="" />
      <div className="ml-3">
        <div style={{ color: "white" }}>{track.title}</div>
        <div className="text-muted">{track.artist}</div>
        <div className="text-muted">{track.uri}</div>
      </div>
    </div>
  );
}

export default Track;