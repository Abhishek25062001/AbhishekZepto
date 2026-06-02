import type { ApiSuccessResponse } from '../../../types/api.types';
import { apiClient } from '../../../services/api/client';
import type {
  ProductApprovalPayload,
  ProductFormValues,
  ProductListQuery,
  ProductResponse,
} from '../types/product.types';
import type {
  ProductVariantFormValues,
  ProductVariantListQuery,
  ProductVariantResponse,
} from '../types/product-variant.types';
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

export const getAdminProductVariants = async (
  productId: string,
  query: ProductVariantListQuery = {},
) => {
  const response = await apiClient.get<ApiSuccessResponse<ProductVariantResponse[]>>(
    `${BASE}/${productId}/variants`,
    { params: query },
  );
  return unwrapData(response.data);
};

export const getAdminProductVariantsPage = async (
  productId: string,
  query: ProductVariantListQuery = {},
) => {
  const response = await apiClient.get<ApiSuccessResponse<ProductVariantResponse[]>>(
    `${BASE}/${productId}/variants`,
    { params: query },
  );
  return unwrapPaginated(response.data);
};

export const createAdminProductVariant = async (
  productId: string,
  payload: ProductVariantFormValues,
) => {
  const response = await apiClient.post<ApiSuccessResponse<ProductVariantResponse>>(
    `${BASE}/${productId}/variants`,
    payload,
  );
  return unwrapData(response.data);
};

export const updateAdminProductVariant = async (
  productId: string,
  variantId: string,
  payload: Partial<ProductVariantFormValues>,
) => {
  const response = await apiClient.patch<ApiSuccessResponse<ProductVariantResponse>>(
    `${BASE}/${productId}/variants/${variantId}`,
    payload,
  );
  return unwrapData(response.data);
};

export const deleteAdminProductVariant = async (productId: string, variantId: string) => {
  const response = await apiClient.delete<ApiSuccessResponse<ProductVariantResponse>>(
    `${BASE}/${productId}/variants/${variantId}`,
  );
  return unwrapData(response.data);
};
