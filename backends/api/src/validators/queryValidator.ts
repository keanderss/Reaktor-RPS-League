import * as z from "zod";

const queryValidator = z.object({
  count: z.coerce.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  player: z.string().optional(),
});

export default queryValidator;
