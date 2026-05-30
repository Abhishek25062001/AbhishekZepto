import { logout } from '../api/auth.api';
import { clearDeliverySession } from './session-storage.service';
import { useAuthStore } from '../../store/auth.store';
import { logDeliveryAuthEvent } from '../../utils/auth-event-logger';
import { useDeliveryPushStore } from '../../modules/push-notifications/store/delivery-push.store';
import { removeDeliveryDeviceToken } from '../../modules/push-notifications/services/delivery-device-token.api';

type LogoutDeliveryOptions = {
  logoutAllDevices?: boolean;
};

export async function forceLocalLogout(): Promise<void> {
  await clearDeliverySession();
  useAuthStore.getState().clearAuthSession();
  useDeliveryPushStore.getState().clearPushState();
}

export async function logoutDeliveryAgent(
  options: LogoutDeliveryOptions = {},
): Promise<void> {
  const refreshToken = useAuthStore.getState().refreshToken;
  const deviceId = useDeliveryPushStore.getState().deviceId;

  if (refreshToken) {
    if (deviceId) {
      await removeDeliveryDeviceToken(deviceId);
    }
    await logout({
      refreshToken,
      logoutAllDevices: options.logoutAllDevices ?? false,
    });
  }

  await forceLocalLogout();
  logDeliveryAuthEvent('logout_success');
}
