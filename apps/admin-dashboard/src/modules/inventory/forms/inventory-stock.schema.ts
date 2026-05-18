import { z } from 'zod';
import { INVENTORY_STOCK_STATUS } from '../constants/inventory.constants';

export const inventoryStockFormSchema = z.object({
  storeProductId: z.string().min(1, 'Store product is required'),
  availableQuantity: z.coerce.number().min(0),
  reservedQuantity: z.coerce.number().min(0).optional().default(0),
  damagedQuantity: z.coerce.number().min(0).optional().default(0),
  expiredQuantity: z.coerce.number().min(0).optional().default(0),
  lowStockThreshold: z.coerce.number().min(0).optional().default(0),
  reorderLevel: z.coerce.number().min(0).optional().default(0),
  status: z.enum([
    INVENTORY_STOCK_STATUS.ACTIVE,
    INVENTORY_STOCK_STATUS.INACTIVE,
    INVENTORY_STOCK_STATUS.ARCHIVED,
  ]),
});

export type InventoryStockFormInput = z.input<typeof inventoryStockFormSchema>;
export type InventoryStockFormSchemaValues = z.output<typeof inventoryStockFormSchema>;
