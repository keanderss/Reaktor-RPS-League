import z from "zod";

const dateRangeValidator = z.object({
  startDate: z.iso.datetime().transform((d) => new Date(d).toISOString()),
  endDate: z.iso.datetime().transform((d) => new Date(d).toISOString()),
});

export default dateRangeValidator;
