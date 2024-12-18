import { z } from "zod";

const InsertEnvironmentSchema = z.object({
  name: z.string().min(4).max(255),
  env_type: z.enum(["aquarium", "pond"]),
  ecosystem_slug: z.optional(z.string()),
});

export { InsertEnvironmentSchema };
