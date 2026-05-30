import type {
  MOBILE_PUSH_PAYLOAD_TYPE,
  MOBILE_PUSH_PERMISSION_STATUS,
  MOBILE_PUSH_PLATFORM,
} from '../constants/push.constants';

export type MobilePushPayloadType =
  (typeof MOBILE_PUSH_PAYLOAD_TYPE)[keyof typeof MOBILE_PUSH_PAYLOAD_TYPE];

export type PushNotificationPermissionStatus =
  (typeof MOBILE_PUSH_PERMISSION_STATUS)[keyof typeof MOBILE_PUSH_PERMISSION_STATUS];

export type MobilePushPlatform =
  (typeof MOBILE_PUSH_PLATFORM)[keyof typeof MOBILE_PUSH_PLATFORM];

export type AssignmentCreatedPushDataPayload = {
  type: typeof MOBILE_PUSH_PAYLOAD_TYPE.ASSIGNMENT_CREATED;
  assignmentId: string;
  orderId: string;
  screen?: string;
};

export type OrderOutForDeliveryPushDataPayload = {
  type: typeof MOBILE_PUSH_PAYLOAD_TYPE.ORDER_OUT_FOR_DELIVERY;
  orderId: string;
  assignmentId?: string;
  screen?: string;
};

export type OrderDeliveredPushDataPayload = {
  type: typeof MOBILE_PUSH_PAYLOAD_TYPE.ORDER_DELIVERED;
  orderId: string;
  screen?: string;
};

export type DeliveryFailedPushDataPayload = {
  type: typeof MOBILE_PUSH_PAYLOAD_TYPE.DELIVERY_FAILED;
  orderId: string;
  assignmentId?: string;
  screen?: string;
};

export type PushNotificationDataPayload =
  | AssignmentCreatedPushDataPayload
  | OrderOutForDeliveryPushDataPayload
  | OrderDeliveredPushDataPayload
  | DeliveryFailedPushDataPayload;

export type DeviceTokenRegistrationPayload = {
  appVersion?: string;
  deviceId: string;
  deviceName?: string;
  fcmToken: string;
  platform: MobilePushPlatform;
};
