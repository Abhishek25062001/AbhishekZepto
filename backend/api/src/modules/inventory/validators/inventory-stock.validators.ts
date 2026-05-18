import { z } from 'zod';
import { mongoObjectIdValidator, paginationValidator } from '../../../validators/common.validators';
import { INVENTORY_BULK_DUPLICATE_MODE_VALUES } from '../constants/inventory-bulk-duplicate-mode.constant';
import { INVENTORY_ADJUSTMENT_MODE_VALUES } from '../constants/inventory-adjustment-mode.constant';
import { INVENTORY_STOCK_STATUS_VALUES } from '../constants/inventory-stock-status.constant';
import {
  ADMIN_INVENTORY_ADJUSTMENT_TYPES,
  INVENTORY_MOVEMENT_TYPE_VALUES,
  VENDOR_INVENTORY_ADJUSTMENT_TYPES,
} from '../movements/constants/inventory-movement-type.constant';
import { INVENTORY_REFERENCE_TYPE_VALUES } from '../movements/constants/inventory-reference-type.constant';

const nonNegativeNumber = z.number().min(0);
const positiveNumber = z.number().positive();

export const inventoryStockIdParamsValidator = z
  .object({
    inventoryStockId: mongoObjectIdValidator,
  })
  .strict();

export const inventoryMovementIdParamsValidator = z
  .object({
    movementId: mongoObjectIdValidator,
  })
  .strict();

export const createInventoryStockBodyValidator = z
  .object({
    storeProductId: mongoObjectIdValidator,
    availableQuantity: nonNegativeNumber,
    reservedQuantity: nonNegativeNumber.optional(),
    damagedQuantity: nonNegativeNumber.optional(),
    expiredQuantity: nonNegativeNumber.optional(),
    lowStockThreshold: nonNegativeNumber.optional(),
    reorderLevel: nonNegativeNumber.optional(),
  })
  .strict();

export const updateInventoryStockBodyValidator = z
  .object({
    lowStockThreshold: nonNegativeNumber.optional(),
    reorderLevel: nonNegativeNumber.optional(),
    status: z.enum(INVENTORY_STOCK_STATUS_VALUES).optional(),
  })
  .strict();

export const listInventoryStocksQueryValidator = paginationValidator
  .extend({
    storeId: mongoObjectIdValidator.optional(),
    vendorId: mongoObjectIdValidator.optional(),
    cityId: mongoObjectIdValidator.optional(),
    storeProductId: mongoObjectIdValidator.optional(),
    productId: mongoObjectIdValidator.optional(),
    variantId: mongoObjectIdValidator.optional(),
    sku: z.string().trim().min(1).optional(),
    isLowStock: z.coerce.boolean().optional(),
    isOutOfStock: z.coerce.boolean().optional(),
    status: z.enum(INVENTORY_STOCK_STATUS_VALUES).optional(),
    search: z.string().trim().min(1).optional(),
    sortBy: z.enum(['createdAt', 'availableQuantity', 'sku']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  })
  .strict();

const adjustmentBodyBase = z.object({
  movementType: z.enum(ADMIN_INVENTORY_ADJUSTMENT_TYPES),
  quantity: positiveNumber,
  reason: z.string().trim().min(1),
  referenceType: z.enum(INVENTORY_REFERENCE_TYPE_VALUES).optional(),
  referenceId: z.string().trim().min(1).optional(),
  notes: z.string().trim().min(1).optional(),
  adjustmentMode: z.enum(INVENTORY_ADJUSTMENT_MODE_VALUES).optional(),
});

export const adminInventoryAdjustBodyValidator = adjustmentBodyBase.strict();

export const vendorInventoryAdjustBodyValidator = z
  .object({
    movementType: z.enum(VENDOR_INVENTORY_ADJUSTMENT_TYPES),
    quantity: positiveNumber,
    reason: z.string().trim().min(1),
    notes: z.string().trim().min(1).optional(),
  })
  .strict();

export const bulkUploadInventoryBodyValidator = z
  .object({
    items: z
      .array(
        z
          .object({
            storeProductId: mongoObjectIdValidator,
            availableQuantity: nonNegativeNumber,
            lowStockThreshold: nonNegativeNumber.optional(),
            reorderLevel: nonNegativeNumber.optional(),
          })
          .strict(),
      )
      .min(1),
    duplicateMode: z.enum(INVENTORY_BULK_DUPLICATE_MODE_VALUES).optional(),
  })
  .strict();

export const bulkThresholdInventoryBodyValidator = z
  .object({
    inventoryStockIds: z.array(mongoObjectIdValidator).min(1),
    lowStockThreshold: nonNegativeNumber.optional(),
    reorderLevel: nonNegativeNumber.optional(),
  })
  .strict();

export const listInventoryMovementsQueryValidator = paginationValidator
  .extend({
    storeId: mongoObjectIdValidator.optional(),
    vendorId: mongoObjectIdValidator.optional(),
    cityId: mongoObjectIdValidator.optional(),
    inventoryStockId: mongoObjectIdValidator.optional(),
    storeProductId: mongoObjectIdValidator.optional(),
    productId: mongoObjectIdValidator.optional(),
    variantId: mongoObjectIdValidator.optional(),
    movementType: z.enum(INVENTORY_MOVEMENT_TYPE_VALUES).optional(),
    referenceType: z.enum(INVENTORY_REFERENCE_TYPE_VALUES).optional(),
    referenceId: z.string().trim().min(1).optional(),
    fromDate: z.string().datetime().optional(),
    toDate: z.string().datetime().optional(),
    sortBy: z.enum(['createdAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  })
  .strict();
