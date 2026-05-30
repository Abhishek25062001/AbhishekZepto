import type { InAppNotification } from '../../../shared/api';

export const NOTIFICATION_CREATED_EVENT = 'notification.created';

type NotificationSocketPayload = {
  data?: unknown;
};

const isNotificationRecord = (value: unknown): value is InAppNotification => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<InAppNotification>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.notificationType === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.message === 'string' &&
    typeof candidate.priority === 'string' &&
    typeof candidate.isRead === 'boolean' &&
    typeof candidate.createdAt === 'string'
  );
};

export const getNotificationFromRealtimePayload = (
  payload: NotificationSocketPayload,
): InAppNotification | null => {
  const data = payload.data;
  if (isNotificationRecord(data)) {
    return data;
  }

  if (
    data &&
    typeof data === 'object' &&
    'notification' in data &&
    isNotificationRecord((data as { notification?: unknown }).notification)
  ) {
    return (data as { notification: InAppNotification }).notification;
  }

  return null;
};

export const shouldShowPriorityNotificationAlert = (
  notification: InAppNotification,
): boolean => notification.priority === 'high' || notification.priority === 'critical';
