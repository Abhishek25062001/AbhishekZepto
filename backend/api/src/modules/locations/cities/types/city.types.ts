import type { Types } from 'mongoose';
import type { CityRecord } from '../models/city.model';
import type { CityStatus } from '../constants/city-status.constant';

export type { CityStatus };

export type CityDocument = CityRecord & {
  _id: Types.ObjectId;
};

export type CreateCityInput = {
  name: string;
  slug?: string;
  state: string;
  country?: string;
  timezone: string;
  currencyCode: string;
  latitude?: number | null;
  longitude?: number | null;
  serviceRadiusKm?: number | null;
  isServiceable?: boolean;
  status?: CityStatus;
};

export type UpdateCityInput = {
  name?: string;
  slug?: string;
  state?: string;
  country?: string;
  timezone?: string;
  currencyCode?: string;
  latitude?: number | null;
  longitude?: number | null;
  serviceRadiusKm?: number | null;
  isServiceable?: boolean;
  status?: CityStatus;
};

export type CityListQuery = {
  page: number;
  limit: number;
  status?: CityStatus;
  isServiceable?: boolean;
  search?: string;
  sortBy?: 'name' | 'slug' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
};

export type CityResponse = {
  id: string;
  name: string;
  slug: string;
  state: string;
  country: string;
  timezone: string;
  currencyCode: string;
  latitude: number | null;
  longitude: number | null;
  serviceRadiusKm: number | null;
  isServiceable: boolean;
  status: CityStatus;
  createdAt: Date;
  updatedAt: Date;
};
