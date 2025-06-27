import { z } from "zod"

export const accountSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.enum(["CURRENT", "SAVINGS"]),
    balance: z.coerce.number()
            .min(0, "Initial balance must be 0 or more")
            .refine(val => !isNaN(val), { message: "Must be a valid number" }),
    isDefault: z.boolean().default(false),
  });