import type { ApiSuccessResponse } from '../../../types/api.types';
import { apiClient } from '../../../services/api/client';
import type {
  BulkOperationSummary,
  BulkStoreProductMapPayload,
  BulkStoreProductPricePayload,
  BulkStoreProductVisibilityPayload,
  StoreProductFormValues,
  StoreProductListQuery,
  StoreProductResponse,
} from '../types/store-product.types';
import { unwrapData, unwrapPaginated } from '../utils/inventory-api.util';

const BASE = '/api/v1/admin/store-products';

export const getAdminStoreProducts = async (query: StoreProductListQuery = {}) => {
  const response = await apiClient.get<ApiSuccessResponse<StoreProductResponse[]>>(BASE, {
    params: query,
  });
  return unwrapPaginated(response.data);
};

export const getAdminStoreProductById = async (storeProductId: string) => {
  const response = await apiClient.get<ApiSuccessResponse<StoreProductResponse>>(
    `${BASE}/${storeProductId}`,
  );
  return unwrapData(response.data);
};

export const createAdminStoreProduct = async (payload: StoreProductFormValues) => {
  const response = await apiClient.post<ApiSuccessResponse<StoreProductResponse>>(BASE, payload);
  return unwrapData(response.data);
};

export const updateAdminStoreProduct = async (
  storeProductId: string,
  payload: Partial<StoreProductFormValues>,
) => {
  const response = await apiClient.patch<ApiSuccessResponse<StoreProductResponse>>(
    `${BASE}/${storeProductId}`,
    payload,
  );
  return unwrapData(response.data);
};

export const deleteAdminStoreProduct = async (storeProductId: string) => {
  const response = await apiClient.delete<ApiSuccessResponse<StoreProductResponse>>(
    `${BASE}/${storeProductId}`,
  );
  return unwrapData(response.data);
};

export const bulkMapAdminStoreProducts = async (payload: BulkStoreProductMapPayload) => {
  const response = await apiClient.post<ApiSuccessResponse<BulkOperationSummary>>(
    `${BASE}/bulk-map`,
    payload,
  );
  return unwrapData(response.data);
};

export const bulkUpdateAdminStoreProductPrices = async (payload: BulkStoreProductPricePayload) => {
  const response = await apiClient.patch<ApiSuccessResponse<BulkOperationSummary>>(
    `${BASE}/bulk-price`,
    payload,
  );
  return unwrapData(response.data);
};

export const bulkUpdateAdminStoreProductVisibility = async (
  payload: BulkStoreProductVisibilityPayload,
) => {
  const response = await apiClient.patch<ApiSuccessResponse<BulkOperationSummary>>(
    `${BASE}/bulk-visibility`,
    payload,
  );
  return unwrapData(response.data);
};
