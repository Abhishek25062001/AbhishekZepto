import type { InAppNotificationDocument } from '../types/in-app-notification.types';

export type InAppNotificationResponse = {
  id: string;
  notificationType: string;
  title: string;
  message: string;
  dataPayload: Record<string, unknown>;
  priority: string;
  isRead: boolean;
  readAt: Date | null;
  createdAt: Date;
};

export const toInAppNotificationResponse = (
  notification: InAppNotificationDocument,
): InAppNotificationResponse => ({
  id: notification._id.toString(),
  notificationType: notification.notificationType,
  title: notification.title,
  message: notification.message,
  dataPayload: notification.dataPayload,
  priority: notification.priority,
  isRead: notification.isRead,
  readAt: notification.readAt,
  createdAt: notification.createdAt,
});

export const toInAppNotificationResponses = (
  notifications: InAppNotificationDocument[],
): InAppNotificationResponse[] => notifications.map(toInAppNotificationResponse);
