import { logout } from '../api/auth.api';
import { clearCustomerSession } from './session-storage.service';
import { useAuthStore } from '../../store/auth.store';
import { logCustomerAuthEvent } from '../../utils/auth-event-logger';
import { useCustomerPushStore } from '../../modules/push-notifications/store/customer-push.store';
import { removeCustomerDeviceToken } from '../../modules/push-notifications/services/customer-device-token.api';

type LogoutCustomerOptions = {
  logoutAllDevices?: boolean;
};

export async function forceLocalLogout(): Promise<void> {
  await clearCustomerSession();
  useAuthStore.getState().clearAuthSession();
  useCustomerPushStore.getState().clearPushState();
}

export async function logoutCustomer(
  options: LogoutCustomerOptions = {},
): Promise<void> {
  const refreshToken = useAuthStore.getState().refreshToken;
  const deviceId = useCustomerPushStore.getState().deviceId;

  if (refreshToken) {
    if (deviceId) {
      await removeCustomerDeviceToken(deviceId);
    }
    await logout({
      refreshToken,
      logoutAllDevices: options.logoutAllDevices ?? false,
    });
  }

  await forceLocalLogout();
  logCustomerAuthEvent('logout_success');
}
