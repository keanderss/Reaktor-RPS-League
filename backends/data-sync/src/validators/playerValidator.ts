import * as z from "zod";

const playerValidator = z.object({
    name: z.string(),
    played: z.enum(["ROCK", "PAPER", "SCISSORS"])
});

export default playerValidator;
