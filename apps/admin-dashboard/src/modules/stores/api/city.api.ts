import type { ApiSuccessResponse } from '../../../types/api.types';
import { apiClient } from '../../../services/api/client';
import type { CityFormValues, CityListQuery, CityResponse } from '../types/city.types';
import { unwrapData, unwrapPaginated } from '../utils/store-api.util';

const BASE = '/api/v1/admin/locations/cities';

export const getAdminCities = async (query: CityListQuery = {}) => {
  const response = await apiClient.get<ApiSuccessResponse<CityResponse[]>>(BASE, { params: query });
  return unwrapPaginated(response.data);
};

export const getAdminCityById = async (cityId: string) => {
  const response = await apiClient.get<ApiSuccessResponse<CityResponse>>(`${BASE}/${cityId}`);
  return unwrapData(response.data);
};

export const createAdminCity = async (payload: CityFormValues) => {
  const response = await apiClient.post<ApiSuccessResponse<CityResponse>>(BASE, payload);
  return unwrapData(response.data);
};

export const updateAdminCity = async (cityId: string, payload: Partial<CityFormValues>) => {
  const response = await apiClient.patch<ApiSuccessResponse<CityResponse>>(
    `${BASE}/${cityId}`,
    payload,
  );
  return unwrapData(response.data);
};

export const deleteAdminCity = async (cityId: string) => {
  const response = await apiClient.delete<ApiSuccessResponse<CityResponse>>(`${BASE}/${cityId}`);
  return unwrapData(response.data);
};
