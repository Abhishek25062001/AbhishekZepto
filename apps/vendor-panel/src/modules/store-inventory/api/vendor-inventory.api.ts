import type { ApiSuccessResponse } from '../../../types/api.types';
import { apiClient } from '../../../services/api/client';
import type {
  VendorInventoryAdjustmentPayload,
  VendorInventoryMovement,
  VendorInventoryMovementListQuery,
  VendorInventoryStock,
  VendorInventoryStockListQuery,
} from '../types/vendor-inventory.types';
import { unwrapData, unwrapPaginated } from '../utils/vendor-inventory-api.util';

const STOCKS_BASE = '/api/v1/vendor/inventory/stocks';
const MOVEMENTS_BASE = '/api/v1/vendor/inventory/movements';

export const getVendorInventoryStocks = async (query: VendorInventoryStockListQuery = {}) => {
  const response = await apiClient.get<ApiSuccessResponse<VendorInventoryStock[]>>(STOCKS_BASE, {
    params: query,
  });
  return unwrapPaginated(response.data);
};

export const getVendorInventoryStockById = async (inventoryStockId: string) => {
  const response = await apiClient.get<ApiSuccessResponse<VendorInventoryStock>>(
    `${STOCKS_BASE}/${inventoryStockId}`,
  );
  return unwrapData(response.data);
};

export const adjustVendorInventoryStock = async (
  inventoryStockId: string,
  payload: VendorInventoryAdjustmentPayload,
) => {
  const response = await apiClient.post<ApiSuccessResponse<VendorInventoryStock>>(
    `${STOCKS_BASE}/${inventoryStockId}/adjust`,
    payload,
  );
  return unwrapData(response.data);
};

export const getVendorInventoryMovements = async (query: VendorInventoryMovementListQuery = {}) => {
  const response = await apiClient.get<ApiSuccessResponse<VendorInventoryMovement[]>>(MOVEMENTS_BASE, {
    params: query,
  });
  return unwrapPaginated(response.data);
};
