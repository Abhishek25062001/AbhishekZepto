import type { VerifyOtpResponse } from '../../../../packages/shared/api';
import type { VendorSession } from '../services/auth/session-storage.service';
import { isVendorAuthRole } from '../store/auth.store';

export function isVendorAuthResponse(response: VerifyOtpResponse): boolean {
  return isVendorAuthRole(response.user.role);
}

export function mapVerifyOtpResponseToVendorSession(
  response: VerifyOtpResponse,
): VendorSession {
  return {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    vendorUserId: response.user.userId,
    vendorId: response.user.vendorId ?? '',
    storeId: response.user.storeId ?? '',
    cityId: response.user.cityId ?? null,
    role: response.user.role,
    permissions: response.user.permissions ?? [],
  };
}
