import { z } from 'zod';

import { VENDOR_MOVEMENT_TYPE } from '../constants/vendor-inventory.constants';

export const vendorInventoryAdjustmentSchema = z.object({
  movementType: z.enum([
    VENDOR_MOVEMENT_TYPE.STOCK_IN,
    VENDOR_MOVEMENT_TYPE.STOCK_OUT,
    VENDOR_MOVEMENT_TYPE.DAMAGED,
    VENDOR_MOVEMENT_TYPE.EXPIRED,
    VENDOR_MOVEMENT_TYPE.CORRECTION,
  ]),
  quantity: z.coerce.number().positive('Quantity must be greater than zero'),
  reason: z.string().min(1, 'Reason is required'),
  notes: z.string().optional(),
});

export type VendorInventoryAdjustmentInput = z.input<typeof vendorInventoryAdjustmentSchema>;
export type VendorInventoryAdjustmentValues = z.output<typeof vendorInventoryAdjustmentSchema>;
