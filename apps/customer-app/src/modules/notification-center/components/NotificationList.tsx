import { View } from 'react-native';
import type { InAppNotification } from '../../../../../../packages/shared/api';
import { NotificationEmptyState } from './NotificationEmptyState';
import { NotificationListItem } from './NotificationListItem';

export const NotificationList = ({
  notifications,
  readingNotificationId,
  onPressNotification,
}: {
  notifications: InAppNotification[];
  readingNotificationId?: string | null;
  onPressNotification?: (notification: InAppNotification) => void;
}) => {
  if (!notifications.length) {
    return <NotificationEmptyState />;
  }

  return (
    <View>
      {notifications.map((notification) => (
        <NotificationListItem
          key={notification.id}
          disabled={readingNotificationId === notification.id}
          notification={notification}
          onPress={onPressNotification}
        />
      ))}
    </View>
  );
};
