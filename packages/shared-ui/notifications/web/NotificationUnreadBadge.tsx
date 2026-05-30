export const NotificationUnreadBadge = ({ count }: { count: number }) => {
  if (count <= 0) {
    return null;
  }

  return (
    <span aria-label={`${count} unread notifications`} data-testid="notification-unread-badge">
      {count > 99 ? '99+' : count}
    </span>
  );
};
