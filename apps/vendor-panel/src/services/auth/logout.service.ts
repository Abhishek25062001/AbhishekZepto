import { logout } from '../api/auth.api';
import { clearVendorSession } from './session-storage.service';
import { useAuthStore } from '../../store/auth.store';
import { logVendorAuthEvent } from '../../utils/auth-event-logger';

type LogoutVendorOptions = {
  logoutAllDevices?: boolean;
};

export async function forceLocalLogout(): Promise<void> {
  clearVendorSession();
  useAuthStore.getState().clearAuthSession();
}

export async function logoutVendorUser(
  options: LogoutVendorOptions = {},
): Promise<void> {
  const refreshToken = useAuthStore.getState().refreshToken;

  if (refreshToken) {
    await logout({
      refreshToken,
      logoutAllDevices: options.logoutAllDevices ?? false,
    });
  }

  await forceLocalLogout();
  logVendorAuthEvent('logout_success');
}
