import { IN_APP_NOTIFICATION_SURFACE } from '../constants/in-app-notification-surface.constant';
import { createNotificationControllers } from './notification-controller.factory';

export const {
  list: listCustomerNotificationsController,
  unreadCount: getCustomerUnreadCountController,
  markRead: markCustomerNotificationReadController,
  markAllRead: markAllCustomerNotificationsReadController,
} = createNotificationControllers(IN_APP_NOTIFICATION_SURFACE.CUSTOMER_APP);
