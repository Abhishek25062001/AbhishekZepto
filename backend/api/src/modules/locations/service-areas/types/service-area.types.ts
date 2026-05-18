import type { Types } from 'mongoose';
import type { ServiceAreaRecord } from '../models/service-area.model';
import type { ServiceAreaStatus } from '../constants/service-area-status.constant';

export type { ServiceAreaStatus };

export type ServiceAreaDocument = ServiceAreaRecord & {
  _id: Types.ObjectId;
};

export type CreateServiceAreaInput = {
  cityId: string;
  name: string;
  slug?: string;
  description?: string | null;
  polygon?: unknown[] | null;
  centerLatitude?: number | null;
  centerLongitude?: number | null;
  radiusKm?: number | null;
  isServiceable?: boolean;
  status?: ServiceAreaStatus;
};

export type UpdateServiceAreaInput = {
  cityId?: string;
  name?: string;
  slug?: string;
  description?: string | null;
  polygon?: unknown[] | null;
  centerLatitude?: number | null;
  centerLongitude?: number | null;
  radiusKm?: number | null;
  isServiceable?: boolean;
  status?: ServiceAreaStatus;
};

export type ServiceAreaListQuery = {
  page: number;
  limit: number;
  cityId?: string;
  status?: ServiceAreaStatus;
  isServiceable?: boolean;
  search?: string;
  sortBy?: 'name' | 'slug' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
};

export type ServiceAreaResponse = {
  id: string;
  cityId: string;
  name: string;
  slug: string;
  description: string | null;
  polygon: unknown[] | null;
  centerLatitude: number | null;
  centerLongitude: number | null;
  radiusKm: number | null;
  isServiceable: boolean;
  status: ServiceAreaStatus;
  createdAt: Date;
  updatedAt: Date;
};
