import * as z from "zod";
import playerValidator from "./playerValidator.ts";

export const messageValidator = z.object({
  type: z.string(),
  gameId: z.string(),
  time: z.number(),
  playerA: playerValidator,
  playerB: playerValidator,
});

export type message = z.infer<typeof messageValidator>;

export default messageValidator;
