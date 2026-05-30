import {
  getDeliveryUnreadCountController,
  listDeliveryNotificationsController,
  markAllDeliveryNotificationsReadController,
  markDeliveryNotificationReadController,
} from '../controllers/delivery-notification.controller';
import { createNotificationRouter } from './notification-route.factory';

export default createNotificationRouter({
  list: listDeliveryNotificationsController,
  markAllRead: markAllDeliveryNotificationsReadController,
  markRead: markDeliveryNotificationReadController,
  unreadCount: getDeliveryUnreadCountController,
});
