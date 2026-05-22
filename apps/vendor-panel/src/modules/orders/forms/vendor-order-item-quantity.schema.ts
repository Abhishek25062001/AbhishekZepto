import { z } from 'zod';

export const vendorOrderItemQuantitySchema = z.object({
  quantity: z.coerce
    .number()
    .int('Quantity must be a whole number.')
    .positive('Quantity must be greater than zero.'),
});

export type VendorOrderItemQuantityInput = z.input<typeof vendorOrderItemQuantitySchema>;
export type VendorOrderItemQuantityValues = z.output<typeof vendorOrderItemQuantitySchema>;
