import type { ApiSuccessResponse } from '../../../types/api.types';
import { apiClient } from '../../../services/api/client';
import type {
  VendorCatalogBrand,
  VendorCatalogCategory,
  VendorCatalogProduct,
  VendorCatalogFacets,
  VendorCatalogProductListQuery,
  VendorCatalogProductVariant,
} from '../types/vendor-catalog.types';
import { unwrapData, unwrapPaginated } from '../utils/vendor-catalog-api.util';

const BASE = '/api/v1/vendor/catalog';

export const getVendorCatalogCategories = async () => {
  const response = await apiClient.get<ApiSuccessResponse<VendorCatalogCategory[]>>(`${BASE}/categories`, {
    params: { page: 1, limit: 50 },
  });
  return unwrapData(response.data);
};

export const getVendorCatalogBrands = async () => {
  const response = await apiClient.get<ApiSuccessResponse<VendorCatalogBrand[]>>(`${BASE}/brands`, {
    params: { page: 1, limit: 50 },
  });
  return unwrapData(response.data);
};

export const getVendorCatalogFacets = async (query: VendorCatalogProductListQuery = {}) => {
  const response = await apiClient.get<ApiSuccessResponse<VendorCatalogFacets>>(`${BASE}/facets`, {
    params: query,
  });
  return unwrapData(response.data);
};

export const getVendorCatalogProducts = async (query: VendorCatalogProductListQuery = {}) => {
  const response = await apiClient.get<ApiSuccessResponse<VendorCatalogProduct[]>>(`${BASE}/products`, {
    params: query,
  });
  return unwrapPaginated(response.data);
};

export const getVendorCatalogProductById = async (productId: string) => {
  const response = await apiClient.get<ApiSuccessResponse<VendorCatalogProduct>>(
    `${BASE}/products/${productId}`,
  );
  return unwrapData(response.data);
};

export const getVendorCatalogProductVariants = async (productId: string) => {
  const response = await apiClient.get<ApiSuccessResponse<VendorCatalogProductVariant[]>>(
    `${BASE}/products/${productId}/variants`,
  );
  return unwrapData(response.data);
};
