import { Router } from "express";

const router = Router();

/** 
 * Today’s leaderboard of players based on number of wins
 */
router.get("/leaderboards/today", async (req, res) => {
    
});

/** 
 * Historical leaderboard based on number of wins, which shows the results for a specific date range
 */
router.get("/leaderboards", async (req, res) => {

});

export default router;
