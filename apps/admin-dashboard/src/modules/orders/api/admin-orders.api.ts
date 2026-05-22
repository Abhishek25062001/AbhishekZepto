import type { ApiSuccessResponse } from '../../../types/api.types';
import { apiClient } from '../../../services/api/client';
import type {
  AdminOrderCancellationPayload,
  AdminOrderDetail,
  AdminOrderListItem,
  AdminOrderListQuery,
  AdminOrderListResult,
  AdminOrderStatusUpdatePayload,
  AdminOrderTimelineEvent,
} from '../types/admin-orders.types';

const BASE = '/api/v1/admin/orders';

const unwrapData = <T>(response: ApiSuccessResponse<T>): T => response.data;

const unwrapPaginated = (
  response: ApiSuccessResponse<AdminOrderListItem[]>,
): AdminOrderListResult => ({
  items: response.data,
  pagination: response.meta.pagination ?? {
    page: 1,
    limit: response.data.length,
    total: response.data.length,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  },
});

export const getAdminOrders = async (
  query: AdminOrderListQuery = {},
): Promise<AdminOrderListResult> => {
  const response = await apiClient.get<ApiSuccessResponse<AdminOrderListItem[]>>(BASE, {
    params: query,
  });
  return unwrapPaginated(response.data);
};

export const getAdminOrderById = async (orderId: string): Promise<AdminOrderDetail> => {
  const response = await apiClient.get<ApiSuccessResponse<AdminOrderDetail>>(`${BASE}/${orderId}`);
  return unwrapData(response.data);
};

export const getAdminOrderTimeline = async (
  orderId: string,
): Promise<AdminOrderTimelineEvent[]> => {
  const response = await apiClient.get<ApiSuccessResponse<AdminOrderTimelineEvent[]>>(
    `${BASE}/${orderId}/timeline`,
  );
  return unwrapData(response.data);
};

export const updateAdminOrderStatus = async (
  orderId: string,
  payload: AdminOrderStatusUpdatePayload,
): Promise<AdminOrderDetail> => {
  const response = await apiClient.post<ApiSuccessResponse<AdminOrderDetail>>(
    `${BASE}/${orderId}/status`,
    payload,
  );
  return unwrapData(response.data);
};

export const cancelAdminOrder = async (
  orderId: string,
  payload: AdminOrderCancellationPayload,
): Promise<AdminOrderDetail> => {
  const response = await apiClient.post<ApiSuccessResponse<AdminOrderDetail>>(
    `${BASE}/${orderId}/cancel`,
    payload,
  );
  return unwrapData(response.data);
};
