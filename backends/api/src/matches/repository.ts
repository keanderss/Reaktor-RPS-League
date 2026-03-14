import { prisma } from "../configs/db.ts";
import { Prisma } from "../generated/client.ts";
import type { Match } from "../generated/client.ts";

interface GetMatchesOptions {
  tx?: Prisma.TransactionClient;
  query?: Prisma.MatchWhereInput;
  take?: number;
}

const getMatches = async ({
  tx = prisma,
  query,
  take,
}: GetMatchesOptions): Promise<Match[]> => {
  return await tx.match.findMany({
    where: query,
    orderBy: {
      datetime: "desc",
    },
    take,
  });
};

export { getMatches };
