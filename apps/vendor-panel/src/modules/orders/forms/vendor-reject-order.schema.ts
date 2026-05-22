import { z } from 'zod';

export const vendorRejectOrderSchema = z.object({
  reason: z.string().trim().min(1, 'Rejection reason is required.').max(500),
});

export type VendorRejectOrderInput = z.input<typeof vendorRejectOrderSchema>;
export type VendorRejectOrderValues = z.output<typeof vendorRejectOrderSchema>;
