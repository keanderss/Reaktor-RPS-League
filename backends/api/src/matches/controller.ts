import type { Request, Response } from "express";
import * as service from "./service.ts";
import z from "zod";
import queryValidator from "../validators/queryValidator.ts";
import redis from "../configs/redis.ts";

const handleMatchesRequest = async (req: Request, res: Response) => {
  const query = req.query;
  const cacheKey = JSON.stringify(query);
  const cacheHit = await redis.get(cacheKey);
  if (cacheHit) {
    return res.json(JSON.parse(cacheHit));
  }
  const { success, data, error } = queryValidator.safeParse(query);
  console.log("/matches", JSON.stringify(query));
  if (success) {
    const { player, startDate, endDate, count } = data;
    const result = await service.getMatches(
      player,
      { startDate, endDate },
      count,
    );
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

export { handleMatchesRequest };
