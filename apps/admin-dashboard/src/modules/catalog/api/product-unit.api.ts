import type { ApiSuccessResponse } from '../../../types/api.types';
import { apiClient } from '../../../services/api/client';
import type {
  ProductUnitFormValues,
  ProductUnitListQuery,
  ProductUnitResponse,
} from '../types/product-unit.types';
import { unwrapData, unwrapPaginated } from '../utils/catalog-api.util';

const BASE = '/api/v1/admin/catalog/units';

export const getAdminProductUnits = async (query: ProductUnitListQuery = {}) => {
  const response = await apiClient.get<ApiSuccessResponse<ProductUnitResponse[]>>(BASE, {
    params: query,
  });
  return unwrapPaginated(response.data);
};

export const getAdminProductUnitById = async (unitId: string) => {
  const response = await apiClient.get<ApiSuccessResponse<ProductUnitResponse>>(`${BASE}/${unitId}`);
  return unwrapData(response.data);
};

export const createAdminProductUnit = async (payload: ProductUnitFormValues) => {
  const response = await apiClient.post<ApiSuccessResponse<ProductUnitResponse>>(BASE, payload);
  return unwrapData(response.data);
};

export const updateAdminProductUnit = async (
  unitId: string,
  payload: Partial<ProductUnitFormValues>,
) => {
  const response = await apiClient.patch<ApiSuccessResponse<ProductUnitResponse>>(
    `${BASE}/${unitId}`,
    payload,
  );
  return unwrapData(response.data);
};

export const deleteAdminProductUnit = async (unitId: string) => {
  const response = await apiClient.delete<ApiSuccessResponse<ProductUnitResponse>>(
    `${BASE}/${unitId}`,
  );
  return unwrapData(response.data);
};
