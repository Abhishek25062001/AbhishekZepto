import { z } from 'zod';

export const vendorCancelOrderSchema = z.object({
  reason: z.string().trim().min(1, 'Cancellation reason is required.').max(500),
});

export type VendorCancelOrderInput = z.input<typeof vendorCancelOrderSchema>;
export type VendorCancelOrderValues = z.output<typeof vendorCancelOrderSchema>;
