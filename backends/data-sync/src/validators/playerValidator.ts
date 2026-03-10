import * as z from "zod";
import rpsValidator from "./rpsValidator.ts";

const playerValidator = z.object({
  name: z.string(),
  played: rpsValidator,
});

export default playerValidator;
