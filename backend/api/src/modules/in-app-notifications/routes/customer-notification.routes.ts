import {
  getCustomerUnreadCountController,
  listCustomerNotificationsController,
  markAllCustomerNotificationsReadController,
  markCustomerNotificationReadController,
} from '../controllers/customer-notification.controller';
import { createNotificationRouter } from './notification-route.factory';

export default createNotificationRouter({
  list: listCustomerNotificationsController,
  markAllRead: markAllCustomerNotificationsReadController,
  markRead: markCustomerNotificationReadController,
  unreadCount: getCustomerUnreadCountController,
});
