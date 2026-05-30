import { model, Schema, Types } from 'mongoose';
import type { SchemaOptions } from 'mongoose';

import { baseSchemaOptions } from '../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';
import { APP_SURFACE_VALUES, type AppSurface } from '../constants/app-surface.constant';
import {
  PUSH_NOTIFICATION_STATUS,
  PUSH_NOTIFICATION_STATUS_VALUES,
  type PushNotificationStatus,
} from '../constants/push-status.constant';

export type PushNotificationLogRecord = {
  userId: Types.ObjectId;
  role: string;
  appSurface: AppSurface;
  notificationType: string;
  title: string;
  body: string;
  dataPayload: Record<string, string>;
  fcmToken: string | null;
  status: PushNotificationStatus;
  sentAt: Date | null;
  failedAt: Date | null;
  failureReason: string | null;
  providerMessageId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const PushNotificationLogSchema = new Schema<PushNotificationLogRecord>(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    role: { type: String, required: true, trim: true },
    appSurface: { type: String, enum: APP_SURFACE_VALUES, required: true },
    notificationType: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    dataPayload: { type: Schema.Types.Mixed, required: true, default: {} },
    fcmToken: { type: String, default: null, trim: true },
    status: {
      type: String,
      enum: PUSH_NOTIFICATION_STATUS_VALUES,
      required: true,
      default: PUSH_NOTIFICATION_STATUS.PENDING,
    },
    sentAt: { type: Date, default: null },
    failedAt: { type: Date, default: null },
    failureReason: { type: String, default: null, trim: true },
    providerMessageId: { type: String, default: null, trim: true },
  },
  baseSchemaOptions as SchemaOptions<PushNotificationLogRecord>,
);

PushNotificationLogSchema.index({ userId: 1 });
PushNotificationLogSchema.index({ notificationType: 1 });
PushNotificationLogSchema.index({ status: 1 });
PushNotificationLogSchema.index({ createdAt: -1 });

export const PushNotificationLogModel = model<PushNotificationLogRecord>(
  'PushNotificationLog',
  PushNotificationLogSchema,
  COLLECTION_NAMES.PUSH_NOTIFICATION_LOGS,
);

export { PushNotificationLogSchema };
