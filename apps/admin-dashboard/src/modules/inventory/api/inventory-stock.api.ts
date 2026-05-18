import type { ApiSuccessResponse } from '../../../types/api.types';
import { apiClient } from '../../../services/api/client';
import type {
  BulkInventoryThresholdPayload,
  BulkInventoryUploadPayload,
  InventoryAdjustmentPayload,
  InventoryStockFormValues,
  InventoryStockListQuery,
  InventoryStockResponse,
  BulkOperationSummary,
} from '../types/inventory-stock.types';
import { unwrapData, unwrapPaginated } from '../utils/inventory-api.util';

const BASE = '/api/v1/admin/inventory/stocks';

export const getAdminInventoryStocks = async (query: InventoryStockListQuery = {}) => {
  const response = await apiClient.get<ApiSuccessResponse<InventoryStockResponse[]>>(BASE, {
    params: query,
  });
  return unwrapPaginated(response.data);
};

export const getAdminInventoryStockById = async (inventoryStockId: string) => {
  const response = await apiClient.get<ApiSuccessResponse<InventoryStockResponse>>(
    `${BASE}/${inventoryStockId}`,
  );
  return unwrapData(response.data);
};

export const createAdminInventoryStock = async (payload: InventoryStockFormValues) => {
  const response = await apiClient.post<ApiSuccessResponse<InventoryStockResponse>>(BASE, payload);
  return unwrapData(response.data);
};

export const updateAdminInventoryStock = async (
  inventoryStockId: string,
  payload: Partial<InventoryStockFormValues>,
) => {
  const response = await apiClient.patch<ApiSuccessResponse<InventoryStockResponse>>(
    `${BASE}/${inventoryStockId}`,
    payload,
  );
  return unwrapData(response.data);
};

export const deleteAdminInventoryStock = async (inventoryStockId: string) => {
  const response = await apiClient.delete<ApiSuccessResponse<InventoryStockResponse>>(
    `${BASE}/${inventoryStockId}`,
  );
  return unwrapData(response.data);
};

export const adjustAdminInventoryStock = async (
  inventoryStockId: string,
  payload: InventoryAdjustmentPayload,
) => {
  const response = await apiClient.post<ApiSuccessResponse<InventoryStockResponse>>(
    `${BASE}/${inventoryStockId}/adjust`,
    payload,
  );
  return unwrapData(response.data);
};

export const bulkUploadAdminInventoryStocks = async (payload: BulkInventoryUploadPayload) => {
  const response = await apiClient.post<ApiSuccessResponse<BulkOperationSummary>>(
    `${BASE}/bulk-upload`,
    payload,
  );
  return unwrapData(response.data);
};

export const bulkUpdateAdminInventoryThresholds = async (
  payload: BulkInventoryThresholdPayload,
) => {
  const response = await apiClient.patch<ApiSuccessResponse<BulkOperationSummary>>(
    `${BASE}/bulk-thresholds`,
    payload,
  );
  return unwrapData(response.data);
};
