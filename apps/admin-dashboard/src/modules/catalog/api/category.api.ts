import type { ApiSuccessResponse } from '../../../types/api.types';
import { apiClient } from '../../../services/api/client';
import type {
  CategoryFormValues,
  CategoryListQuery,
  CategoryResponse,
} from '../types/category.types';
import { unwrapData, unwrapPaginated } from '../utils/catalog-api.util';

const BASE = '/api/v1/admin/catalog/categories';

export const getAdminCategories = async (query: CategoryListQuery = {}) => {
  const response = await apiClient.get<ApiSuccessResponse<CategoryResponse[]>>(BASE, {
    params: query,
  });
  return unwrapPaginated(response.data);
};

export const getAdminCategoryById = async (categoryId: string) => {
  const response = await apiClient.get<ApiSuccessResponse<CategoryResponse>>(
    `${BASE}/${categoryId}`,
  );
  return unwrapData(response.data);
};

export const createAdminCategory = async (payload: CategoryFormValues) => {
  const response = await apiClient.post<ApiSuccessResponse<CategoryResponse>>(BASE, payload);
  return unwrapData(response.data);
};

export const updateAdminCategory = async (categoryId: string, payload: Partial<CategoryFormValues>) => {
  const response = await apiClient.patch<ApiSuccessResponse<CategoryResponse>>(
    `${BASE}/${categoryId}`,
    payload,
  );
  return unwrapData(response.data);
};

export const deleteAdminCategory = async (categoryId: string) => {
  const response = await apiClient.delete<ApiSuccessResponse<CategoryResponse>>(
    `${BASE}/${categoryId}`,
  );
  return unwrapData(response.data);
};
