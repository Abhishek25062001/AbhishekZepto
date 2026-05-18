import type { FilterQuery } from 'mongoose';
import { Types } from 'mongoose';
import { InventoryLockModel, type InventoryLockRecord } from '../models/inventory-lock.model';
import { INVENTORY_LOCK_STATUS } from '../constants/inventory-lock-status.constant';
import type { InventoryLockListQuery } from '../types/inventory-lock.types';

export const createInventoryLock = async (
  payload: Partial<InventoryLockRecord>,
): Promise<InventoryLockRecord & { _id: Types.ObjectId }> => {
  const created = await InventoryLockModel.create(payload);
  return created.toObject() as InventoryLockRecord & { _id: Types.ObjectId };
};

export const findInventoryLockById = async (
  lockId: string,
): Promise<(InventoryLockRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(lockId)) {
    return null;
  }

  return InventoryLockModel.findById(new Types.ObjectId(lockId)).lean();
};

export const findInventoryLockByToken = async (
  lockToken: string,
): Promise<(InventoryLockRecord & { _id: Types.ObjectId }) | null> =>
  InventoryLockModel.findOne({ lockToken }).lean();

export const updateInventoryLockById = async (
  lockId: string,
  payload: Partial<InventoryLockRecord>,
): Promise<(InventoryLockRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(lockId)) {
    return null;
  }

  return InventoryLockModel.findByIdAndUpdate(new Types.ObjectId(lockId), { $set: payload }, {
    new: true,
  }).lean();
};

export const updateInventoryLockByToken = async (
  lockToken: string,
  payload: Partial<InventoryLockRecord>,
): Promise<(InventoryLockRecord & { _id: Types.ObjectId }) | null> =>
  InventoryLockModel.findOneAndUpdate({ lockToken }, { $set: payload }, { new: true }).lean();

export const listInventoryLocks = async (
  query: InventoryLockListQuery,
): Promise<{
  items: (InventoryLockRecord & { _id: Types.ObjectId })[];
  total: number;
}> => {
  const filter: FilterQuery<InventoryLockRecord> = {};

  if (query.storeId && Types.ObjectId.isValid(query.storeId)) {
    filter.storeId = new Types.ObjectId(query.storeId);
  }
  if (query.vendorId && Types.ObjectId.isValid(query.vendorId)) {
    filter.vendorId = new Types.ObjectId(query.vendorId);
  }
  if (query.cityId && Types.ObjectId.isValid(query.cityId)) {
    filter.cityId = new Types.ObjectId(query.cityId);
  }
  if (query.inventoryStockId && Types.ObjectId.isValid(query.inventoryStockId)) {
    filter.inventoryStockId = new Types.ObjectId(query.inventoryStockId);
  }
  if (query.storeProductId && Types.ObjectId.isValid(query.storeProductId)) {
    filter.storeProductId = new Types.ObjectId(query.storeProductId);
  }
  if (query.customerId && Types.ObjectId.isValid(query.customerId)) {
    filter.customerId = new Types.ObjectId(query.customerId);
  }
  if (query.cartId && Types.ObjectId.isValid(query.cartId)) {
    filter.cartId = new Types.ObjectId(query.cartId);
  }
  if (query.orderId && Types.ObjectId.isValid(query.orderId)) {
    filter.orderId = new Types.ObjectId(query.orderId);
  }
  if (query.lockType) {
    filter.lockType = query.lockType;
  }
  if (query.status) {
    filter.status = query.status;
  }
  if (query.expiresBefore) {
    filter.expiresAt = { ...(filter.expiresAt as object), $lte: new Date(query.expiresBefore) };
  }
  if (query.expiresAfter) {
    filter.expiresAt = { ...(filter.expiresAt as object), $gte: new Date(query.expiresAfter) };
  }

  const sortField = query.sortBy ?? 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
  const skip = (query.page - 1) * query.limit;

  const [items, total] = await Promise.all([
    InventoryLockModel.find(filter).sort({ [sortField]: sortOrder }).skip(skip).limit(query.limit).lean(),
    InventoryLockModel.countDocuments(filter),
  ]);

  return { items, total };
};

export const findActiveLocksByCartId = async (
  cartId: string,
): Promise<(InventoryLockRecord & { _id: Types.ObjectId })[]> => {
  if (!Types.ObjectId.isValid(cartId)) {
    return [];
  }

  return InventoryLockModel.find({
    cartId: new Types.ObjectId(cartId),
    status: INVENTORY_LOCK_STATUS.ACTIVE,
  }).lean();
};

export const findActiveLocksByOrderId = async (
  orderId: string,
): Promise<(InventoryLockRecord & { _id: Types.ObjectId })[]> => {
  if (!Types.ObjectId.isValid(orderId)) {
    return [];
  }

  return InventoryLockModel.find({
    orderId: new Types.ObjectId(orderId),
    status: INVENTORY_LOCK_STATUS.ACTIVE,
  }).lean();
};

export const findExpiredActiveLocks = async (
  now: Date,
  limit = 100,
): Promise<(InventoryLockRecord & { _id: Types.ObjectId })[]> =>
  InventoryLockModel.find({
    status: INVENTORY_LOCK_STATUS.ACTIVE,
    expiresAt: { $lt: now },
  })
    .sort({ expiresAt: 1 })
    .limit(limit)
    .lean();

export const markLockReleased = async (
  lockId: string,
  releaseReason: string,
  updatedBy: Types.ObjectId | null,
): Promise<(InventoryLockRecord & { _id: Types.ObjectId }) | null> =>
  updateInventoryLockById(lockId, {
    status: INVENTORY_LOCK_STATUS.RELEASED,
    releasedAt: new Date(),
    releaseReason,
    updatedBy,
  });

export const markLockConfirmed = async (
  lockId: string,
  confirmationReason: string,
  orderId: Types.ObjectId | null,
  updatedBy: Types.ObjectId | null,
): Promise<(InventoryLockRecord & { _id: Types.ObjectId }) | null> =>
  updateInventoryLockById(lockId, {
    status: INVENTORY_LOCK_STATUS.CONFIRMED,
    confirmedAt: new Date(),
    confirmationReason,
    orderId,
    updatedBy,
  });

export const markLockExpired = async (
  lockId: string,
  updatedBy: Types.ObjectId | null,
): Promise<(InventoryLockRecord & { _id: Types.ObjectId }) | null> =>
  updateInventoryLockById(lockId, {
    status: INVENTORY_LOCK_STATUS.EXPIRED,
    releasedAt: new Date(),
    releaseReason: 'Lock expired',
    updatedBy,
  });

export const sumActiveLockedQuantityByStockId = async (
  inventoryStockId: string,
): Promise<number> => {
  if (!Types.ObjectId.isValid(inventoryStockId)) {
    return 0;
  }

  const result = await InventoryLockModel.aggregate<{ total: number }>([
    {
      $match: {
        inventoryStockId: new Types.ObjectId(inventoryStockId),
        status: INVENTORY_LOCK_STATUS.ACTIVE,
      },
    },
    { $group: { _id: null, total: { $sum: '$quantity' } } },
  ]);

  return result[0]?.total ?? 0;
};
