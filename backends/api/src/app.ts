import express from "express";
import cors from "cors";
import matchRouter from "./matches/router.ts";
import leaderboardRouter from "./leaderboards/router.ts";

const app = express();

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(","),
  methods: ["GET", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/leaderboards", leaderboardRouter);
app.use("/matches", matchRouter);

export default app;
