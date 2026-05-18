import type { ApiSuccessResponse } from '../../../types/api.types';
import { apiClient } from '../../../services/api/client';
import type {
  InventoryMovementListQuery,
  InventoryMovementResponse,
} from '../types/inventory-movement.types';
import { unwrapData, unwrapPaginated } from '../utils/inventory-api.util';

const BASE = '/api/v1/admin/inventory/movements';

export const getAdminInventoryMovements = async (query: InventoryMovementListQuery = {}) => {
  const response = await apiClient.get<ApiSuccessResponse<InventoryMovementResponse[]>>(BASE, {
    params: query,
  });
  return unwrapPaginated(response.data);
};

export const getAdminInventoryMovementById = async (movementId: string) => {
  const response = await apiClient.get<ApiSuccessResponse<InventoryMovementResponse>>(
    `${BASE}/${movementId}`,
  );
  return unwrapData(response.data);
};
