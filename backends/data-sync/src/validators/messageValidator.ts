import * as z from "zod";
import playerValidator from "./playerValidator.ts";

const messageValidator = z.object({
    type: z.string(),
    gameId: z.string(),
    time: z.number(),
    playerA: playerValidator,
    playerB: playerValidator
});

export default messageValidator;
