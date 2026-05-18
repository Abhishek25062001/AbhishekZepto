import type { Types } from 'mongoose';
import type { CityRecord } from '../models/city.model';
import type { CityResponse } from '../types/city.types';
import type { CityStatus } from '../constants/city-status.constant';

type CityLean = CityRecord & { _id: Types.ObjectId };

export const toCityResponse = (city: CityLean): CityResponse => ({
  id: city._id.toString(),
  name: city.name,
  slug: city.slug,
  state: city.state,
  country: city.country,
  timezone: city.timezone,
  currencyCode: city.currencyCode,
  latitude: city.latitude,
  longitude: city.longitude,
  serviceRadiusKm: city.serviceRadiusKm,
  isServiceable: city.isServiceable,
  status: city.status as CityStatus,
  createdAt: city.createdAt,
  updatedAt: city.updatedAt,
});
