import type { ApiSuccessResponse } from '../../../types/api.types';
import { apiClient } from '../../../services/api/client';
import type { AddCartItemInput, Cart, UpdateCartItemInput } from '../types/cart.types';

const BASE = '/api/v1/customer/cart';

const unwrapData = <T>(response: ApiSuccessResponse<T>): T => response.data;

export const getCustomerCart = async (
  storeId: string,
  options?: { validatePrices?: boolean },
): Promise<Cart> => {
  const response = await apiClient.get<ApiSuccessResponse<Cart>>(BASE, {
    params: {
      storeId,
      ...(options?.validatePrices ? { validatePrices: true } : {}),
    },
  });
  return unwrapData(response.data);
};

export const recalculateCustomerCart = async (storeId: string): Promise<Cart> => {
  const response = await apiClient.post<ApiSuccessResponse<Cart>>(`${BASE}/recalculate`, {
    storeId,
  });
  return unwrapData(response.data);
};

export const addCartItem = async (input: AddCartItemInput): Promise<Cart> => {
  const response = await apiClient.post<ApiSuccessResponse<Cart>>(`${BASE}/items`, input);
  return unwrapData(response.data);
};

export const updateCartItem = async (input: UpdateCartItemInput): Promise<Cart> => {
  const { storeId, itemId, quantity } = input;
  const response = await apiClient.patch<ApiSuccessResponse<Cart>>(
    `${BASE}/items/${itemId}`,
    { quantity },
    { params: { storeId } },
  );
  return unwrapData(response.data);
};

export const removeCartItem = async (storeId: string, itemId: string): Promise<Cart> => {
  const response = await apiClient.delete<ApiSuccessResponse<Cart>>(`${BASE}/items/${itemId}`, {
    params: { storeId },
  });
  return unwrapData(response.data);
};

export const clearCustomerCart = async (storeId: string): Promise<Cart> => {
  const response = await apiClient.delete<ApiSuccessResponse<Cart>>(BASE, {
    params: { storeId },
  });
  return unwrapData(response.data);
};
