import { useEffect } from 'react';

import { adminNotificationApi } from '../api/admin-notification.api';
import { NotificationList } from '../components/NotificationList';
import { useNotificationCenterStore } from '../store/notification-center.store';

export const NotificationCenterPage = () => {
  const notifications = useNotificationCenterStore((state) => state.notifications);
  const setNotifications = useNotificationCenterStore((state) => state.setNotifications);
  const setUnreadCount = useNotificationCenterStore((state) => state.setUnreadCount);

  useEffect(() => {
    void adminNotificationApi.list().then((result) => setNotifications(result.items, result.pagination));
    void adminNotificationApi.unreadCount().then((result) => setUnreadCount(result.unreadCount));
  }, [setNotifications, setUnreadCount]);

  return (
    <main>
      <h1>Notifications</h1>
      <NotificationList notifications={notifications} />
    </main>
  );
};
