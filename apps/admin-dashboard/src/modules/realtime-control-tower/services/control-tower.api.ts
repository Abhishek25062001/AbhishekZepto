import type { ApiSuccessResponse } from '../../../types/api.types';
import { apiClient } from '../../../services/api/client';
import type {
  AdminControlTowerSnapshot,
  AdminControlTowerSnapshotQuery,
  AdminDeliveryLocation,
} from '../types/control-tower-realtime.types';

const BASE = '/api/v1/admin/control-tower';

const unwrapData = <T>(response: ApiSuccessResponse<T>): T => response.data;

export const getControlTowerSnapshot = async (
  query: AdminControlTowerSnapshotQuery = {},
): Promise<AdminControlTowerSnapshot> => {
  const response = await apiClient.get<ApiSuccessResponse<AdminControlTowerSnapshot>>(
    `${BASE}/snapshot`,
    { params: query },
  );
  return unwrapData(response.data);
};

export const getActiveDeliveryLocations = async (
  query: AdminControlTowerSnapshotQuery = {},
): Promise<AdminDeliveryLocation[]> => {
  const response = await apiClient.get<ApiSuccessResponse<AdminDeliveryLocation[]>>(
    `${BASE}/delivery-locations`,
    { params: query },
  );
  return unwrapData(response.data);
};
