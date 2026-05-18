import type { VerifyOtpResponse } from '../../../../packages/shared/api';
import type { CustomerSession } from '../services/auth/session-storage.service';

export function isCustomerAuthResponse(
  response: VerifyOtpResponse,
): boolean {
  return response.user.role === 'customer';
}

export function mapVerifyOtpResponseToCustomerSession(
  response: VerifyOtpResponse,
): CustomerSession {
  return {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    customerId: response.user.userId,
    cityId: response.user.cityId ?? null,
    role: response.user.role,
    permissions: response.user.permissions ?? [],
  };
}
