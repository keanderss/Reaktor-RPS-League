import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Home from "./components/home"
import MatchHistory from "./components/matches/matchHistory"
import Leaderboard from "./components/leaderboards/leaderboard"
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/matches" element={<MatchHistory />}/>
          <Route path="/leaderboards" element={<Leaderboard />}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
