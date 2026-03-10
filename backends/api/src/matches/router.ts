import { Router } from "express";

const router = Router();

/** 
 * Viewing the latest RPS match results
 */
router.get("/matches/latest", async (req, res) => {
    
});

/** 
 * Viewing the RPS match results on a given day
 */
router.get("/matches", async (req, res) => {
    
});

/** 
 * Viewing match results for a specific player
 */
router.get("/matches/:playerId", async (req, res) => {
    
});

export default router;
