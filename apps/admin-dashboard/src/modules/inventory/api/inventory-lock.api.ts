import type { ApiSuccessResponse } from '../../../types/api.types';
import { apiClient } from '../../../services/api/client';
import type {
  ExpireDueLocksSummary,
  InventoryLockListQuery,
  InventoryLockResponse,
} from '../types/inventory-lock.types';
import { unwrapData, unwrapPaginated } from '../utils/inventory-api.util';

const BASE = '/api/v1/admin/inventory/locks';

export const getAdminInventoryLocks = async (query: InventoryLockListQuery = {}) => {
  const response = await apiClient.get<ApiSuccessResponse<InventoryLockResponse[]>>(BASE, {
    params: query,
  });
  return unwrapPaginated(response.data);
};

export const getAdminInventoryLockById = async (lockId: string) => {
  const response = await apiClient.get<ApiSuccessResponse<InventoryLockResponse>>(
    `${BASE}/${lockId}`,
  );
  return unwrapData(response.data);
};

export const expireDueInventoryLocks = async () => {
  const response = await apiClient.post<ApiSuccessResponse<ExpireDueLocksSummary>>(
    `${BASE}/expire-due`,
  );
  return unwrapData(response.data);
};
