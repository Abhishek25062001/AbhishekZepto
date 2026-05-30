import type { ApiSuccessResponse } from '../../../../../../packages/shared/api';
import { apiClient } from '../../../services/api/client';
import type { DeliveryDeviceTokenPayload } from '../types/delivery-push.types';

export type DeliveryDeviceTokenResponse = {
  appSurface: 'delivery_agent_app';
  appVersion: string | null;
  deviceId: string;
  deviceName: string | null;
  fcmTokenMasked: string;
  isActive: boolean;
  lastUsedAt: string;
  platform: 'android' | 'ios' | 'web';
  revokedAt: string | null;
  role: 'delivery_agent';
  userId: string;
};

export const registerDeliveryDeviceToken = async (
  payload: DeliveryDeviceTokenPayload,
): Promise<ApiSuccessResponse<DeliveryDeviceTokenResponse>> => {
  const response = await apiClient.post<ApiSuccessResponse<DeliveryDeviceTokenResponse>>(
    '/api/v1/delivery/me/device-token',
    payload,
  );

  return response.data;
};

export const removeDeliveryDeviceToken = async (
  deviceId: string,
): Promise<ApiSuccessResponse<DeliveryDeviceTokenResponse | null>> => {
  const response = await apiClient.delete<ApiSuccessResponse<DeliveryDeviceTokenResponse | null>>(
    `/api/v1/delivery/me/device-token/${encodeURIComponent(deviceId)}`,
  );

  return response.data;
};
