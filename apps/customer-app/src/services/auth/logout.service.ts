import { logout } from '../api/auth.api';
import { clearCustomerSession } from './session-storage.service';
import { useAuthStore } from '../../store/auth.store';
import { logCustomerAuthEvent } from '../../utils/auth-event-logger';

type LogoutCustomerOptions = {
  logoutAllDevices?: boolean;
};

export async function forceLocalLogout(): Promise<void> {
  await clearCustomerSession();
  useAuthStore.getState().clearAuthSession();
}

export async function logoutCustomer(
  options: LogoutCustomerOptions = {},
): Promise<void> {
  const refreshToken = useAuthStore.getState().refreshToken;

  if (refreshToken) {
    await logout({
      refreshToken,
      logoutAllDevices: options.logoutAllDevices ?? false,
    });
  }

  await forceLocalLogout();
  logCustomerAuthEvent('logout_success');
}
