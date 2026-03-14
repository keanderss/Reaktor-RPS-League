import express from "express";
import matchRouter from "./matches/router.ts";
import leaderboardRouter from "./leaderboards/router.ts";

const app = express();

app.use(express.json());

app.use("/leaderboards", leaderboardRouter);
app.use("/matches", matchRouter);

export default app;
