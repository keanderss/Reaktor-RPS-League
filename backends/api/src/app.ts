import express from "express";
import matchRouter from "./matches/router.ts";

const app = express();

app.use(express.json());

app.use("/stats", matchRouter);

export default app;
