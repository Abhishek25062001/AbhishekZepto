import type { ApiSuccessResponse } from '../../../types/api.types';
import { apiClient } from '../../../services/api/client';
import { unwrapData, unwrapPaginated } from '../../store-catalog/utils/vendor-catalog-api.util';
import type {
  VendorOrderDetail,
  VendorOrderAcceptanceResponse,
  VendorCancelOrderPayload,
  VendorOrderCancellationResponse,
  VendorOrderItemQuantityPayload,
  VendorOrderListItem,
  VendorOrderListQuery,
  VendorOrderPackingResponse,
  VendorOrderPickingResponse,
  VendorRejectOrderPayload,
} from '../types/vendor-orders.types';
import { buildVendorOrderListQueryParams } from '../utils/vendor-orders-query.util';

const BASE = '/api/v1/store/orders';

export const getVendorOrders = async (query: VendorOrderListQuery = {}) => {
  const response = await apiClient.get<ApiSuccessResponse<VendorOrderListItem[]>>(BASE, {
    params: buildVendorOrderListQueryParams(query),
  });
  return unwrapPaginated(response.data);
};

export const getVendorOrderById = async (orderId: string) => {
  const response = await apiClient.get<ApiSuccessResponse<VendorOrderDetail>>(`${BASE}/${orderId}`);
  return unwrapData(response.data);
};

export const acceptVendorOrder = async (orderId: string) => {
  const response = await apiClient.post<ApiSuccessResponse<VendorOrderAcceptanceResponse>>(`${BASE}/${orderId}/accept`);
  return unwrapData(response.data);
};

export const rejectVendorOrder = async (
  orderId: string,
  payload: VendorRejectOrderPayload,
) => {
  const response = await apiClient.post<ApiSuccessResponse<VendorOrderAcceptanceResponse>>(
    `${BASE}/${orderId}/reject`,
    payload,
  );
  return unwrapData(response.data);
};

export const startVendorOrderPicking = async (orderId: string) => {
  const response = await apiClient.post<ApiSuccessResponse<VendorOrderPickingResponse>>(
    `${BASE}/${orderId}/picking/start`,
  );
  return unwrapData(response.data);
};

export const markVendorOrderItemPicked = async (
  orderId: string,
  itemId: string,
  payload: VendorOrderItemQuantityPayload,
) => {
  const response = await apiClient.post<ApiSuccessResponse<VendorOrderPickingResponse>>(
    `${BASE}/${orderId}/items/${itemId}/picked`,
    payload,
  );
  return unwrapData(response.data);
};

export const markVendorOrderItemMissing = async (
  orderId: string,
  itemId: string,
  payload: VendorOrderItemQuantityPayload,
) => {
  const response = await apiClient.post<ApiSuccessResponse<VendorOrderPickingResponse>>(
    `${BASE}/${orderId}/items/${itemId}/missing`,
    payload,
  );
  return unwrapData(response.data);
};

export const completeVendorOrderPicking = async (orderId: string) => {
  const response = await apiClient.post<ApiSuccessResponse<VendorOrderPickingResponse>>(
    `${BASE}/${orderId}/picking/complete`,
  );
  return unwrapData(response.data);
};

export const startVendorOrderPacking = async (orderId: string) => {
  const response = await apiClient.post<ApiSuccessResponse<VendorOrderPackingResponse>>(
    `${BASE}/${orderId}/packing/start`,
  );
  return unwrapData(response.data);
};

export const completeVendorOrderPacking = async (orderId: string) => {
  const response = await apiClient.post<ApiSuccessResponse<VendorOrderPackingResponse>>(
    `${BASE}/${orderId}/packing/complete`,
  );
  return unwrapData(response.data);
};

export const markVendorOrderReadyForPickup = async (orderId: string) => {
  const response = await apiClient.post<ApiSuccessResponse<VendorOrderPackingResponse>>(
    `${BASE}/${orderId}/ready-for-pickup`,
  );
  return unwrapData(response.data);
};

export const cancelVendorOrder = async (
  orderId: string,
  payload: VendorCancelOrderPayload,
) => {
  const response = await apiClient.post<ApiSuccessResponse<VendorOrderCancellationResponse>>(
    `${BASE}/${orderId}/cancel`,
    payload,
  );
  return unwrapData(response.data);
};
