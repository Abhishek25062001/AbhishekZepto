import { z } from 'zod';

export const adminCancelOrderSchema = z.object({
  reason: z.string().trim().min(1).max(500),
});

export type AdminCancelOrderFormValues = z.infer<typeof adminCancelOrderSchema>;
