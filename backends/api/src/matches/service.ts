import { prisma } from "../configs/db.ts";
import { Prisma } from "../generated/client.ts";
import type { Match } from "../generated/client.ts";
import dateRangeValidator from "../validators/dateRangeValidator.ts";
import * as repository from "./repository.ts";

const getMatches = async (
  player: string | undefined,
  dateRange: { startDate: string | undefined; endDate: string | undefined },
  count: number | undefined,
): Promise<Match[]> => {
  let matches: Match[] = [];
  let query: Prisma.MatchWhereInput = {};

  const { success, data } = await dateRangeValidator.safeParseAsync(
    dateRange,
  );

  if (success) {
    const { startDate, endDate } = data;
    query = { datetime: { gte: startDate, lte: endDate } };
  }

  if (player) {
    const query1 = { ...query };
    const query2 = { ...query };
    query1.player1 = player;
    query2.player2 = player;

    matches = await prisma.$transaction(async (tx) => {
      const matches1 = await repository.getMatches({
        tx,
        query: query1,
        take: count,
      });
      const matches2 = await repository.getMatches({
        tx,
        query: query2,
        take: count,
      });
      const matches = matches1.concat(matches2);
      return matches;
    });

    if (count) {
      matches = matches.sort((a, b) =>
        new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
      );
      matches = matches.slice(0, count);
    }
  } else {
    matches = await repository.getMatches({ query, take: count });
  }

  return matches;
};

export { getMatches };
