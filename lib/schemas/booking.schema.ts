
import { z } from "zod";

export const BookingResultSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
});

export type BookingResult = z.infer<typeof BookingResultSchema>;
