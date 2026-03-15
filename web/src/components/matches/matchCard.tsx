import type MatchData from "../../types/match"

function MatchCard(match: MatchData) {
  let result = match.result;
  if (match.result === "PLAYER1") {
    result = `${match.player1} won`
  }
  if (match.result === "PLAYER2") {
    result = `${match.player2} won`
  }
  if (match.result === "DRAW") {
    result = "tie"
  }
  return (
    <>
      <div key={match.id} className="card">
        <p>{match.player1} vs {match.player2}</p>
        <p>{new Date(match.datetime).toLocaleString()}</p>
        <p>{match.player1}: {match.move1.toLowerCase()}</p>
        <p>{match.player2}: {match.move2.toLowerCase()} </p>
        <p>Match result: {result}</p>
      </div>
    </>
  )
}

export default MatchCard