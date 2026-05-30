import type { InAppNotification } from '../../../shared/api';
import { NotificationEmptyState } from './NotificationEmptyState';
import { NotificationListItem } from './NotificationListItem';

export const NotificationList = ({
  notifications,
  onClickNotification,
}: {
  notifications: InAppNotification[];
  onClickNotification?: (notification: InAppNotification) => void;
}) => {
  if (!notifications.length) {
    return <NotificationEmptyState />;
  }

  return (
    <ul>
      {notifications.map((notification) => (
        <NotificationListItem
          key={notification.id}
          notification={notification}
          onClick={onClickNotification}
        />
      ))}
    </ul>
  );
};
