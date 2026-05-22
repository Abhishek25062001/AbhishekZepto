import { z } from 'zod';

export const adminOrderStatusUpdateSchema = z.object({
  reason: z.string().trim().min(1).max(500).optional(),
  status: z.enum(['placed', 'accepted', 'picking', 'packing', 'ready_for_pickup', 'cancelled']),
});

export type AdminOrderStatusUpdateFormValues = z.infer<typeof adminOrderStatusUpdateSchema>;
