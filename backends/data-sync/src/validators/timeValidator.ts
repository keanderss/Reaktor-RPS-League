import * as z from "zod";

const timeValidator = z.union([
  z.number(), 
  z.iso.datetime()
]).transform((val) => {
  if (typeof val === "number") {
    return new Date(val).toISOString()
  };
  return val;
});

export default timeValidator;