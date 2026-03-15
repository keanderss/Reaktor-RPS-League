import type { Request, Response } from "express";
import * as service from "./service.ts";
import z from "zod";
import queryValidator from "../validators/queryValidator.ts";

const handleMatchesRequest = async (req: Request, res: Response) => {
  const query = req.query;
  const { success, data, error } = queryValidator.safeParse(query);
  console.log("/matches", JSON.stringify(query));
  if (success) {
    const { player, startDate, endDate, count } = data;
    const result = await service.getMatches(
      player,
      { startDate, endDate },
      count,
    );
    return res.json(result);
  }
  const errorMessage = z.prettifyError(error);
  console.log(errorMessage);
  return res.json(errorMessage);
};

export { handleMatchesRequest };
