import z from "zod";

const dateRangeValidator = z.object({
  startDate: z.iso.date().transform((d) => new Date(d).toISOString()),
  endDate: z.iso.date().transform((d) => new Date(d).toISOString()),
});

export default dateRangeValidator;
