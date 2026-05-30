import type { Types } from 'mongoose';

import type { InAppNotificationPriority } from '../constants/in-app-notification-priority.constant';
import type { InAppNotificationSurface } from '../constants/in-app-notification-surface.constant';
import type { InAppNotificationType } from '../constants/in-app-notification-type.constant';
import type { InAppNotificationRecord } from '../models/in-app-notification.model';

export type InAppNotificationDocument = InAppNotificationRecord & {
  _id: Types.ObjectId;
};

export type CreateInAppNotificationInput = {
  userId: string | Types.ObjectId;
  role: string;
  appSurface: InAppNotificationSurface;
  notificationType: InAppNotificationType;
  title: string;
  message: string;
  dataPayload?: Record<string, unknown>;
  priority?: InAppNotificationPriority;
};

export type NotificationListQuery = {
  userId: string | Types.ObjectId;
  appSurface: InAppNotificationSurface;
  isRead?: boolean;
  notificationType?: InAppNotificationType;
  page: number;
  limit: number;
};

export type MarkNotificationReadInput = {
  notificationId: string;
  userId: string | Types.ObjectId;
  appSurface: InAppNotificationSurface;
};

export type InAppNotificationUserContext = {
  userId: string;
  role: string;
  appSurface: InAppNotificationSurface;
};

export type InAppNotificationListResult = {
  items: InAppNotificationDocument[];
  total: number;
  page: number;
  limit: number;
};

export type { InAppNotificationPriority, InAppNotificationType };
