import type { Request, Response } from "express";
import * as service from "./service.ts";
import * as z from "zod";
import dateRangeValidator from "../validators/dateRangeValidator.ts";
import redis from "../configs/redis.ts";

const handleLeaderboardRequest = async (req: Request, res: Response) => {
  const query = req.query;
  const cacheKey = JSON.stringify(query);
  const cacheHit = await redis.get(cacheKey);
  if (cacheHit) {
    return res.json(JSON.parse(cacheHit));
  }
  const { success, data, error } = await dateRangeValidator.safeParseAsync(
    query,
  );
  console.log("/leaderboards", JSON.stringify(query));
  if (success) {
    const { startDate, endDate } = data;
    const result = await service.getLeaderboard(startDate, endDate);
    await redis.set(cacheKey, JSON.stringify(result), {
      EX: 60 * 60,
      NX: true,
    });
    return res.json(result);
  }
  const errorMessage = z.prettifyError(error);
  console.log(errorMessage);
  return res.json(errorMessage);
};

export { handleLeaderboardRequest };
