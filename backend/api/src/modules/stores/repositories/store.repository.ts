import type { FilterQuery } from 'mongoose';
import { Types } from 'mongoose';
import { StoreModel, type StoreRecord } from '../models/store.model';
import type { StoreListQuery } from '../types/store.types';
import { generateStoreCode } from '../utils/store-code.util';

const notDeletedFilter = { isDeleted: false };

const activeFilter = {
  ...notDeletedFilter,
  status: 'active' as const,
};

export const findStoreById = async (
  storeId: string,
): Promise<(StoreRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(storeId)) {
    return null;
  }

  return StoreModel.findOne({
    _id: new Types.ObjectId(storeId),
    ...notDeletedFilter,
  }).lean();
};

export const findStoreByCityAndSlug = async (
  cityId: string,
  slug: string,
  excludeId?: string,
): Promise<(StoreRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(cityId)) {
    return null;
  }

  const filter: FilterQuery<StoreRecord> = {
    cityId: new Types.ObjectId(cityId),
    slug,
    ...notDeletedFilter,
  };

  if (excludeId && Types.ObjectId.isValid(excludeId)) {
    filter._id = { $ne: new Types.ObjectId(excludeId) };
  }

  return StoreModel.findOne(filter).lean();
};

export const findStoreByCode = async (
  code: string,
  excludeId?: string,
): Promise<(StoreRecord & { _id: Types.ObjectId }) | null> => {
  const normalized = code.trim().toUpperCase();
  const filter: FilterQuery<StoreRecord> = {
    code: normalized,
    ...notDeletedFilter,
  };

  if (excludeId && Types.ObjectId.isValid(excludeId)) {
    filter._id = { $ne: new Types.ObjectId(excludeId) };
  }

  return StoreModel.findOne(filter).lean();
};

export const createStore = async (
  payload: Partial<StoreRecord>,
): Promise<StoreRecord & { _id: Types.ObjectId }> => {
  const created = await StoreModel.create(payload);
  return created.toObject() as StoreRecord & { _id: Types.ObjectId };
};

export const updateStoreById = async (
  storeId: string,
  payload: Partial<StoreRecord>,
): Promise<(StoreRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(storeId)) {
    return null;
  }

  return StoreModel.findOneAndUpdate(
    { _id: new Types.ObjectId(storeId), ...notDeletedFilter },
    { $set: payload },
    { new: true },
  ).lean();
};

export const softDeleteStoreById = async (
  storeId: string,
  updatedBy: Types.ObjectId | null,
): Promise<(StoreRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(storeId)) {
    return null;
  }

  return StoreModel.findOneAndUpdate(
    { _id: new Types.ObjectId(storeId), ...notDeletedFilter },
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
        status: 'archived',
        updatedBy,
      },
    },
    { new: true },
  ).lean();
};

export const listStores = async (
  query: StoreListQuery,
): Promise<{
  items: (StoreRecord & { _id: Types.ObjectId })[];
  total: number;
}> => {
  const filter: FilterQuery<StoreRecord> = { ...notDeletedFilter };

  if (query.vendorId && Types.ObjectId.isValid(query.vendorId)) {
    filter.vendorId = new Types.ObjectId(query.vendorId);
  }

  if (query.cityId && Types.ObjectId.isValid(query.cityId)) {
    filter.cityId = new Types.ObjectId(query.cityId);
  }

  if (query.serviceAreaId && Types.ObjectId.isValid(query.serviceAreaId)) {
    filter.serviceAreaIds = new Types.ObjectId(query.serviceAreaId);
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (typeof query.isOpen === 'boolean') {
    filter.isOpen = query.isOpen;
  }

  if (typeof query.isAcceptingOrders === 'boolean') {
    filter.isAcceptingOrders = query.isAcceptingOrders;
  }

  if (query.storeType) {
    filter.storeType = query.storeType;
  }

  if (query.fulfillmentType) {
    filter.fulfillmentType = query.fulfillmentType;
  }

  if (query.search) {
    const searchRegex = new RegExp(query.search, 'i');
    filter.$or = [{ name: searchRegex }, { slug: searchRegex }, { code: searchRegex }];
  }

  const sortField = query.sortBy ?? 'updatedAt';
  const sortDirection = query.sortOrder === 'asc' ? 1 : -1;
  const skip = (query.page - 1) * query.limit;

  const [items, total] = await Promise.all([
    StoreModel.find(filter)
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(query.limit)
      .lean(),
    StoreModel.countDocuments(filter),
  ]);

  return {
    items: items as (StoreRecord & { _id: Types.ObjectId })[],
    total,
  };
};

export const countActiveStoresByCity = async (cityId: string): Promise<number> => {
  if (!Types.ObjectId.isValid(cityId)) {
    return 0;
  }

  return StoreModel.countDocuments({
    cityId: new Types.ObjectId(cityId),
    ...activeFilter,
  });
};

export const countActiveStoresByServiceArea = async (
  serviceAreaId: string,
): Promise<number> => {
  if (!Types.ObjectId.isValid(serviceAreaId)) {
    return 0;
  }

  return StoreModel.countDocuments({
    serviceAreaIds: new Types.ObjectId(serviceAreaId),
    ...activeFilter,
  });
};

export const findNextStoreCode = async (): Promise<string> => {
  const count = await StoreModel.countDocuments(notDeletedFilter);
  return generateStoreCode(count + 1);
};
