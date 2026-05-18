import type { ApiSuccessResponse } from '../../../types/api.types';
import { apiClient } from '../../../services/api/client';
import type {
  VendorAvailabilityUpdatePayload,
  VendorPriceUpdatePayload,
  VendorStoreProduct,
  VendorStoreProductListQuery,
} from '../types/vendor-store-product.types';
import { unwrapData, unwrapPaginated } from '../utils/vendor-catalog-api.util';

const BASE = '/api/v1/vendor/store-products';

export const getVendorStoreProducts = async (query: VendorStoreProductListQuery = {}) => {
  const response = await apiClient.get<ApiSuccessResponse<VendorStoreProduct[]>>(BASE, { params: query });
  return unwrapPaginated(response.data);
};

export const getVendorStoreProductById = async (storeProductId: string) => {
  const response = await apiClient.get<ApiSuccessResponse<VendorStoreProduct>>(`${BASE}/${storeProductId}`);
  return unwrapData(response.data);
};

export const patchVendorStoreProductAvailability = async (
  storeProductId: string,
  payload: VendorAvailabilityUpdatePayload,
) => {
  const response = await apiClient.patch<ApiSuccessResponse<VendorStoreProduct>>(
    `${BASE}/${storeProductId}/availability`,
    payload,
  );
  return unwrapData(response.data);
};

export const patchVendorStoreProductPrice = async (
  storeProductId: string,
  payload: VendorPriceUpdatePayload,
) => {
  const response = await apiClient.patch<ApiSuccessResponse<VendorStoreProduct>>(
    `${BASE}/${storeProductId}/price`,
    payload,
  );
  return unwrapData(response.data);
};
