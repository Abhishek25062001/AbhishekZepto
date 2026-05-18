import type { ApiSuccessResponse } from '../../../types/api.types';
import { apiClient } from '../../../services/api/client';
import type {
  ServiceAreaFormValues,
  ServiceAreaListQuery,
  ServiceAreaResponse,
} from '../types/service-area.types';
import { unwrapData, unwrapPaginated } from '../utils/store-api.util';

const BASE = '/api/v1/admin/locations/service-areas';

export const getAdminServiceAreas = async (query: ServiceAreaListQuery = {}) => {
  const response = await apiClient.get<ApiSuccessResponse<ServiceAreaResponse[]>>(BASE, {
    params: query,
  });
  return unwrapPaginated(response.data);
};

export const getAdminServiceAreaById = async (serviceAreaId: string) => {
  const response = await apiClient.get<ApiSuccessResponse<ServiceAreaResponse>>(
    `${BASE}/${serviceAreaId}`,
  );
  return unwrapData(response.data);
};

export const createAdminServiceArea = async (payload: ServiceAreaFormValues) => {
  const response = await apiClient.post<ApiSuccessResponse<ServiceAreaResponse>>(BASE, payload);
  return unwrapData(response.data);
};

export const updateAdminServiceArea = async (
  serviceAreaId: string,
  payload: Partial<ServiceAreaFormValues>,
) => {
  const response = await apiClient.patch<ApiSuccessResponse<ServiceAreaResponse>>(
    `${BASE}/${serviceAreaId}`,
    payload,
  );
  return unwrapData(response.data);
};

export const deleteAdminServiceArea = async (serviceAreaId: string) => {
  const response = await apiClient.delete<ApiSuccessResponse<ServiceAreaResponse>>(
    `${BASE}/${serviceAreaId}`,
  );
  return unwrapData(response.data);
};
