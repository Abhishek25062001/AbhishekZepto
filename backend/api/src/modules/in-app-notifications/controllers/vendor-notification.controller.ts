import { IN_APP_NOTIFICATION_SURFACE } from '../constants/in-app-notification-surface.constant';
import { createNotificationControllers } from './notification-controller.factory';

export const {
  list: listVendorNotificationsController,
  unreadCount: getVendorUnreadCountController,
  markRead: markVendorNotificationReadController,
  markAllRead: markAllVendorNotificationsReadController,
} = createNotificationControllers(IN_APP_NOTIFICATION_SURFACE.VENDOR_PANEL);
