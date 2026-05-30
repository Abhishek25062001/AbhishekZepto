import type { InAppNotification } from '../../../../../../packages/shared/api';
import {
  formatNotificationRelativeTime,
  truncateNotificationMessage,
} from '../../../../../../packages/shared-ui/notifications';

export const NotificationList = ({ notifications }: { notifications: InAppNotification[] }) => {
  if (!notifications.length) {
    return <p>No notifications</p>;
  }

  return (
    <ul>
      {notifications.map((notification) => (
        <li key={notification.id}>
          <strong>{notification.title}</strong>
          <p>{truncateNotificationMessage(notification.message)}</p>
          <time dateTime={notification.createdAt}>
            {formatNotificationRelativeTime(notification.createdAt)}
          </time>
        </li>
      ))}
    </ul>
  );
};
