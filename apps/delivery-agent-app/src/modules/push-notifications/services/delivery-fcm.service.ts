import {
  getInitialNotification,
  getMessaging,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh as subscribeToTokenRefresh,
  registerDeviceForRemoteMessages,
  setBackgroundMessageHandler as registerBackgroundMessageHandler,
  type RemoteMessage,
} from '@react-native-firebase/messaging';

export type DeliveryFcmMessage = RemoteMessage;
export type DeliveryFcmMessageCallback = (message: DeliveryFcmMessage) => void;

export const getFcmToken = async (): Promise<string> => {
  const messaging = getMessaging();
  await registerDeviceForRemoteMessages(messaging);
  return getToken(messaging);
};

export const onTokenRefresh = (callback: (token: string) => void): (() => void) =>
  subscribeToTokenRefresh(getMessaging(), callback);

export const onForegroundMessage = (
  callback: DeliveryFcmMessageCallback,
): (() => void) => onMessage(getMessaging(), callback);

export const onNotificationOpened = (
  callback: DeliveryFcmMessageCallback,
): (() => void) => onNotificationOpenedApp(getMessaging(), callback);

export const getInitialPushNotification = async (): Promise<DeliveryFcmMessage | null> =>
  getInitialNotification(getMessaging());

export const setBackgroundMessageHandler = (
  callback: (message: DeliveryFcmMessage) => Promise<void>,
): void => {
  registerBackgroundMessageHandler(getMessaging(), callback);
};
