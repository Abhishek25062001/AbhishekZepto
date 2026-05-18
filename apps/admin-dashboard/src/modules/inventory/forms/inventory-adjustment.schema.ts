import { z } from 'zod';
import { ADJUSTMENT_MODE, MOVEMENT_TYPE } from '../constants/inventory.constants';

export const inventoryAdjustmentFormSchema = z.object({
  movementType: z.enum([
    MOVEMENT_TYPE.MANUAL_ADJUSTMENT,
    MOVEMENT_TYPE.STOCK_IN,
    MOVEMENT_TYPE.STOCK_OUT,
    MOVEMENT_TYPE.DAMAGED,
    MOVEMENT_TYPE.EXPIRED,
    MOVEMENT_TYPE.CORRECTION,
  ]),
  quantity: z.coerce.number().positive('Quantity must be greater than zero'),
  reason: z.string().min(1, 'Reason is required'),
  adjustmentMode: z
    .enum([ADJUSTMENT_MODE.ADD, ADJUSTMENT_MODE.SUBTRACT, ADJUSTMENT_MODE.SET])
    .optional(),
  notes: z.string().optional(),
});

export type InventoryAdjustmentFormInput = z.input<typeof inventoryAdjustmentFormSchema>;
export type InventoryAdjustmentFormSchemaValues = z.output<typeof inventoryAdjustmentFormSchema>;
