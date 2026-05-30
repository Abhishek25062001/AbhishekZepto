import type { InAppNotification } from '../../../shared/api';
import { getNotificationIconName } from '../utils/notification-icon.util';
import { truncateNotificationMessage } from '../utils/notification-message.util';
import { getNotificationPriorityLabel } from '../utils/notification-priority-label.util';
import { formatNotificationRelativeTime } from '../utils/notification-time.util';

export const NotificationListItem = ({
  notification,
  onClick,
}: {
  notification: InAppNotification;
  onClick?: (notification: InAppNotification) => void;
}) => (
  <li aria-label={notification.title} data-read={notification.isRead}>
    <button onClick={() => onClick?.(notification)} type="button">
      <span aria-hidden="true">{getNotificationIconName(notification.notificationType)}</span>
      <strong>{notification.title}</strong>
      <span>{truncateNotificationMessage(notification.message)}</span>
      <small>{getNotificationPriorityLabel(notification.priority)}</small>
      <time dateTime={notification.createdAt}>
        {formatNotificationRelativeTime(notification.createdAt)}
      </time>
    </button>
  </li>
);
