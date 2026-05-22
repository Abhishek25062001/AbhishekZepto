import type { ApiPaginationMeta, ApiSuccessResponse } from '../../../types/api.types';
import { apiClient } from '../../../services/api/client';
import type {
  CancelOrderInput,
  OrderDetail,
  OrderListItem,
  OrderListQuery,
  OrderState,
  OrderTimelineEvent,
} from '../types/order.types';

const BASE = '/api/v1/customer/orders';

const unwrapData = <T>(response: ApiSuccessResponse<T>): T => response.data;

export type CustomerOrdersResult = {
  orders: OrderListItem[];
  pagination: ApiPaginationMeta;
};

export const getCustomerOrders = async (
  query: OrderListQuery = {},
): Promise<CustomerOrdersResult> => {
  const response = await apiClient.get<ApiSuccessResponse<OrderListItem[]>>(BASE, {
    params: {
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      ...(query.status ? { status: query.status } : {}),
    },
  });

  const pagination = response.data.meta.pagination;

  if (!pagination) {
    throw new Error('Orders list response missing pagination meta');
  }

  return {
    orders: unwrapData(response.data),
    pagination,
  };
};

export const getCustomerOrderById = async (orderId: string): Promise<OrderDetail> => {
  const response = await apiClient.get<ApiSuccessResponse<OrderDetail>>(`${BASE}/${orderId}`);
  return unwrapData(response.data);
};

export const getCustomerOrderState = async (orderId: string): Promise<OrderState> => {
  const response = await apiClient.get<ApiSuccessResponse<OrderState>>(`${BASE}/${orderId}/state`);
  return unwrapData(response.data);
};

export const getCustomerOrderLifecycle = async (
  orderId: string,
): Promise<OrderTimelineEvent[]> => {
  const response = await apiClient.get<ApiSuccessResponse<OrderTimelineEvent[]>>(
    `${BASE}/${orderId}/lifecycle`,
  );
  return unwrapData(response.data);
};

export const cancelCustomerOrder = async (
  orderId: string,
  input: CancelOrderInput,
): Promise<OrderDetail> => {
  const response = await apiClient.post<ApiSuccessResponse<OrderDetail>>(
    `${BASE}/${orderId}/cancel`,
    input,
  );
  return unwrapData(response.data);
};
