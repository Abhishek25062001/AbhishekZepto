import type { VerifyOtpResponse } from '../../../../packages/shared/api';
import type { DeliverySession } from '../services/auth/session-storage.service';

export function isDeliveryAuthResponse(
  response: VerifyOtpResponse,
): boolean {
  return response.user.role === 'delivery_agent';
}

export function mapVerifyOtpResponseToDeliverySession(
  response: VerifyOtpResponse,
): DeliverySession {
  return {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    deliveryAgentId: response.user.userId,
    cityId: response.user.cityId ?? null,
    role: response.user.role,
    permissions: response.user.permissions ?? [],
  };
}
