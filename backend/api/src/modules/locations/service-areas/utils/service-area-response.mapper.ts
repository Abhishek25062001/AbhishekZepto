import type { Types } from 'mongoose';
import type { ServiceAreaRecord } from '../models/service-area.model';
import type { ServiceAreaResponse } from '../types/service-area.types';
import type { ServiceAreaStatus } from '../constants/service-area-status.constant';

type ServiceAreaLean = ServiceAreaRecord & { _id: Types.ObjectId };

export const toServiceAreaResponse = (row: ServiceAreaLean): ServiceAreaResponse => ({
  id: row._id.toString(),
  cityId: row.cityId.toString(),
  name: row.name,
  slug: row.slug,
  description: row.description,
  polygon: row.polygon,
  centerLatitude: row.centerLatitude,
  centerLongitude: row.centerLongitude,
  radiusKm: row.radiusKm,
  isServiceable: row.isServiceable,
  status: row.status as ServiceAreaStatus,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});
