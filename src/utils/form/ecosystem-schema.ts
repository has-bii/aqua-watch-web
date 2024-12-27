import { z } from "zod";

export const InsertEcosystemSchema = z.object({
  name: z.string().min(4).max(255),
  desc: z.optional(z.string()),
  slug: z.string(),
});
