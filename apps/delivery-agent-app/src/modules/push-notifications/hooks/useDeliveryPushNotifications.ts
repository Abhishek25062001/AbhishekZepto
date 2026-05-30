import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

import { useAuthStore } from '../../../store/auth.store';
import { registerDeliveryDeviceToken } from '../services/delivery-device-token.api';
import { getFcmToken, onTokenRefresh } from '../services/delivery-fcm.service';
import {
  getPushPermissionStatus,
  requestPushPermission,
} from '../services/delivery-push-permission.service';
import { useDeliveryPushStore } from '../store/delivery-push.store';
import { getOrCreateDeliveryDeviceId } from '../utils/delivery-device-id.util';
import type { DeliveryDeviceTokenPayload } from '../types/delivery-push.types';

const getPlatform = (): DeliveryDeviceTokenPayload['platform'] => {
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    return Platform.OS;
  }

  return 'web';
};

export const useDeliveryPushNotifications = (): void => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setDeviceId = useDeliveryPushStore((state) => state.setDeviceId);
  const setFcmToken = useDeliveryPushStore((state) => state.setFcmToken);
  const setPermissionStatus = useDeliveryPushStore((state) => state.setPermissionStatus);
  const setPushError = useDeliveryPushStore((state) => state.setPushError);
  const setRegistered = useDeliveryPushStore((state) => state.setRegistered);
  const clearPushState = useDeliveryPushStore((state) => state.clearPushState);
  const tokenRefreshUnsubscribe = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      tokenRefreshUnsubscribe.current?.();
      tokenRefreshUnsubscribe.current = null;
      clearPushState();
      return undefined;
    }

    let isMounted = true;

    const registerToken = async (fcmTokenOverride?: string): Promise<void> => {
      try {
        const permissionStatus = await requestPushPermission();
        if (!isMounted) {
          return;
        }

        setPermissionStatus(permissionStatus);
        if (permissionStatus !== 'granted') {
          setRegistered(false);
          return;
        }

        const [deviceId, fcmToken] = await Promise.all([
          getOrCreateDeliveryDeviceId(),
          fcmTokenOverride ? Promise.resolve(fcmTokenOverride) : getFcmToken(),
        ]);
        if (!isMounted) {
          return;
        }

        setDeviceId(deviceId);
        setFcmToken(fcmToken);
        await registerDeliveryDeviceToken({
          appVersion: '1.0.0',
          deviceId,
          deviceName: `${getPlatform()} device`,
          fcmToken,
          platform: getPlatform(),
        });
        if (isMounted) {
          setRegistered(true);
          setPushError(null);
        }
      } catch (error) {
        if (isMounted) {
          setRegistered(false);
          setPushError(error instanceof Error ? error.message : 'Push registration failed');
        }
      }
    };

    void getPushPermissionStatus().then((status) => {
      if (isMounted) {
        setPermissionStatus(status);
      }
    });
    void registerToken();
    tokenRefreshUnsubscribe.current = onTokenRefresh((token) => {
      void registerToken(token);
    });

    return () => {
      isMounted = false;
      tokenRefreshUnsubscribe.current?.();
      tokenRefreshUnsubscribe.current = null;
    };
  }, [
    clearPushState,
    isAuthenticated,
    setDeviceId,
    setFcmToken,
    setPermissionStatus,
    setPushError,
    setRegistered,
  ]);
};
