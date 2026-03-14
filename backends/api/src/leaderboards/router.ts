import { Router } from "express";
import type { Request, Response } from "express";
import * as controller from "./controller.ts";

const router = Router();

/**
 * Today's leaderboard of players based on number of wins
 * Leaderboard based on number of wins, which shows the results for a specific date range
 */
router.get("/", async (req: Request, res: Response) => {
  return await controller.handleLeaderboardRequest(req, res);
});

export default router;
