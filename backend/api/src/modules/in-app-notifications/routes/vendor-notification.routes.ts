import {
  getVendorUnreadCountController,
  listVendorNotificationsController,
  markAllVendorNotificationsReadController,
  markVendorNotificationReadController,
} from '../controllers/vendor-notification.controller';
import { createNotificationRouter } from './notification-route.factory';

export default createNotificationRouter({
  list: listVendorNotificationsController,
  markAllRead: markAllVendorNotificationsReadController,
  markRead: markVendorNotificationReadController,
  unreadCount: getVendorUnreadCountController,
});
