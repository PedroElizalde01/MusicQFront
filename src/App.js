import "bootstrap/dist/css/bootstrap.min.css"
import Login from "./Login"
import Room from "./Room"

const code = new URLSearchParams(window.location.search).get("code")

function App() {
  return code ? <Room code={code} /> : <Login />
}

export default App
