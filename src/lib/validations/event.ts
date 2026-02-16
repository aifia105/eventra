import z from "zod";

export const eventSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  location: z.string().min(5, "Location must be at least 5 characters"),
  availableSeats: z.number().min(1, "Available seats must be at least 1"),
  type: z.enum(["public", "private"]),
  stage: z.string().optional(),
});


export type EventInput = z.infer<typeof eventSchema>;

