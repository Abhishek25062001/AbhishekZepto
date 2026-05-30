import {
  archiveNotification as archiveNotificationRecord,
  countUnreadNotifications,
  createNotification,
  findNotificationById,
  listUserNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../repositories/in-app-notification.repository';
import type {
  CreateInAppNotificationInput,
  InAppNotificationListResult,
  InAppNotificationUserContext,
  NotificationListQuery,
} from '../types/in-app-notification.types';
import {
  notificationNotFoundError,
  notificationScopeDeniedError,
} from '../utils/in-app-notification-error.mapper';
import { emitInAppNotificationCreated } from '../utils/in-app-notification-realtime.util';

type MyNotificationQuery = Partial<Pick<NotificationListQuery, 'isRead' | 'notificationType'>> & {
  page?: number;
  limit?: number;
};

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

const assertNotificationScope = async (
  notificationId: string,
  context: InAppNotificationUserContext,
) => {
  const notification = await findNotificationById(notificationId);

  if (!notification || notification.isArchived) {
    throw notificationNotFoundError();
  }

  if (
    notification.userId.toString() !== context.userId ||
    notification.appSurface !== context.appSurface
  ) {
    throw notificationScopeDeniedError();
  }

  return notification;
};

export const createInAppNotification = async (
  payload: CreateInAppNotificationInput,
) => {
  const notification = await createNotification(payload);
  emitInAppNotificationCreated(notification);
  return notification;
};

export const getMyNotifications = async (
  userContext: InAppNotificationUserContext,
  query: MyNotificationQuery = {},
): Promise<InAppNotificationListResult> => {
  const page = query.page ?? DEFAULT_PAGE;
  const limit = query.limit ?? DEFAULT_LIMIT;
  const result = await listUserNotifications({
    appSurface: userContext.appSurface,
    isRead: query.isRead,
    limit,
    notificationType: query.notificationType,
    page,
    userId: userContext.userId,
  });

  return { ...result, page, limit };
};

export const getUnreadCount = async (
  userContext: InAppNotificationUserContext,
): Promise<{ unreadCount: number }> => ({
  unreadCount: await countUnreadNotifications(userContext.userId, userContext.appSurface),
});

export const markRead = async (
  notificationId: string,
  userContext: InAppNotificationUserContext,
) => {
  await assertNotificationScope(notificationId, userContext);
  const updated = await markNotificationRead(notificationId, userContext.userId);

  if (!updated) {
    throw notificationNotFoundError();
  }

  return updated;
};

export const markAllRead = async (
  userContext: InAppNotificationUserContext,
): Promise<{ updatedCount: number }> => ({
  updatedCount: await markAllNotificationsRead(userContext.userId, userContext.appSurface),
});

export const archiveNotification = async (
  notificationId: string,
  userContext: InAppNotificationUserContext,
) => {
  await assertNotificationScope(notificationId, userContext);
  const archived = await archiveNotificationRecord(notificationId, userContext.userId);

  if (!archived) {
    throw notificationNotFoundError();
  }

  return archived;
};
