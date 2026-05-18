import { logout } from '../api/auth.api';
import { clearDeliverySession } from './session-storage.service';
import { useAuthStore } from '../../store/auth.store';
import { logDeliveryAuthEvent } from '../../utils/auth-event-logger';

type LogoutDeliveryOptions = {
  logoutAllDevices?: boolean;
};

export async function forceLocalLogout(): Promise<void> {
  await clearDeliverySession();
  useAuthStore.getState().clearAuthSession();
}

export async function logoutDeliveryAgent(
  options: LogoutDeliveryOptions = {},
): Promise<void> {
  const refreshToken = useAuthStore.getState().refreshToken;

  if (refreshToken) {
    await logout({
      refreshToken,
      logoutAllDevices: options.logoutAllDevices ?? false,
    });
  }

  await forceLocalLogout();
  logDeliveryAuthEvent('logout_success');
}
