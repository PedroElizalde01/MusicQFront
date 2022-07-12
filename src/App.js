import "bootstrap/dist/css/bootstrap.min.css"
import Login from "./Login"
import Room from "./Room"
import GuestRoom from "./GuestRoom"
import { BrowserRouter, Route, Routes, Link, useNavigate} from 'react-router-dom';
import "./App.css"
import axios from "axios";


const code = new URLSearchParams(window.location.search).get("code")

function App() {
  return(
    <div className="wrapper" style={{textAlign: "center"}}>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={code ? <Room code={code} /> : <Login />} />
        <Route path="/join/:queueId/" element={<GuestRoom />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
 function Home() {
    const navigate = useNavigate();
   function handleJoin() {
      const queueId = document.getElementById('queueId').value;
      axios.get("http://localhost:3001/queueId/"+queueId)
      .then(() => navigate('/join/'+queueId))
      .catch(() =>alert("Please enter a valid queueId"))      
    };
   return <div>
      <Link id="main" to="/create">CREATE</Link>
      <br/>
        <button id="main" onClick={handleJoin}>JOIN</button>
        <br/>
        <input id="queueId" type="search" placeholder="Queue ID"></input>
    </div>
  }
}

export default App
