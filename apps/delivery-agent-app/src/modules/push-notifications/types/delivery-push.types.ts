export type DeliveryPushPermissionStatus =
  | 'blocked'
  | 'denied'
  | 'granted'
  | 'unavailable';

export type DeliveryPushPayloadType = 'assignment_created';

export type DeliveryPushDataPayload = {
  assignmentId?: string;
  orderId?: string;
  screen?: string;
  type?: DeliveryPushPayloadType;
};

export type DeliveryPushNotification = {
  body?: string;
  data: DeliveryPushDataPayload;
  messageId?: string;
  receivedAt: string;
  title?: string;
};

export type DeliveryDeviceTokenPayload = {
  appVersion?: string;
  deviceId: string;
  deviceName?: string;
  fcmToken: string;
  platform: 'android' | 'ios' | 'web';
};

export type DeliveryPushNavigation = {
  navigate: (screen: string, params?: Record<string, string>) => void;
};
