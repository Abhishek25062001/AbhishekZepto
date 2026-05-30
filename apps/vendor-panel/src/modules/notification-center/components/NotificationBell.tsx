import { useNotificationCenterStore } from '../store/notification-center.store';

export const NotificationBell = ({ onClick }: { onClick?: () => void }) => {
  const unreadCount = useNotificationCenterStore((state) => state.unreadCount);
  return (
    <button aria-label="Notifications" onClick={onClick} type="button">
      {unreadCount > 0 ? `Notifications ${unreadCount}` : 'Notifications'}
    </button>
  );
};
