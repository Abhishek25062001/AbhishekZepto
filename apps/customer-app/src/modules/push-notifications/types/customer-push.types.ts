export type CustomerPushPermissionStatus =
  | 'blocked'
  | 'denied'
  | 'granted'
  | 'unavailable';

export type CustomerPushPayloadType =
  | 'delivery_failed'
  | 'order_delivered'
  | 'order_out_for_delivery';

export type CustomerPushDataPayload = {
  assignmentId?: string;
  orderId?: string;
  screen?: string;
  type?: CustomerPushPayloadType;
};

export type CustomerPushNotification = {
  body?: string;
  data: CustomerPushDataPayload;
  messageId?: string;
  receivedAt: string;
  title?: string;
};

export type CustomerDeviceTokenPayload = {
  appVersion?: string;
  deviceId: string;
  deviceName?: string;
  fcmToken: string;
  platform: 'android' | 'ios' | 'web';
};

export type CustomerPushNavigation = {
  navigate: (screen: string, params?: Record<string, string>) => void;
};
