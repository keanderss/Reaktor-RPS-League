import { useNavigate } from "react-router-dom"

function Home() {
  const navigate = useNavigate()
  return (
    <>
      <div className="text-center">
        <h1>RPS.GG</h1>
        <img src="/rps.png" style={{ width: "25%" }} alt="RPS" />
      </div>
      <div className="text-center">
        <button style={{ width: "50%" }} onClick={() => navigate("/matches")}>Matches</button>
        <br />
        <br />
        <button style={{ width: "50%" }} onClick={() => navigate("/leaderboards")}>Leaderboards</button>
      </div>
    </>
  )
}

export default Home