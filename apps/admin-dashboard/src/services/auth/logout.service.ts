import { logout } from '../api/auth.api';
import { clearAdminSession } from './session-storage.service';
import { useAuthStore } from '../../store/auth.store';
import { logAdminAuthEvent } from '../../utils/auth-event-logger';

type LogoutAdminOptions = {
  logoutAllDevices?: boolean;
};

export async function forceLocalLogout(): Promise<void> {
  clearAdminSession();
  useAuthStore.getState().clearAuthSession();
}

export async function logoutAdminUser(
  options: LogoutAdminOptions = {},
): Promise<void> {
  const refreshToken = useAuthStore.getState().refreshToken;

  if (refreshToken) {
    await logout({
      refreshToken,
      logoutAllDevices: options.logoutAllDevices ?? false,
    });
  }

  await forceLocalLogout();
  logAdminAuthEvent('logout_success');
}
