import type { ApiSuccessResponse } from '../../../types/api.types';
import { apiClient } from '../../../services/api/client';
import type { StoreFormValues, StoreListQuery, StoreResponse } from '../types/store.types';
import { unwrapData, unwrapPaginated } from '../utils/store-api.util';

const BASE = '/api/v1/admin/stores';

export const getAdminStores = async (query: StoreListQuery = {}) => {
  const response = await apiClient.get<ApiSuccessResponse<StoreResponse[]>>(BASE, { params: query });
  return unwrapPaginated(response.data);
};

export const getAdminStoreById = async (storeId: string) => {
  const response = await apiClient.get<ApiSuccessResponse<StoreResponse>>(`${BASE}/${storeId}`);
  return unwrapData(response.data);
};

export const createAdminStore = async (payload: StoreFormValues) => {
  const response = await apiClient.post<ApiSuccessResponse<StoreResponse>>(BASE, payload);
  return unwrapData(response.data);
};

export const updateAdminStore = async (storeId: string, payload: Partial<StoreFormValues>) => {
  const response = await apiClient.patch<ApiSuccessResponse<StoreResponse>>(
    `${BASE}/${storeId}`,
    payload,
  );
  return unwrapData(response.data);
};

export const deleteAdminStore = async (storeId: string) => {
  const response = await apiClient.delete<ApiSuccessResponse<StoreResponse>>(`${BASE}/${storeId}`);
  return unwrapData(response.data);
};
