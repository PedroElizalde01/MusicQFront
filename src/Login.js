import React from "react"
import { Container } from "react-bootstrap"
import "./Login.css"

const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=b3f26e3f562d4f57a30c6b5af6b6bbc4&response_type=code&redirect_uri=http://localhost:3000/create&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"

export default function Login() {
  return (
    <Container 
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" , backgroundColor: "rgba(25, 20, 20, 1)"}}
    >
      <a className="button" href={AUTH_URL}>
        Login With Spotify
      </a>
    </Container>
  )
}
