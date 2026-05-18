import type { FilterQuery } from 'mongoose';
import { Types } from 'mongoose';
import { CityModel, type CityRecord } from '../models/city.model';
import type { CityListQuery } from '../types/city.types';

const notDeletedFilter = { isDeleted: false };

export const findCityById = async (
  cityId: string,
): Promise<(CityRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(cityId)) {
    return null;
  }

  return CityModel.findOne({
    _id: new Types.ObjectId(cityId),
    ...notDeletedFilter,
  }).lean();
};

export const findCityBySlug = async (
  slug: string,
  excludeId?: string,
): Promise<(CityRecord & { _id: Types.ObjectId }) | null> => {
  const filter: FilterQuery<CityRecord> = {
    slug,
    ...notDeletedFilter,
  };

  if (excludeId && Types.ObjectId.isValid(excludeId)) {
    filter._id = { $ne: new Types.ObjectId(excludeId) };
  }

  return CityModel.findOne(filter).lean();
};

export const createCity = async (
  payload: Partial<CityRecord>,
): Promise<CityRecord & { _id: Types.ObjectId }> => {
  const created = await CityModel.create(payload);
  return created.toObject() as CityRecord & { _id: Types.ObjectId };
};

export const updateCityById = async (
  cityId: string,
  payload: Partial<CityRecord>,
): Promise<(CityRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(cityId)) {
    return null;
  }

  return CityModel.findOneAndUpdate(
    { _id: new Types.ObjectId(cityId), ...notDeletedFilter },
    { $set: payload },
    { new: true },
  ).lean();
};

export const softDeleteCityById = async (
  cityId: string,
  updatedBy: Types.ObjectId | null,
): Promise<(CityRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(cityId)) {
    return null;
  }

  return CityModel.findOneAndUpdate(
    { _id: new Types.ObjectId(cityId), ...notDeletedFilter },
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

export const listCities = async (
  query: CityListQuery,
): Promise<{
  items: (CityRecord & { _id: Types.ObjectId })[];
  total: number;
}> => {
  const filter: FilterQuery<CityRecord> = { ...notDeletedFilter };

  if (query.status) {
    filter.status = query.status;
  }

  if (typeof query.isServiceable === 'boolean') {
    filter.isServiceable = query.isServiceable;
  }

  if (query.search) {
    const searchRegex = new RegExp(query.search, 'i');
    filter.$or = [{ name: searchRegex }, { slug: searchRegex }, { state: searchRegex }];
  }

  const sortField = query.sortBy ?? 'updatedAt';
  const sortDirection = query.sortOrder === 'asc' ? 1 : -1;
  const skip = (query.page - 1) * query.limit;

  const [items, total] = await Promise.all([
    CityModel.find(filter)
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(query.limit)
      .lean(),
    CityModel.countDocuments(filter),
  ]);

  return {
    items: items as (CityRecord & { _id: Types.ObjectId })[],
    total,
  };
};

export { countActiveServiceAreasByCity } from '../../service-areas/repositories/service-area.repository';
export { countActiveStoresByCity } from '../../../stores/repositories/store.repository';
