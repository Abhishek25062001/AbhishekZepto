import type {
  InAppNotificationPriority,
  InAppNotificationSurface,
  InAppNotificationType,
} from '../../../shared/api';

export type NotificationPriority = InAppNotificationPriority;
export type NotificationSurface = InAppNotificationSurface;

export type NotificationClickTarget = {
  surface: NotificationSurface;
  routeKey: string;
  entityId?: string | null;
};

export type NotificationItemViewModel = {
  id: string;
  notificationType: InAppNotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  iconName: string;
  priorityLabel: string;
  clickTarget: NotificationClickTarget | null;
};
