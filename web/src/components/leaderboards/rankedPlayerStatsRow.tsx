import type RankedPlayerStats from "../../types/playerStats"


function RankedPlayerStatsRow(playerStats: RankedPlayerStats) {
  return (
    <tr key={playerStats.player}>
      <td>
        {playerStats.rank}
      </td>
      <td>
        {playerStats.player}
      </td>
      <td className="text-center">
        {playerStats.wins}
      </td>
      <td className="text-center">
        {playerStats.losses}
      </td>
      <td className="text-center">
        {playerStats.draws}
      </td>
    </tr>
  )
}

export default RankedPlayerStatsRow