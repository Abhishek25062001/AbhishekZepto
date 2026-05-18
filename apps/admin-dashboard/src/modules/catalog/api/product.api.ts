import type { ApiSuccessResponse } from '../../../types/api.types';
import { apiClient } from '../../../services/api/client';
import type {
  ProductApprovalPayload,
  ProductFormValues,
  ProductListQuery,
  ProductResponse,
} from '../types/product.types';
import { unwrapData, unwrapPaginated } from '../utils/catalog-api.util';

const BASE = '/api/v1/admin/catalog/products';

export const getAdminProducts = async (query: ProductListQuery = {}) => {
  const response = await apiClient.get<ApiSuccessResponse<ProductResponse[]>>(BASE, {
    params: query,
  });
  return unwrapPaginated(response.data);
};

export const getAdminProductById = async (productId: string) => {
  const response = await apiClient.get<ApiSuccessResponse<ProductResponse>>(
    `${BASE}/${productId}`,
  );
  return unwrapData(response.data);
};

export const createAdminProduct = async (payload: ProductFormValues) => {
  const response = await apiClient.post<ApiSuccessResponse<ProductResponse>>(BASE, payload);
  return unwrapData(response.data);
};

export const updateAdminProduct = async (productId: string, payload: Partial<ProductFormValues>) => {
  const response = await apiClient.patch<ApiSuccessResponse<ProductResponse>>(
    `${BASE}/${productId}`,
    payload,
  );
  return unwrapData(response.data);
};

export const deleteAdminProduct = async (productId: string) => {
  const response = await apiClient.delete<ApiSuccessResponse<ProductResponse>>(
    `${BASE}/${productId}`,
  );
  return unwrapData(response.data);
};

export const updateAdminProductApprovalStatus = async (
  productId: string,
  payload: ProductApprovalPayload,
) => {
  const response = await apiClient.patch<ApiSuccessResponse<ProductResponse>>(
    `${BASE}/${productId}/approval-status`,
    payload,
  );
  return unwrapData(response.data);
};

export type ProductVariantOption = {
  id: string;
  name: string;
  sku: string;
  status: string;
};

export const getAdminProductVariants = async (productId: string) => {
  const response = await apiClient.get<ApiSuccessResponse<ProductVariantOption[]>>(
    `${BASE}/${productId}/variants`,
    { params: { limit: 500 } },
  );
  return unwrapData(response.data);
};
