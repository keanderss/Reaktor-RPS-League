import * as z from "zod";
import playerValidator from "./playerValidator.ts";
import timeValidator from "./timeValidator.ts";

export const matchValidator = z.object({
  type: z.string(),
  gameId: z.string(),
  time: timeValidator,
  playerA: playerValidator,
  playerB: playerValidator,
});

export type match = z.infer<typeof matchValidator>;

export default matchValidator;
