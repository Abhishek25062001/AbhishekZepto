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

export type CustomerFcmMessage = RemoteMessage;
export type CustomerFcmMessageCallback = (message: CustomerFcmMessage) => void;

export const getFcmToken = async (): Promise<string> => {
  const messaging = getMessaging();
  await registerDeviceForRemoteMessages(messaging);
  return getToken(messaging);
};

export const onTokenRefresh = (callback: (token: string) => void): (() => void) =>
  subscribeToTokenRefresh(getMessaging(), callback);

export const onForegroundMessage = (
  callback: CustomerFcmMessageCallback,
): (() => void) => onMessage(getMessaging(), callback);

export const onNotificationOpened = (
  callback: CustomerFcmMessageCallback,
): (() => void) => onNotificationOpenedApp(getMessaging(), callback);

export const getInitialPushNotification = async (): Promise<CustomerFcmMessage | null> =>
  getInitialNotification(getMessaging());

export const setBackgroundMessageHandler = (
  callback: (message: CustomerFcmMessage) => Promise<void>,
): void => {
  registerBackgroundMessageHandler(getMessaging(), callback);
};
