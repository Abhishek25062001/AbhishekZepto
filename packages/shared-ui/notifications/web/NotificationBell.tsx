import { NotificationUnreadBadge } from './NotificationUnreadBadge';

export const NotificationBell = ({
  unreadCount,
  onClick,
}: {
  unreadCount: number;
  onClick?: () => void;
}) => (
  <button aria-label="Open notifications" onClick={onClick} type="button">
    <span aria-hidden="true">Bell</span>
    <NotificationUnreadBadge count={unreadCount} />
  </button>
);
