import { z } from "zod";

export const ingestSchema = z.object({
  text: z.string().min(1).max(100_000),
  hint: z.string().optional(),
  title: z.string().min(1).optional(),
  accessLevel: z.number().int().min(1).max(4).optional(),
  ownerContact: z.string().optional(),
  publicTeaser: z.string().optional(),
  variantLabel: z.string().optional(),
  variantInterface: z.string().optional(),
});

export const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      })
    )
    .min(1)
    .max(20),
});

export type IngestInput = z.infer<typeof ingestSchema>;
export type ChatInput = z.infer<typeof chatSchema>;
