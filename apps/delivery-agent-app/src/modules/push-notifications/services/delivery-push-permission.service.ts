import { PermissionsAndroid, Platform } from 'react-native';
import {
  AuthorizationStatus,
  getMessaging,
  hasPermission,
  requestPermission,
} from '@react-native-firebase/messaging';

import type { DeliveryPushPermissionStatus } from '../types/delivery-push.types';

const normalizeAuthorizationStatus = (
  status: number,
): DeliveryPushPermissionStatus => {
  if (
    status === AuthorizationStatus.AUTHORIZED ||
    status === AuthorizationStatus.PROVISIONAL
  ) {
    return 'granted';
  }

  if (status === AuthorizationStatus.DENIED) {
    return 'denied';
  }

  return 'unavailable';
};

const requestAndroidNotificationPermission = async (): Promise<DeliveryPushPermissionStatus> => {
  if (Platform.OS !== 'android') {
    return 'unavailable';
  }

  if (Platform.Version < 33) {
    return 'granted';
  }

  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );

  if (result === PermissionsAndroid.RESULTS.GRANTED) {
    return 'granted';
  }

  if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    return 'blocked';
  }

  return 'denied';
};

export const getPushPermissionStatus = async (): Promise<DeliveryPushPermissionStatus> => {
  if (Platform.OS === 'android') {
    if (Platform.Version < 33) {
      return 'granted';
    }

    const hasAndroidPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    return hasAndroidPermission ? 'granted' : 'denied';
  }

  if (Platform.OS === 'ios') {
    return normalizeAuthorizationStatus(await hasPermission(getMessaging()));
  }

  return 'unavailable';
};

export const requestPushPermission = async (): Promise<DeliveryPushPermissionStatus> => {
  if (Platform.OS === 'android') {
    return requestAndroidNotificationPermission();
  }

  if (Platform.OS === 'ios') {
    return normalizeAuthorizationStatus(await requestPermission(getMessaging()));
  }

  return 'unavailable';
};
