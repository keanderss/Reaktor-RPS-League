import z from "zod";

export const rpsValidator = z.enum(["ROCK", "PAPER", "SCISSORS"]);
// Extended ruleset:
//export const rpsValidator = z.enum(["ROCK", "PAPER", "SCISSORS", "SPOCK", "LIZARD", "BLADE", "DOG"]);

export type RPS = z.infer<typeof rpsValidator>;

export default rpsValidator;
