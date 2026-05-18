import type { LocationStatus } from '../constants/store.constants';

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
  status: LocationStatus;
  createdAt: string;
  updatedAt: string;
};

export type CityFormValues = {
  name: string;
  slug?: string;
  state: string;
  country?: string;
  timezone: string;
  currencyCode: string;
  latitude?: number;
  longitude?: number;
  serviceRadiusKm?: number;
  isServiceable?: boolean;
  status: LocationStatus;
};

export type CityListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: LocationStatus;
  isServiceable?: boolean;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
};
