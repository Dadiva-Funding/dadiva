import { z } from "zod";

export const ZApplicationCreateSchema = z.object({
  grantId: z.string(),
  roundId: z.string(),
});

export const ZApplicationApproveSchema = z.object({
  ids: z.array(z.string()),
  roundId: z.string(),
});

export const ZApplicationListSchema = z.object({
  roundId: z.string(),
  showAll: z.boolean().optional(),
});

export type TApplicationCreate = z.infer<typeof ZApplicationCreateSchema>;
export type TApplicationApprove = z.infer<typeof ZApplicationApproveSchema>;
