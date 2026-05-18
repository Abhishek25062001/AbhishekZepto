import { Types } from 'mongoose';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES, type ErrorCode } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { writeAuditLog, type AuditActorSurface } from '../../audit';
import { INVENTORY_REFERENCE_TYPE } from '../movements/constants/inventory-reference-type.constant';
import {
  ADMIN_INVENTORY_ADJUSTMENT_TYPES,
  INVENTORY_MOVEMENT_TYPE,
} from '../movements/constants/inventory-movement-type.constant';
import { createInventoryMovement } from '../movements/services/inventory-movement.service';
import { INVENTORY_ADJUSTMENT_MODE } from '../constants/inventory-adjustment-mode.constant';
import { INVENTORY_AUDIT_EVENTS } from '../constants/inventory-audit-events.constant';
import { INVENTORY_BULK_DUPLICATE_MODE } from '../constants/inventory-bulk-duplicate-mode.constant';
import {
  INVENTORY_ERROR_CODES,
  type InventoryErrorCode,
} from '../constants/inventory-error-codes.constant';
import { INVENTORY_STOCK_STATUS } from '../constants/inventory-stock-status.constant';
import type { InventoryStockRecord } from '../models/inventory-stock.model';
import {
  createInventoryStock as createInventoryStockRecord,
  findInventoryStockById,
  findInventoryStockByStoreProduct,
  listInventoryStocks as listInventoryStocksRecord,
  softDeleteInventoryStockById,
  updateInventoryStockById,
} from '../repositories/inventory-stock.repository';
import type {
  BulkInventoryThresholdInput,
  BulkInventoryUploadInput,
  CreateInventoryStockInput,
  InventoryAdjustmentInput,
  InventoryStockListQuery,
  UpdateInventoryStockInput,
} from '../types/inventory-stock.types';
import { calculateStockFlags, calculateTotalQuantity } from '../utils/inventory-quantity.util';
import { toInventoryStockResponse } from '../utils/inventory-stock-response.mapper';
import { assertStoreProductForInventory } from './inventory-stock-reference.service';

const inventoryError = (code: InventoryErrorCode): ErrorCode => ERROR_CODES[code];

const toObjectIdOrNull = (value: string): Types.ObjectId | null =>
  Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : null;

const buildQuantitySnapshot = (stock: InventoryStockRecord) => ({
  available: stock.availableQuantity,
  reserved: stock.reservedQuantity,
  damaged: stock.damagedQuantity,
  expired: stock.expiredQuantity,
  total: stock.totalQuantity,
});

const applyAdjustmentQuantities = (
  stock: InventoryStockRecord,
  input: InventoryAdjustmentInput,
): Pick<InventoryStockRecord, 'availableQuantity' | 'damagedQuantity' | 'expiredQuantity'> => {
  let available = stock.availableQuantity;
  let damaged = stock.damagedQuantity;
  let expired = stock.expiredQuantity;

  switch (input.movementType) {
    case INVENTORY_MOVEMENT_TYPE.STOCK_IN:
      available += input.quantity;
      break;
    case INVENTORY_MOVEMENT_TYPE.STOCK_OUT:
      available -= input.quantity;
      break;
    case INVENTORY_MOVEMENT_TYPE.MANUAL_ADJUSTMENT: {
      const mode = input.adjustmentMode ?? INVENTORY_ADJUSTMENT_MODE.INCREASE;
      if (mode === INVENTORY_ADJUSTMENT_MODE.INCREASE) {
        available += input.quantity;
      } else if (mode === INVENTORY_ADJUSTMENT_MODE.DECREASE) {
        available -= input.quantity;
      } else {
        available = input.quantity;
      }
      break;
    }
    case INVENTORY_MOVEMENT_TYPE.DAMAGED:
      available -= input.quantity;
      damaged += input.quantity;
      break;
    case INVENTORY_MOVEMENT_TYPE.EXPIRED:
      available -= input.quantity;
      expired += input.quantity;
      break;
    case INVENTORY_MOVEMENT_TYPE.CORRECTION:
      available = input.quantity;
      break;
    default:
      throw new AppError({
        message: 'Invalid inventory movement type',
        statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
        errorCode: inventoryError(INVENTORY_ERROR_CODES.INVALID_INVENTORY_MOVEMENT_TYPE),
      });
  }

  if (available < 0 || damaged < 0 || expired < 0) {
    throw new AppError({
      message: 'Insufficient available stock for adjustment',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: inventoryError(INVENTORY_ERROR_CODES.INSUFFICIENT_AVAILABLE_STOCK),
    });
  }

  return { availableQuantity: available, damagedQuantity: damaged, expiredQuantity: expired };
};

const recordMovementForStock = async (
  stock: InventoryStockRecord & { _id: Types.ObjectId },
  before: ReturnType<typeof buildQuantitySnapshot>,
  afterQuantities: Pick<InventoryStockRecord, 'availableQuantity' | 'damagedQuantity' | 'expiredQuantity'>,
  input: InventoryAdjustmentInput,
  actorUserId: string,
) => {
  const afterTotal = calculateTotalQuantity(
    afterQuantities.availableQuantity,
    stock.reservedQuantity,
    afterQuantities.damagedQuantity,
    afterQuantities.expiredQuantity,
  );

  return createInventoryMovement({
    storeId: stock.storeId.toString(),
    vendorId: stock.vendorId.toString(),
    cityId: stock.cityId.toString(),
    inventoryStockId: stock._id.toString(),
    storeProductId: stock.storeProductId.toString(),
    productId: stock.productId.toString(),
    variantId: stock.variantId.toString(),
    movementType: input.movementType,
    quantity: input.quantity,
    previousAvailableQuantity: before.available,
    newAvailableQuantity: afterQuantities.availableQuantity,
    previousReservedQuantity: before.reserved,
    newReservedQuantity: stock.reservedQuantity,
    previousTotalQuantity: before.total,
    newTotalQuantity: afterTotal,
    reason: input.reason,
    referenceType: input.referenceType ?? INVENTORY_REFERENCE_TYPE.MANUAL,
    referenceId: input.referenceId ?? null,
    notes: input.notes ?? null,
    createdBy: actorUserId,
  });
};

const finalizeStockQuantities = (
  stock: InventoryStockRecord,
  quantities: Pick<InventoryStockRecord, 'availableQuantity' | 'damagedQuantity' | 'expiredQuantity'>,
  lowStockThreshold: number,
) => {
  const totalQuantity = calculateTotalQuantity(
    quantities.availableQuantity,
    stock.reservedQuantity,
    quantities.damagedQuantity,
    quantities.expiredQuantity,
  );
  const flags = calculateStockFlags(quantities.availableQuantity, lowStockThreshold);

  return {
    ...quantities,
    totalQuantity,
    ...flags,
  };
};

export const createInventoryStock = async (input: CreateInventoryStockInput, actorUserId: string) => {
  const mapping = await assertStoreProductForInventory(input.storeProductId);
  const storeId = mapping.storeId.toString();

  const duplicate = await findInventoryStockByStoreProduct(storeId, input.storeProductId);

  if (duplicate) {
    throw new AppError({
      message: 'Inventory stock already exists for store product',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: inventoryError(INVENTORY_ERROR_CODES.INVENTORY_STOCK_ALREADY_EXISTS),
    });
  }

  const reservedQuantity = input.reservedQuantity ?? 0;
  const damagedQuantity = input.damagedQuantity ?? 0;
  const expiredQuantity = input.expiredQuantity ?? 0;
  const lowStockThreshold = input.lowStockThreshold ?? 0;
  const reorderLevel = input.reorderLevel ?? 0;
  const quantityFields = finalizeStockQuantities(
    {
      reservedQuantity,
      damagedQuantity,
      expiredQuantity,
    } as InventoryStockRecord,
    {
      availableQuantity: input.availableQuantity,
      damagedQuantity,
      expiredQuantity,
    },
    lowStockThreshold,
  );

  const now = new Date();
  const actorId = toObjectIdOrNull(actorUserId);

  const created = await createInventoryStockRecord({
    storeId: mapping.storeId,
    vendorId: mapping.vendorId,
    cityId: mapping.cityId,
    storeProductId: mapping._id,
    productId: mapping.productId,
    variantId: mapping.variantId,
    sku: mapping.sku,
    storeSku: mapping.storeSku,
    reservedQuantity,
    reorderLevel,
    lowStockThreshold,
    lastStockUpdatedAt: now,
    status: INVENTORY_STOCK_STATUS.ACTIVE,
    isDeleted: false,
    deletedAt: null,
    createdBy: actorId,
    updatedBy: actorId,
    ...quantityFields,
  });

  const movement = await recordMovementForStock(
    created,
    { available: 0, reserved: 0, damaged: 0, expired: 0, total: 0 },
    {
      availableQuantity: created.availableQuantity,
      damagedQuantity: created.damagedQuantity,
      expiredQuantity: created.expiredQuantity,
    },
    {
      movementType: INVENTORY_MOVEMENT_TYPE.STOCK_IN,
      quantity: created.availableQuantity,
      reason: 'Opening stock created',
      referenceType: INVENTORY_REFERENCE_TYPE.MANUAL,
    },
    actorUserId,
  );

  const withMovement = await updateInventoryStockById(created._id.toString(), {
    lastStockMovementId: new Types.ObjectId(movement.id),
  });

  await writeAuditLog({
    eventType: INVENTORY_AUDIT_EVENTS.INVENTORY_STOCK_CREATED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'inventory_stock',
    entityId: created._id,
    vendorId: created.vendorId,
    storeId: created.storeId,
    cityId: created.cityId,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: { storeProductId: created.storeProductId.toString() },
    status: 'success',
  });

  return toInventoryStockResponse(withMovement ?? created);
};

export const getInventoryStockById = async (inventoryStockId: string) => {
  const stock = await findInventoryStockById(inventoryStockId);

  if (!stock) {
    throw new AppError({
      message: 'Inventory stock not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: inventoryError(INVENTORY_ERROR_CODES.INVENTORY_STOCK_NOT_FOUND),
    });
  }

  return toInventoryStockResponse(stock);
};

export const listInventoryStocks = async (query: InventoryStockListQuery) => {
  const response = await listInventoryStocksRecord(query);

  return {
    items: response.items.map(toInventoryStockResponse),
    pagination: {
      page: query.page,
      limit: query.limit,
      total: response.total,
      totalPages: Math.max(1, Math.ceil(response.total / query.limit)),
      hasNextPage: query.page * query.limit < response.total,
      hasPreviousPage: query.page > 1,
    },
  };
};

export const updateInventoryStockSettings = async (
  inventoryStockId: string,
  input: UpdateInventoryStockInput,
  actorUserId: string,
) => {
  const existing = await findInventoryStockById(inventoryStockId);

  if (!existing) {
    throw new AppError({
      message: 'Inventory stock not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: inventoryError(INVENTORY_ERROR_CODES.INVENTORY_STOCK_NOT_FOUND),
    });
  }

  const lowStockThreshold = input.lowStockThreshold ?? existing.lowStockThreshold;
  const flags = calculateStockFlags(existing.availableQuantity, lowStockThreshold);
  const actorId = toObjectIdOrNull(actorUserId);

  const updated = await updateInventoryStockById(inventoryStockId, {
    ...(input.lowStockThreshold !== undefined ? { lowStockThreshold: input.lowStockThreshold } : {}),
    ...(input.reorderLevel !== undefined ? { reorderLevel: input.reorderLevel } : {}),
    ...(input.status !== undefined ? { status: input.status } : {}),
    ...flags,
    updatedBy: actorId,
  });

  if (!updated) {
    throw new AppError({
      message: 'Inventory stock not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: inventoryError(INVENTORY_ERROR_CODES.INVENTORY_STOCK_NOT_FOUND),
    });
  }

  await writeAuditLog({
    eventType: INVENTORY_AUDIT_EVENTS.INVENTORY_STOCK_UPDATED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'inventory_stock',
    entityId: updated._id,
    vendorId: updated.vendorId,
    storeId: updated.storeId,
    cityId: updated.cityId,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: { inventoryStockId },
    status: 'success',
  });

  return toInventoryStockResponse(updated);
};

export const adjustInventoryStock = async (
  inventoryStockId: string,
  input: InventoryAdjustmentInput,
  actorUserId: string,
  options?: {
    allowedMovementTypes?: readonly string[];
    auditEvent?: string;
    actorSurface?: AuditActorSurface;
  },
) => {
  if (
    options?.allowedMovementTypes &&
    !options.allowedMovementTypes.includes(input.movementType)
  ) {
    throw new AppError({
      message: 'Invalid inventory movement type for this operation',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: inventoryError(INVENTORY_ERROR_CODES.INVALID_INVENTORY_MOVEMENT_TYPE),
    });
  }

  const existing = await findInventoryStockById(inventoryStockId);

  if (!existing) {
    throw new AppError({
      message: 'Inventory stock not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: inventoryError(INVENTORY_ERROR_CODES.INVENTORY_STOCK_NOT_FOUND),
    });
  }

  const before = buildQuantitySnapshot(existing);
  const afterQuantities = applyAdjustmentQuantities(existing, input);
  const quantityFields = finalizeStockQuantities(existing, afterQuantities, existing.lowStockThreshold);
  const now = new Date();
  const actorId = toObjectIdOrNull(actorUserId);

  const movement = await recordMovementForStock(existing, before, afterQuantities, input, actorUserId);

  const updated = await updateInventoryStockById(inventoryStockId, {
    ...quantityFields,
    lastStockUpdatedAt: now,
    lastStockMovementId: new Types.ObjectId(movement.id),
    updatedBy: actorId,
  });

  if (!updated) {
    throw new AppError({
      message: 'Inventory stock not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: inventoryError(INVENTORY_ERROR_CODES.INVENTORY_STOCK_NOT_FOUND),
    });
  }

  await writeAuditLog({
    eventType: options?.auditEvent ?? INVENTORY_AUDIT_EVENTS.INVENTORY_STOCK_ADJUSTED,
    actorId,
    actorRole: null,
    actorSurface: options?.actorSurface ?? 'admin_dashboard',
    entityType: 'inventory_stock',
    entityId: updated._id,
    vendorId: updated.vendorId,
    storeId: updated.storeId,
    cityId: updated.cityId,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: { movementType: input.movementType, quantity: input.quantity },
    status: 'success',
  });

  return toInventoryStockResponse(updated);
};

export const adjustInventoryStockAdmin = async (
  inventoryStockId: string,
  input: InventoryAdjustmentInput,
  actorUserId: string,
) =>
  adjustInventoryStock(inventoryStockId, input, actorUserId, {
    allowedMovementTypes: ADMIN_INVENTORY_ADJUSTMENT_TYPES,
    auditEvent: INVENTORY_AUDIT_EVENTS.INVENTORY_STOCK_ADJUSTED,
    actorSurface: 'admin_dashboard',
  });

export const deleteInventoryStock = async (inventoryStockId: string, actorUserId: string) => {
  const existing = await findInventoryStockById(inventoryStockId);

  if (!existing) {
    throw new AppError({
      message: 'Inventory stock not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: inventoryError(INVENTORY_ERROR_CODES.INVENTORY_STOCK_NOT_FOUND),
    });
  }

  if (existing.reservedQuantity > 0) {
    throw new AppError({
      message: 'Inventory stock has reserved quantity and cannot be deleted',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: inventoryError(INVENTORY_ERROR_CODES.INVENTORY_RESERVED_STOCK_EXISTS),
    });
  }

  const actorId = toObjectIdOrNull(actorUserId);
  const deleted = await softDeleteInventoryStockById(inventoryStockId, actorId);

  if (!deleted) {
    throw new AppError({
      message: 'Inventory stock not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: inventoryError(INVENTORY_ERROR_CODES.INVENTORY_STOCK_NOT_FOUND),
    });
  }

  await writeAuditLog({
    eventType: INVENTORY_AUDIT_EVENTS.INVENTORY_STOCK_DELETED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'inventory_stock',
    entityId: deleted._id,
    vendorId: deleted.vendorId,
    storeId: deleted.storeId,
    cityId: deleted.cityId,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: { inventoryStockId },
    status: 'success',
  });

  return toInventoryStockResponse(deleted);
};

export const bulkUploadInventoryStocks = async (
  input: BulkInventoryUploadInput,
  actorUserId: string,
) => {
  const duplicateMode = input.duplicateMode ?? INVENTORY_BULK_DUPLICATE_MODE.FAIL;
  const actorId = toObjectIdOrNull(actorUserId);
  let created = 0;
  let replaced = 0;
  let skipped = 0;
  let failed = 0;
  const errors: { index: number; message: string }[] = [];

  for (const [index, item] of input.items.entries()) {
    try {
      const mapping = await assertStoreProductForInventory(item.storeProductId);
      const storeId = mapping.storeId.toString();
      const existing = await findInventoryStockByStoreProduct(storeId, item.storeProductId);

      if (existing && duplicateMode === INVENTORY_BULK_DUPLICATE_MODE.SKIP) {
        skipped += 1;
        continue;
      }

      if (existing && duplicateMode === INVENTORY_BULK_DUPLICATE_MODE.FAIL) {
        failed += 1;
        errors.push({ index, message: 'Inventory stock already exists' });
        continue;
      }

      if (existing && duplicateMode === INVENTORY_BULK_DUPLICATE_MODE.REPLACE) {
        await adjustInventoryStockAdmin(
          existing._id.toString(),
          {
            movementType: INVENTORY_MOVEMENT_TYPE.CORRECTION,
            quantity: item.availableQuantity,
            reason: 'Bulk upload replacement',
            referenceType: INVENTORY_REFERENCE_TYPE.IMPORT,
          },
          actorUserId,
        );
        await updateInventoryStockById(existing._id.toString(), {
          lowStockThreshold: item.lowStockThreshold ?? existing.lowStockThreshold,
          reorderLevel: item.reorderLevel ?? existing.reorderLevel,
          updatedBy: actorId,
        });
        replaced += 1;
        continue;
      }

      await createInventoryStock(
        {
          storeProductId: item.storeProductId,
          availableQuantity: item.availableQuantity,
          lowStockThreshold: item.lowStockThreshold,
          reorderLevel: item.reorderLevel,
        },
        actorUserId,
      );
      created += 1;
    } catch (error) {
      failed += 1;
      errors.push({
        index,
        message: error instanceof Error ? error.message : 'Bulk upload item failed',
      });
    }
  }

  await writeAuditLog({
    eventType: INVENTORY_AUDIT_EVENTS.INVENTORY_BULK_UPLOADED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'inventory_stock',
    entityId: null,
    vendorId: null,
    storeId: null,
    cityId: null,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: { created, replaced, skipped, failed },
    status: 'success',
  });

  return { created, replaced, skipped, failed, errors };
};

export const bulkUpdateInventoryThresholds = async (
  input: BulkInventoryThresholdInput,
  actorUserId: string,
) => {
  const actorId = toObjectIdOrNull(actorUserId);
  let affected = 0;

  for (const stockId of input.inventoryStockIds) {
    const existing = await findInventoryStockById(stockId);

    if (!existing) {
      continue;
    }

    const lowStockThreshold = input.lowStockThreshold ?? existing.lowStockThreshold;
    const flags = calculateStockFlags(existing.availableQuantity, lowStockThreshold);

    const updated = await updateInventoryStockById(stockId, {
      ...(input.lowStockThreshold !== undefined ? { lowStockThreshold: input.lowStockThreshold } : {}),
      ...(input.reorderLevel !== undefined ? { reorderLevel: input.reorderLevel } : {}),
      ...flags,
      updatedBy: actorId,
    });

    if (updated) {
      affected += 1;
    }
  }

  await writeAuditLog({
    eventType: INVENTORY_AUDIT_EVENTS.INVENTORY_BULK_THRESHOLDS_UPDATED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'inventory_stock',
    entityId: null,
    vendorId: null,
    storeId: null,
    cityId: null,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: { affected },
    status: 'success',
  });

  return { affected };
};
