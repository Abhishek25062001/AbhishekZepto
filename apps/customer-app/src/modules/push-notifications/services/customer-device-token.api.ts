import type { ApiSuccessResponse } from '../../../../../../packages/shared/api';
import { apiClient } from '../../../services/api/client';
import type { CustomerDeviceTokenPayload } from '../types/customer-push.types';

export type CustomerDeviceTokenResponse = {
  appSurface: 'customer_app';
  appVersion: string | null;
  deviceId: string;
  deviceName: string | null;
  fcmTokenMasked: string;
  isActive: boolean;
  lastUsedAt: string;
  platform: 'android' | 'ios' | 'web';
  revokedAt: string | null;
  role: 'customer';
  userId: string;
};

export const registerCustomerDeviceToken = async (
  payload: CustomerDeviceTokenPayload,
): Promise<ApiSuccessResponse<CustomerDeviceTokenResponse>> => {
  const response = await apiClient.post<ApiSuccessResponse<CustomerDeviceTokenResponse>>(
    '/api/v1/customer/me/device-token',
    payload,
  );

  return response.data;
};

export const removeCustomerDeviceToken = async (
  deviceId: string,
): Promise<ApiSuccessResponse<CustomerDeviceTokenResponse | null>> => {
  const response = await apiClient.delete<ApiSuccessResponse<CustomerDeviceTokenResponse | null>>(
    `/api/v1/customer/me/device-token/${encodeURIComponent(deviceId)}`,
  );

  return response.data;
};
