import * as z from "zod";
import rpsValidator from "./rpsValidator.ts";

const playerValidator = z.object({
  name: z.string(),
  played: z.string().transform((rps) => rps.toUpperCase()).pipe(rpsValidator),
});

export default playerValidator;
