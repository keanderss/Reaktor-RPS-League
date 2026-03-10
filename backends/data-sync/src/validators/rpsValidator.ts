import z from "zod";

export const rpsValidator = z.enum(["ROCK", "PAPER", "SCISSORS"]);

export type RPS = z.infer<typeof rpsValidator>;

export default rpsValidator;
