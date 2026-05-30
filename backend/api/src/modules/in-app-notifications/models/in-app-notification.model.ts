import { model, Schema, Types } from 'mongoose';
import type { SchemaOptions } from 'mongoose';

import { baseSchemaOptions } from '../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';
import {
  IN_APP_NOTIFICATION_PRIORITY,
  IN_APP_NOTIFICATION_PRIORITY_VALUES,
  type InAppNotificationPriority,
} from '../constants/in-app-notification-priority.constant';
import {
  IN_APP_NOTIFICATION_SURFACE_VALUES,
  type InAppNotificationSurface,
} from '../constants/in-app-notification-surface.constant';
import {
  IN_APP_NOTIFICATION_TYPE_VALUES,
  type InAppNotificationType,
} from '../constants/in-app-notification-type.constant';

export type InAppNotificationRecord = {
  userId: Types.ObjectId;
  role: string;
  appSurface: InAppNotificationSurface;
  notificationType: InAppNotificationType;
  title: string;
  message: string;
  dataPayload: Record<string, unknown>;
  priority: InAppNotificationPriority;
  isRead: boolean;
  readAt: Date | null;
  isArchived: boolean;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const InAppNotificationSchema = new Schema<InAppNotificationRecord>(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    role: { type: String, required: true, trim: true },
    appSurface: { type: String, enum: IN_APP_NOTIFICATION_SURFACE_VALUES, required: true },
    notificationType: { type: String, enum: IN_APP_NOTIFICATION_TYPE_VALUES, required: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    dataPayload: { type: Schema.Types.Mixed, required: true, default: {} },
    priority: {
      type: String,
      enum: IN_APP_NOTIFICATION_PRIORITY_VALUES,
      required: true,
      default: IN_APP_NOTIFICATION_PRIORITY.NORMAL,
    },
    isRead: { type: Boolean, required: true, default: false },
    readAt: { type: Date, default: null },
    isArchived: { type: Boolean, required: true, default: false },
    archivedAt: { type: Date, default: null },
  },
  baseSchemaOptions as SchemaOptions<InAppNotificationRecord>,
);

InAppNotificationSchema.index({ userId: 1 });
InAppNotificationSchema.index({ role: 1 });
InAppNotificationSchema.index({ appSurface: 1 });
InAppNotificationSchema.index({ isRead: 1 });
InAppNotificationSchema.index({ isArchived: 1 });
InAppNotificationSchema.index({ notificationType: 1 });
InAppNotificationSchema.index({ createdAt: -1 });

export const InAppNotificationModel = model<InAppNotificationRecord>(
  'InAppNotification',
  InAppNotificationSchema,
  COLLECTION_NAMES.IN_APP_NOTIFICATIONS,
);

export { InAppNotificationSchema };
