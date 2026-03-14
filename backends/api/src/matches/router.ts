import { Router } from "express";
import type { Request, Response } from "express";
import * as controller from "./controller.ts";

const router = Router();

/**
 * Viewing the latest RPS match results
 * Viewing the RPS match results on a given day
 * Viewing match results for a specific player
 */
router.get("/", async (req: Request, res: Response) => {
  return await controller.handleMatchesRequest(req, res);
});

export default router;
