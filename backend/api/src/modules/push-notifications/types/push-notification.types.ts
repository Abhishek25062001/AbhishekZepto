import type { Types } from 'mongoose';

import type { AppSurface } from '../constants/app-surface.constant';
import type { PushPlatform } from '../constants/push-platform.constant';
import type { PushNotificationStatus } from '../constants/push-status.constant';
import type { DeviceTokenRecord } from '../models/device-token.model';
import type { PushNotificationLogRecord } from '../models/push-notification-log.model';

export type RegisterDeviceTokenInput = {
  deviceId: string;
  fcmToken: string;
  platform: PushPlatform;
  appVersion?: string | null;
  deviceName?: string | null;
};

export type SendPushInput = {
  notificationType: string;
  title: string;
  body: string;
  dataPayload: Record<string, string>;
};

export type PushNotificationLogDocument = PushNotificationLogRecord & {
  _id: Types.ObjectId;
};

export type DeviceTokenDocument = DeviceTokenRecord & {
  _id: Types.ObjectId;
};

export type DeviceTokenUpsertPayload = RegisterDeviceTokenInput & {
  userId: Types.ObjectId;
  role: string;
  appSurface: AppSurface;
};

export type CreatePushLogPayload = SendPushInput & {
  userId: Types.ObjectId;
  role: string;
  appSurface: AppSurface;
  fcmToken: string | null;
  status?: PushNotificationStatus;
};

export type PushLogListQuery = {
  userId?: string;
  notificationType?: string;
  status?: PushNotificationStatus;
  page: number;
  limit: number;
};

export type { PushNotificationStatus };
