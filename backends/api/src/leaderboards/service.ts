import * as repository from "../matches/repository.ts";

type player = string;

const getLeaderboard = async (
  startDate: string,
  endDate: string,
) => {
  const query = { datetime: { gte: startDate, lte: endDate } };
  const matches = await repository.getMatches({ query });

  const statsByPlayer: Record<
    player,
    { wins: number; losses: number; draws: number }
  > = {};

  // Calculate the win, loss, draw counts.
  for (const match of matches) {
    const { result, player1, player2 } = match;

    if (!statsByPlayer[player1]) {
      statsByPlayer[player1] = { wins: 0, losses: 0, draws: 0 };
    }

    if (!statsByPlayer[player2]) {
      statsByPlayer[player2] = { wins: 0, losses: 0, draws: 0 };
    }

    if (result === "PLAYER1") {
      statsByPlayer[player1].wins++;
      statsByPlayer[player2].losses++;
    } else if (result === "PLAYER2") {
      statsByPlayer[player2].wins++;
      statsByPlayer[player1].losses++;
    } else {
      statsByPlayer[player1].draws++;
      statsByPlayer[player2].draws++;
    }
  }

  // Convert dictionary to list of objects containing stats by player.
  const leaderboardStats = Object.entries(statsByPlayer).map((
    [key, value],
  ) => ({
    player: key,
    ...value,
  }));
  return leaderboardStats;
};

export { getLeaderboard };
