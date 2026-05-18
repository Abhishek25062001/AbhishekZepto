import type { FilterQuery } from 'mongoose';
import { Types } from 'mongoose';
import { ServiceAreaModel, type ServiceAreaRecord } from '../models/service-area.model';
import type { ServiceAreaListQuery } from '../types/service-area.types';

const notDeletedFilter = { isDeleted: false };

const activeFilter = {
  ...notDeletedFilter,
  status: 'active' as const,
};

export const findServiceAreaById = async (
  serviceAreaId: string,
): Promise<(ServiceAreaRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(serviceAreaId)) {
    return null;
  }

  return ServiceAreaModel.findOne({
    _id: new Types.ObjectId(serviceAreaId),
    ...notDeletedFilter,
  }).lean();
};

export const findServiceAreaByCityAndSlug = async (
  cityId: string,
  slug: string,
  excludeId?: string,
): Promise<(ServiceAreaRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(cityId)) {
    return null;
  }

  const filter: FilterQuery<ServiceAreaRecord> = {
    cityId: new Types.ObjectId(cityId),
    slug,
    ...notDeletedFilter,
  };

  if (excludeId && Types.ObjectId.isValid(excludeId)) {
    filter._id = { $ne: new Types.ObjectId(excludeId) };
  }

  return ServiceAreaModel.findOne(filter).lean();
};

export const createServiceArea = async (
  payload: Partial<ServiceAreaRecord>,
): Promise<ServiceAreaRecord & { _id: Types.ObjectId }> => {
  const created = await ServiceAreaModel.create(payload);
  return created.toObject() as ServiceAreaRecord & { _id: Types.ObjectId };
};

export const updateServiceAreaById = async (
  serviceAreaId: string,
  payload: Partial<ServiceAreaRecord>,
): Promise<(ServiceAreaRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(serviceAreaId)) {
    return null;
  }

  return ServiceAreaModel.findOneAndUpdate(
    { _id: new Types.ObjectId(serviceAreaId), ...notDeletedFilter },
    { $set: payload },
    { new: true },
  ).lean();
};

export const softDeleteServiceAreaById = async (
  serviceAreaId: string,
  updatedBy: Types.ObjectId | null,
): Promise<(ServiceAreaRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(serviceAreaId)) {
    return null;
  }

  return ServiceAreaModel.findOneAndUpdate(
    { _id: new Types.ObjectId(serviceAreaId), ...notDeletedFilter },
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

export const listServiceAreas = async (
  query: ServiceAreaListQuery,
): Promise<{
  items: (ServiceAreaRecord & { _id: Types.ObjectId })[];
  total: number;
}> => {
  const filter: FilterQuery<ServiceAreaRecord> = { ...notDeletedFilter };

  if (query.cityId && Types.ObjectId.isValid(query.cityId)) {
    filter.cityId = new Types.ObjectId(query.cityId);
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (typeof query.isServiceable === 'boolean') {
    filter.isServiceable = query.isServiceable;
  }

  if (query.search) {
    const searchRegex = new RegExp(query.search, 'i');
    filter.$or = [{ name: searchRegex }, { slug: searchRegex }];
  }

  const sortField = query.sortBy ?? 'updatedAt';
  const sortDirection = query.sortOrder === 'asc' ? 1 : -1;
  const skip = (query.page - 1) * query.limit;

  const [items, total] = await Promise.all([
    ServiceAreaModel.find(filter)
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(query.limit)
      .lean(),
    ServiceAreaModel.countDocuments(filter),
  ]);

  return {
    items: items as (ServiceAreaRecord & { _id: Types.ObjectId })[],
    total,
  };
};

export const countActiveServiceAreasByCity = async (cityId: string): Promise<number> => {
  if (!Types.ObjectId.isValid(cityId)) {
    return 0;
  }

  return ServiceAreaModel.countDocuments({
    cityId: new Types.ObjectId(cityId),
    ...activeFilter,
  });
};

export const countActiveServiceAreasForCityAndIds = async (
  cityId: string,
  serviceAreaIds: string[],
): Promise<number> => {
  if (!Types.ObjectId.isValid(cityId) || serviceAreaIds.length === 0) {
    return 0;
  }

  const objectIds = serviceAreaIds
    .filter((id) => Types.ObjectId.isValid(id))
    .map((id) => new Types.ObjectId(id));

  if (objectIds.length === 0) {
    return 0;
  }

  return ServiceAreaModel.countDocuments({
    _id: { $in: objectIds },
    cityId: new Types.ObjectId(cityId),
    ...activeFilter,
    isServiceable: true,
  });
};

export { countActiveStoresByServiceArea } from '../../../stores/repositories/store.repository';
