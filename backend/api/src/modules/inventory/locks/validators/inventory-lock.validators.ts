import { z } from 'zod';
import { mongoObjectIdValidator, paginationValidator } from '../../../../validators/common.validators';
import { INVENTORY_LOCK_STATUS_VALUES } from '../constants/inventory-lock-status.constant';
import { INVENTORY_LOCK_TYPE_VALUES } from '../constants/inventory-lock-type.constant';

export const inventoryLockIdParamsValidator = z
  .object({
    lockId: mongoObjectIdValidator,
  })
  .strict();

export const inventoryLockTokenParamsValidator = z
  .object({
    lockToken: z.string().trim().min(1),
  })
  .strict();

export const createInventoryLockBodyValidator = z
  .object({
    inventoryStockId: mongoObjectIdValidator,
    storeProductId: mongoObjectIdValidator,
    quantity: z.number().int().positive(),
    lockType: z.enum(INVENTORY_LOCK_TYPE_VALUES),
    customerId: mongoObjectIdValidator.optional(),
    cartId: mongoObjectIdValidator.optional(),
    orderId: mongoObjectIdValidator.optional(),
    expiresAt: z.string().datetime().optional(),
    metadata: z.record(z.unknown()).optional(),
  })
  .strict();

export const releaseInventoryLockBodyValidator = z
  .object({
    releaseReason: z.string().trim().min(1),
    metadata: z.record(z.unknown()).optional(),
  })
  .strict();

export const confirmInventoryLockBodyValidator = z
  .object({
    confirmationReason: z.string().trim().min(1),
    orderId: mongoObjectIdValidator.optional(),
    metadata: z.record(z.unknown()).optional(),
  })
  .strict();

export const listInventoryLocksQueryValidator = paginationValidator
  .extend({
    storeId: mongoObjectIdValidator.optional(),
    vendorId: mongoObjectIdValidator.optional(),
    cityId: mongoObjectIdValidator.optional(),
    inventoryStockId: mongoObjectIdValidator.optional(),
    storeProductId: mongoObjectIdValidator.optional(),
    customerId: mongoObjectIdValidator.optional(),
    cartId: mongoObjectIdValidator.optional(),
    orderId: mongoObjectIdValidator.optional(),
    lockType: z.enum(INVENTORY_LOCK_TYPE_VALUES).optional(),
    status: z.enum(INVENTORY_LOCK_STATUS_VALUES).optional(),
    expiresBefore: z.string().datetime().optional(),
    expiresAfter: z.string().datetime().optional(),
    sortBy: z.enum(['createdAt', 'expiresAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  })
  .strict();
