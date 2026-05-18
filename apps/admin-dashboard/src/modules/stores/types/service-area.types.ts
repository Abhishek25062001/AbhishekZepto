import type { LocationStatus } from '../constants/store.constants';

export type ServiceAreaPolygonPoint = {
  latitude: number;
  longitude: number;
};

export type ServiceAreaResponse = {
  id: string;
  cityId: string;
  name: string;
  slug: string;
  description: string | null;
  polygon: ServiceAreaPolygonPoint[] | null;
  centerLatitude: number | null;
  centerLongitude: number | null;
  radiusKm: number | null;
  isServiceable: boolean;
  status: LocationStatus;
  createdAt: string;
  updatedAt: string;
};

export type ServiceAreaFormValues = {
  cityId: string;
  name: string;
  slug?: string;
  description?: string | null;
  polygon?: ServiceAreaPolygonPoint[] | null;
  centerLatitude?: number;
  centerLongitude?: number;
  radiusKm?: number;
  isServiceable?: boolean;
  status: LocationStatus;
};

export type ServiceAreaListQuery = {
  page?: number;
  limit?: number;
  cityId?: string;
  search?: string;
  status?: LocationStatus;
  isServiceable?: boolean;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
};
