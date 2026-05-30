import { IN_APP_NOTIFICATION_SURFACE } from '../constants/in-app-notification-surface.constant';
import { createNotificationControllers } from './notification-controller.factory';

export const {
  list: listDeliveryNotificationsController,
  unreadCount: getDeliveryUnreadCountController,
  markRead: markDeliveryNotificationReadController,
  markAllRead: markAllDeliveryNotificationsReadController,
} = createNotificationControllers(IN_APP_NOTIFICATION_SURFACE.DELIVERY_AGENT_APP);
