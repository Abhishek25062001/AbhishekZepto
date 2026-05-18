import { Types } from 'mongoose';
import { AppError } from '../../../../errors/AppError';
import { ERROR_CODES, type ErrorCode } from '../../../../errors/error-codes';
import { HTTP_STATUS } from '../../../../utils/http-status';
import { writeAuditLog, type AuditActorSurface } from '../../../audit';
import { INVENTORY_REFERENCE_TYPE } from '../../movements/constants/inventory-reference-type.constant';
import { INVENTORY_MOVEMENT_TYPE } from '../../movements/constants/inventory-movement-type.constant';
import { createInventoryMovement } from '../../movements/services/inventory-movement.service';
import { INVENTORY_STOCK_STATUS } from '../../constants/inventory-stock-status.constant';
import type { InventoryStockRecord } from '../../models/inventory-stock.model';
import { findInventoryStockById, updateInventoryStockById } from '../../repositories/inventory-stock.repository';
import { calculateStockFlags, calculateTotalQuantity } from '../../utils/inventory-quantity.util';
import { INVENTORY_LOCK_AUDIT_EVENTS } from '../constants/inventory-lock-audit-events.constant';
import {
  INVENTORY_LOCK_ERROR_CODES,
  type InventoryLockErrorCode,
} from '../constants/inventory-lock-error-codes.constant';
import { INVENTORY_LOCK_STATUS } from '../constants/inventory-lock-status.constant';
import type { InventoryLockRecord } from '../models/inventory-lock.model';
import {
  createInventoryLock as createInventoryLockRecord,
  findExpiredActiveLocks,
  findInventoryLockById,
  findInventoryLockByToken,
  listInventoryLocks as listInventoryLocksRecord,
  markLockConfirmed,
  markLockExpired,
  markLockReleased,
} from '../repositories/inventory-lock.repository';
import type {
  ConfirmInventoryLockInput,
  CreateInventoryLockInput,
  ExpireDueLocksSummary,
  InventoryLockListQuery,
  ReleaseInventoryLockInput,
} from '../types/inventory-lock.types';
import { calculateLockExpiry } from '../utils/inventory-lock-expiry.util';
import { toInventoryLockResponse } from '../utils/inventory-lock-response.mapper';
import { generateInventoryLockToken } from '../utils/inventory-lock-token.util';
import { assertInventoryStockForLock } from './inventory-lock-reference.service';

const lockError = (code: InventoryLockErrorCode): ErrorCode => ERROR_CODES[code];

const toObjectIdOrNull = (value?: string): Types.ObjectId | null =>
  value && Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : null;

const buildQuantitySnapshot = (stock: InventoryStockRecord) => ({
  available: stock.availableQuantity,
  reserved: stock.reservedQuantity,
  damaged: stock.damagedQuantity,
  expired: stock.expiredQuantity,
  total: stock.totalQuantity,
});

const resolveReferenceType = (lock: InventoryLockRecord) => {
  if (lock.orderId) {
    return INVENTORY_REFERENCE_TYPE.ORDER;
  }
  if (lock.cartId) {
    return INVENTORY_REFERENCE_TYPE.CART;
  }
  return INVENTORY_REFERENCE_TYPE.SYSTEM;
};

const resolveReferenceId = (lock: InventoryLockRecord & { _id?: Types.ObjectId }): string | null =>
  lock.orderId?.toString() ?? lock.cartId?.toString() ?? lock._id?.toString() ?? lock.lockToken;

const applyStockReservation = async (
  stock: InventoryStockRecord & { _id: Types.ObjectId },
  quantityDeltaAvailable: number,
  quantityDeltaReserved: number,
  actorUserId: string,
  movementType:
    | typeof INVENTORY_MOVEMENT_TYPE.RESERVATION_CREATED
    | typeof INVENTORY_MOVEMENT_TYPE.RESERVATION_RELEASED
    | typeof INVENTORY_MOVEMENT_TYPE.RESERVATION_CONFIRMED,
  reason: string,
  lock: InventoryLockRecord & { _id: Types.ObjectId },
) => {
  const before = buildQuantitySnapshot(stock);
  const availableQuantity = stock.availableQuantity + quantityDeltaAvailable;
  const reservedQuantity = stock.reservedQuantity + quantityDeltaReserved;

  if (availableQuantity < 0 || reservedQuantity < 0) {
    throw new AppError({
      message: 'Insufficient available stock for lock operation',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: lockError(INVENTORY_LOCK_ERROR_CODES.INVENTORY_LOCK_INSUFFICIENT_STOCK),
    });
  }

  const totalQuantity = calculateTotalQuantity(
    availableQuantity,
    reservedQuantity,
    stock.damagedQuantity,
    stock.expiredQuantity,
  );
  const flags = calculateStockFlags(availableQuantity, stock.lowStockThreshold);

  const movement = await createInventoryMovement({
    storeId: stock.storeId.toString(),
    vendorId: stock.vendorId.toString(),
    cityId: stock.cityId.toString(),
    inventoryStockId: stock._id.toString(),
    storeProductId: stock.storeProductId.toString(),
    productId: stock.productId.toString(),
    variantId: stock.variantId.toString(),
    movementType,
    quantity: lock.quantity,
    previousAvailableQuantity: before.available,
    newAvailableQuantity: availableQuantity,
    previousReservedQuantity: before.reserved,
    newReservedQuantity: reservedQuantity,
    previousTotalQuantity: before.total,
    newTotalQuantity: totalQuantity,
    reason,
    referenceType: resolveReferenceType(lock),
    referenceId: resolveReferenceId(lock),
    notes: null,
    createdBy: actorUserId,
    metadata: lock.metadata ?? undefined,
  });

  const updated = await updateInventoryStockById(stock._id.toString(), {
    availableQuantity,
    reservedQuantity,
    totalQuantity,
    isLowStock: flags.isLowStock,
    isOutOfStock: flags.isOutOfStock,
    lastStockUpdatedAt: new Date(),
    lastStockMovementId: new Types.ObjectId(movement.id),
    updatedBy: toObjectIdOrNull(actorUserId),
  });

  if (!updated) {
    throw new AppError({
      message: 'Inventory stock not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.INVENTORY_STOCK_NOT_FOUND,
    });
  }

  return updated;
};

const writeLockAudit = async (
  eventType: (typeof INVENTORY_LOCK_AUDIT_EVENTS)[keyof typeof INVENTORY_LOCK_AUDIT_EVENTS],
  lock: InventoryLockRecord & { _id: Types.ObjectId },
  actorUserId: string,
  surface: AuditActorSurface = 'backend',
) => {
  await writeAuditLog({
    eventType,
    actorId: toObjectIdOrNull(actorUserId),
    actorRole: null,
    actorSurface: surface,
    entityType: 'inventory_lock',
    entityId: lock._id,
    vendorId: lock.vendorId,
    storeId: lock.storeId,
    cityId: lock.cityId,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      lockToken: lock.lockToken,
      lockType: lock.lockType,
      quantity: lock.quantity,
      status: lock.status,
      inventoryStockId: lock.inventoryStockId.toString(),
    },
    status: 'success',
  });
};

const createLockWithToken = async (
  payload: Partial<InventoryLockRecord>,
  maxAttempts = 3,
): Promise<InventoryLockRecord & { _id: Types.ObjectId }> => {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      return await createInventoryLockRecord({
        ...payload,
        lockToken: payload.lockToken ?? generateInventoryLockToken(),
      });
    } catch (error) {
      const isDuplicate =
        error instanceof Error &&
        'code' in error &&
        (error as { code?: number }).code === 11000;

      if (!isDuplicate || attempt === maxAttempts - 1) {
        if (isDuplicate) {
          throw new AppError({
            message: 'Lock token collision',
            statusCode: HTTP_STATUS.CONFLICT,
            errorCode: lockError(INVENTORY_LOCK_ERROR_CODES.INVENTORY_LOCK_TOKEN_COLLISION),
          });
        }
        throw error;
      }
    }
  }

  throw new AppError({
    message: 'Lock token collision',
    statusCode: HTTP_STATUS.CONFLICT,
    errorCode: lockError(INVENTORY_LOCK_ERROR_CODES.INVENTORY_LOCK_TOKEN_COLLISION),
  });
};

export const createInventoryLock = async (
  input: CreateInventoryLockInput,
  actorUserId: string,
) => {
  if (input.quantity <= 0) {
    throw new AppError({
      message: 'Lock quantity must be positive',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: lockError(INVENTORY_LOCK_ERROR_CODES.INVENTORY_LOCK_QUANTITY_INVALID),
    });
  }

  const stock = await assertInventoryStockForLock(input.inventoryStockId, input.storeProductId);

  if (input.quantity > stock.availableQuantity) {
    throw new AppError({
      message: 'Insufficient available stock for lock',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: lockError(INVENTORY_LOCK_ERROR_CODES.INVENTORY_LOCK_INSUFFICIENT_STOCK),
    });
  }

  const expiresAt = input.expiresAt
    ? new Date(input.expiresAt)
    : calculateLockExpiry(input.lockType);

  if (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() <= Date.now()) {
    throw new AppError({
      message: 'Lock expiry must be in the future',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: lockError(INVENTORY_LOCK_ERROR_CODES.INVENTORY_LOCK_EXPIRY_INVALID),
    });
  }

  const lockDraft: InventoryLockRecord & { _id: Types.ObjectId } = {
    _id: new Types.ObjectId(),
    storeId: stock.storeId,
    vendorId: stock.vendorId,
    cityId: stock.cityId,
    inventoryStockId: stock._id,
    storeProductId: stock.storeProductId,
    productId: stock.productId,
    variantId: stock.variantId,
    customerId: toObjectIdOrNull(input.customerId),
    cartId: toObjectIdOrNull(input.cartId),
    orderId: toObjectIdOrNull(input.orderId),
    lockToken: generateInventoryLockToken(),
    lockType: input.lockType,
    quantity: input.quantity,
    status: INVENTORY_LOCK_STATUS.ACTIVE,
    expiresAt,
    releasedAt: null,
    confirmedAt: null,
    releaseReason: null,
    confirmationReason: null,
    metadata: input.metadata ?? null,
    createdBy: toObjectIdOrNull(actorUserId),
    updatedBy: toObjectIdOrNull(actorUserId),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const updatedStock = await applyStockReservation(
    stock,
    -input.quantity,
    input.quantity,
    actorUserId,
    INVENTORY_MOVEMENT_TYPE.RESERVATION_CREATED,
    `Lock created (${input.lockType})`,
    lockDraft,
  );

  const lock = await createLockWithToken({
    storeId: updatedStock.storeId,
    vendorId: updatedStock.vendorId,
    cityId: updatedStock.cityId,
    inventoryStockId: updatedStock._id,
    storeProductId: updatedStock.storeProductId,
    productId: updatedStock.productId,
    variantId: updatedStock.variantId,
    customerId: lockDraft.customerId,
    cartId: lockDraft.cartId,
    orderId: lockDraft.orderId,
    lockType: input.lockType,
    quantity: input.quantity,
    status: INVENTORY_LOCK_STATUS.ACTIVE,
    expiresAt,
    metadata: input.metadata ?? null,
    createdBy: toObjectIdOrNull(actorUserId),
    updatedBy: toObjectIdOrNull(actorUserId),
  });

  await writeLockAudit(INVENTORY_LOCK_AUDIT_EVENTS.INVENTORY_LOCK_CREATED, lock, actorUserId);

  return toInventoryLockResponse(lock);
};

const loadLockByToken = async (lockToken: string) => {
  const lock = await findInventoryLockByToken(lockToken);

  if (!lock) {
    throw new AppError({
      message: 'Inventory lock not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: lockError(INVENTORY_LOCK_ERROR_CODES.INVENTORY_LOCK_NOT_FOUND),
    });
  }

  return lock;
};

const releaseActiveLock = async (
  lock: InventoryLockRecord & { _id: Types.ObjectId },
  releaseReason: string,
  actorUserId: string,
  surface: AuditActorSurface,
) => {
  const stock = await findInventoryStockById(lock.inventoryStockId.toString());

  if (!stock || stock.isDeleted || stock.status !== INVENTORY_STOCK_STATUS.ACTIVE) {
    throw new AppError({
      message: 'Inventory stock not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.INVENTORY_STOCK_NOT_FOUND,
    });
  }

  await applyStockReservation(
    stock as InventoryStockRecord & { _id: Types.ObjectId },
    lock.quantity,
    -lock.quantity,
    actorUserId,
    INVENTORY_MOVEMENT_TYPE.RESERVATION_RELEASED,
    releaseReason,
    lock,
  );

  const updated = await markLockReleased(lock._id.toString(), releaseReason, toObjectIdOrNull(actorUserId));

  if (!updated) {
    throw new AppError({
      message: 'Inventory lock not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: lockError(INVENTORY_LOCK_ERROR_CODES.INVENTORY_LOCK_NOT_FOUND),
    });
  }

  await writeLockAudit(INVENTORY_LOCK_AUDIT_EVENTS.INVENTORY_LOCK_RELEASED, updated, actorUserId, surface);

  return toInventoryLockResponse(updated);
};

export const releaseInventoryLock = async (
  input: ReleaseInventoryLockInput,
  actorUserId: string,
  surface: AuditActorSurface = 'backend',
) => {
  const lock = await loadLockByToken(input.lockToken);

  if (
    lock.status === INVENTORY_LOCK_STATUS.RELEASED ||
    lock.status === INVENTORY_LOCK_STATUS.EXPIRED ||
    lock.status === INVENTORY_LOCK_STATUS.CANCELLED
  ) {
    return toInventoryLockResponse(lock);
  }

  if (lock.status === INVENTORY_LOCK_STATUS.CONFIRMED) {
    throw new AppError({
      message: 'Cannot release a confirmed lock',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: lockError(INVENTORY_LOCK_ERROR_CODES.INVENTORY_LOCK_RELEASE_BLOCKED),
    });
  }

  if (lock.status !== INVENTORY_LOCK_STATUS.ACTIVE) {
    throw new AppError({
      message: 'Lock is not active',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: lockError(INVENTORY_LOCK_ERROR_CODES.INVENTORY_LOCK_NOT_ACTIVE),
    });
  }

  return releaseActiveLock(
    lock,
    input.releaseReason,
    actorUserId,
    surface,
  );
};

export const confirmInventoryLock = async (
  input: ConfirmInventoryLockInput,
  actorUserId: string,
  surface: AuditActorSurface = 'backend',
) => {
  const lock = await loadLockByToken(input.lockToken);

  if (lock.status === INVENTORY_LOCK_STATUS.CONFIRMED) {
    return toInventoryLockResponse(lock);
  }

  if (
    lock.status === INVENTORY_LOCK_STATUS.RELEASED ||
    lock.status === INVENTORY_LOCK_STATUS.EXPIRED ||
    lock.status === INVENTORY_LOCK_STATUS.CANCELLED
  ) {
    throw new AppError({
      message: 'Cannot confirm a released or expired lock',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: lockError(INVENTORY_LOCK_ERROR_CODES.INVENTORY_LOCK_CONFIRM_BLOCKED),
    });
  }

  if (lock.status !== INVENTORY_LOCK_STATUS.ACTIVE) {
    throw new AppError({
      message: 'Lock is not active',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: lockError(INVENTORY_LOCK_ERROR_CODES.INVENTORY_LOCK_NOT_ACTIVE),
    });
  }

  const stock = await findInventoryStockById(lock.inventoryStockId.toString());

  if (!stock || stock.isDeleted) {
    throw new AppError({
      message: 'Inventory stock not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.INVENTORY_STOCK_NOT_FOUND,
    });
  }

  await applyStockReservation(
    stock as InventoryStockRecord & { _id: Types.ObjectId },
    0,
    -lock.quantity,
    actorUserId,
    INVENTORY_MOVEMENT_TYPE.RESERVATION_CONFIRMED,
    input.confirmationReason,
    lock,
  );

  const orderId = toObjectIdOrNull(input.orderId) ?? lock.orderId;
  const updated = await markLockConfirmed(
    lock._id.toString(),
    input.confirmationReason,
    orderId,
    toObjectIdOrNull(actorUserId),
  );

  if (!updated) {
    throw new AppError({
      message: 'Inventory lock not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: lockError(INVENTORY_LOCK_ERROR_CODES.INVENTORY_LOCK_NOT_FOUND),
    });
  }

  await writeLockAudit(INVENTORY_LOCK_AUDIT_EVENTS.INVENTORY_LOCK_CONFIRMED, updated, actorUserId, surface);

  return toInventoryLockResponse(updated);
};

export const expireInventoryLock = async (
  lockId: string,
  actorUserId: string,
  surface: AuditActorSurface = 'admin_dashboard',
) => {
  const lock = await findInventoryLockById(lockId);

  if (!lock) {
    throw new AppError({
      message: 'Inventory lock not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: lockError(INVENTORY_LOCK_ERROR_CODES.INVENTORY_LOCK_NOT_FOUND),
    });
  }

  if (lock.status !== INVENTORY_LOCK_STATUS.ACTIVE) {
    throw new AppError({
      message: 'Lock is not active',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: lockError(INVENTORY_LOCK_ERROR_CODES.INVENTORY_LOCK_NOT_ACTIVE),
    });
  }

  if (lock.expiresAt.getTime() >= Date.now()) {
    throw new AppError({
      message: 'Lock has not expired yet',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: lockError(INVENTORY_LOCK_ERROR_CODES.INVENTORY_LOCK_EXPIRED),
    });
  }

  await releaseActiveLock(lock, 'Lock expired', actorUserId, surface);
  const expired = await markLockExpired(lock._id.toString(), toObjectIdOrNull(actorUserId));

  if (!expired) {
    throw new AppError({
      message: 'Inventory lock not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: lockError(INVENTORY_LOCK_ERROR_CODES.INVENTORY_LOCK_NOT_FOUND),
    });
  }

  await writeLockAudit(INVENTORY_LOCK_AUDIT_EVENTS.INVENTORY_LOCK_EXPIRED, expired, actorUserId, surface);

  return toInventoryLockResponse(expired);
};

export const expireDueInventoryLocks = async (
  actorUserId: string,
  surface: AuditActorSurface = 'admin_dashboard',
): Promise<ExpireDueLocksSummary> => {
  const summary: ExpireDueLocksSummary = {
    processedCount: 0,
    expiredCount: 0,
    failedCount: 0,
    errors: [],
  };

  const now = new Date();
  let batch = await findExpiredActiveLocks(now, 100);

  while (batch.length > 0) {
    for (const lock of batch) {
      summary.processedCount += 1;

      try {
        await releaseActiveLock(lock, 'Lock expired', actorUserId, surface);
        const expired = await markLockExpired(lock._id.toString(), toObjectIdOrNull(actorUserId));

        if (expired) {
          summary.expiredCount += 1;
          await writeLockAudit(
            INVENTORY_LOCK_AUDIT_EVENTS.INVENTORY_LOCK_EXPIRED,
            expired,
            actorUserId,
            surface,
          );
        }
      } catch (error) {
        summary.failedCount += 1;
        summary.errors.push({
          lockId: lock._id.toString(),
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    batch = await findExpiredActiveLocks(now, 100);
  }

  await writeAuditLog({
    eventType: INVENTORY_LOCK_AUDIT_EVENTS.INVENTORY_LOCK_EXPIRE_DUE_RAN,
    actorId: toObjectIdOrNull(actorUserId),
    actorRole: null,
    actorSurface: surface,
    entityType: 'inventory_lock',
    entityId: null,
    vendorId: null,
    storeId: null,
    cityId: null,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: summary as unknown as Record<string, unknown>,
    status: 'success',
  });

  return summary;
};

export const listInventoryLocks = async (query: InventoryLockListQuery) => {
  const response = await listInventoryLocksRecord(query);

  return {
    items: response.items.map(toInventoryLockResponse),
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

export const getInventoryLockById = async (lockId: string) => {
  const lock = await findInventoryLockById(lockId);

  if (!lock) {
    throw new AppError({
      message: 'Inventory lock not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: lockError(INVENTORY_LOCK_ERROR_CODES.INVENTORY_LOCK_NOT_FOUND),
    });
  }

  return toInventoryLockResponse(lock);
};
