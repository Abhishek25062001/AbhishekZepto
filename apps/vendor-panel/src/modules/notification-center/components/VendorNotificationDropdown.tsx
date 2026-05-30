import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { InAppNotification } from '../../../../../../packages/shared/api';
import {
  formatNotificationRelativeTime,
  truncateNotificationMessage,
} from '../../../../../../packages/shared-ui/notifications';
import { vendorNotificationApi } from '../api/vendor-notification.api';
import { useNotificationCenterStore } from '../store/notification-center.store';
import { getNotificationTarget } from '../utils/notification-routing.util';

export const VendorNotificationDropdown = () => {
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [markingNotificationId, setMarkingNotificationId] = useState<string | null>(null);
  const [isMarkingAllRead, setMarkingAllRead] = useState(false);
  const notifications = useNotificationCenterStore((state) => state.notifications);
  const unreadCount = useNotificationCenterStore((state) => state.unreadCount);
  const setNotifications = useNotificationCenterStore((state) => state.setNotifications);
  const setUnreadCount = useNotificationCenterStore((state) => state.setUnreadCount);
  const markAllRead = useNotificationCenterStore((state) => state.markAllRead);
  const markNotificationRead = useNotificationCenterStore((state) => state.markNotificationRead);

  const loadPreview = async () => {
    setLoading(true);
    setError(null);
    try {
      const [listResult, unreadResult] = await Promise.all([
        vendorNotificationApi.list({ limit: 5 }),
        vendorNotificationApi.unreadCount(),
      ]);
      setNotifications(listResult.items, listResult.pagination);
      setUnreadCount(unreadResult.unreadCount);
    } catch {
      setError('Unable to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const openNotification = async (notification: InAppNotification) => {
    setMarkingNotificationId(notification.id);
    try {
      await vendorNotificationApi.markRead(notification.id);
      markNotificationRead(notification.id);
      const target = getNotificationTarget(notification);
      if (target) {
        navigate(target);
      }
    } finally {
      setMarkingNotificationId(null);
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAllRead(true);
    try {
      await vendorNotificationApi.markAllRead();
      markAllRead();
      const unreadResult = await vendorNotificationApi.unreadCount();
      setUnreadCount(unreadResult.unreadCount);
    } finally {
      setMarkingAllRead(false);
    }
  };

  useEffect(() => {
    void loadPreview();
  }, []);

  return (
    <div onKeyDown={(event) => event.key === 'Escape' && setOpen(false)} style={{ position: 'relative' }}>
      <button aria-expanded={isOpen} aria-label={`Open notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`} onClick={() => setOpen((value) => !value)} type="button">
        Notifications {unreadCount > 0 ? `(${unreadCount})` : ''}
      </button>
      {isOpen ? (
        <section aria-label="Notifications" style={{ background: 'white', border: '1px solid var(--color-border)', position: 'absolute', right: 0, zIndex: 10 }}>
          {isLoading ? (
            <p aria-busy="true">Loading notifications...</p>
          ) : error ? (
            <div>
              <p>{error}</p>
              <button onClick={() => void loadPreview()} type="button">Retry</button>
            </div>
          ) : notifications.length ? (
            <ul>
              {notifications.map((notification) => (
                <li key={notification.id} data-read={notification.isRead}>
                  <button disabled={markingNotificationId === notification.id} onClick={() => void openNotification(notification)} type="button">
                    <strong>{notification.title}</strong>
                    <span>{truncateNotificationMessage(notification.message)}</span>
                    <time dateTime={notification.createdAt}>{formatNotificationRelativeTime(notification.createdAt)}</time>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No notifications</p>
          )}
          <button disabled={isMarkingAllRead} onClick={() => void handleMarkAllRead()} type="button">
            Mark all read
          </button>
          <button onClick={() => navigate('/notifications')} type="button">
            View all
          </button>
        </section>
      ) : null}
    </div>
  );
};
