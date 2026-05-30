import { IN_APP_NOTIFICATION_SURFACE } from '../constants/in-app-notification-surface.constant';
import { createNotificationControllers } from './notification-controller.factory';

export const {
  list: listAdminNotificationsController,
  unreadCount: getAdminUnreadCountController,
  markRead: markAdminNotificationReadController,
  markAllRead: markAllAdminNotificationsReadController,
} = createNotificationControllers(IN_APP_NOTIFICATION_SURFACE.ADMIN_DASHBOARD);
