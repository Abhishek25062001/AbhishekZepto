import {
  getAdminUnreadCountController,
  listAdminNotificationsController,
  markAdminNotificationReadController,
  markAllAdminNotificationsReadController,
} from '../controllers/admin-notification.controller';
import { createNotificationRouter } from './notification-route.factory';

export default createNotificationRouter({
  list: listAdminNotificationsController,
  markAllRead: markAllAdminNotificationsReadController,
  markRead: markAdminNotificationReadController,
  unreadCount: getAdminUnreadCountController,
});
