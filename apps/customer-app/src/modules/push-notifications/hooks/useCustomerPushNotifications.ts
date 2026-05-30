import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

import { useAuthStore } from '../../../store/auth.store';
import { registerCustomerDeviceToken } from '../services/customer-device-token.api';
import { getFcmToken, onTokenRefresh } from '../services/customer-fcm.service';
import {
  getPushPermissionStatus,
  requestPushPermission,
} from '../services/customer-push-permission.service';
import { useCustomerPushStore } from '../store/customer-push.store';
import { getOrCreateCustomerDeviceId } from '../utils/customer-device-id.util';
import type { CustomerDeviceTokenPayload } from '../types/customer-push.types';

const getPlatform = (): CustomerDeviceTokenPayload['platform'] => {
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    return Platform.OS;
  }

  return 'web';
};

const buildDeviceName = (): string => {
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    return `${Platform.OS} device`;
  }

  return 'web device';
};

export const useCustomerPushNotifications = (): void => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setDeviceId = useCustomerPushStore((state) => state.setDeviceId);
  const setFcmToken = useCustomerPushStore((state) => state.setFcmToken);
  const setPermissionStatus = useCustomerPushStore((state) => state.setPermissionStatus);
  const setPushError = useCustomerPushStore((state) => state.setPushError);
  const setRegistered = useCustomerPushStore((state) => state.setRegistered);
  const clearPushState = useCustomerPushStore((state) => state.clearPushState);
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
          getOrCreateCustomerDeviceId(),
          fcmTokenOverride ? Promise.resolve(fcmTokenOverride) : getFcmToken(),
        ]);
        if (!isMounted) {
          return;
        }

        setDeviceId(deviceId);
        setFcmToken(fcmToken);
        await registerCustomerDeviceToken({
          appVersion: '1.0.0',
          deviceId,
          deviceName: buildDeviceName(),
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
