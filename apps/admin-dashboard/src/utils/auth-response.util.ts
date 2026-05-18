import type { VerifyOtpResponse } from '../../../../packages/shared/api';
import type { AdminSession } from '../services/auth/session-storage.service';
import { isAdminAuthRole } from '../store/auth.store';

export function isAdminAuthResponse(response: VerifyOtpResponse): boolean {
  return isAdminAuthRole(response.user.role);
}

export function mapVerifyOtpResponseToAdminSession(
  response: VerifyOtpResponse,
): AdminSession {
  return {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    adminId: response.user.userId,
    role: response.user.role,
    permissions: response.user.permissions ?? [],
  };
}
