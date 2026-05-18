import type { ApiSuccessResponse } from '../../../types/api.types';
import { apiClient } from '../../../services/api/client';
import type { BrandFormValues, BrandListQuery, BrandResponse } from '../types/brand.types';
import { unwrapData, unwrapPaginated } from '../utils/catalog-api.util';

const BASE = '/api/v1/admin/catalog/brands';

export const getAdminBrands = async (query: BrandListQuery = {}) => {
  const response = await apiClient.get<ApiSuccessResponse<BrandResponse[]>>(BASE, { params: query });
  return unwrapPaginated(response.data);
};

export const getAdminBrandById = async (brandId: string) => {
  const response = await apiClient.get<ApiSuccessResponse<BrandResponse>>(`${BASE}/${brandId}`);
  return unwrapData(response.data);
};

export const createAdminBrand = async (payload: BrandFormValues) => {
  const response = await apiClient.post<ApiSuccessResponse<BrandResponse>>(BASE, payload);
  return unwrapData(response.data);
};

export const updateAdminBrand = async (brandId: string, payload: Partial<BrandFormValues>) => {
  const response = await apiClient.patch<ApiSuccessResponse<BrandResponse>>(
    `${BASE}/${brandId}`,
    payload,
  );
  return unwrapData(response.data);
};

export const deleteAdminBrand = async (brandId: string) => {
  const response = await apiClient.delete<ApiSuccessResponse<BrandResponse>>(`${BASE}/${brandId}`);
  return unwrapData(response.data);
};
