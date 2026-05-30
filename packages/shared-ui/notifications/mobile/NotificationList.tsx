import { View } from 'react-native';
import type { InAppNotification } from '../../../shared/api';
import { NotificationEmptyState } from './NotificationEmptyState';
import { NotificationListItem } from './NotificationListItem';

export const NotificationList = ({
  notifications,
  onPressNotification,
}: {
  notifications: InAppNotification[];
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
          notification={notification}
          onPress={onPressNotification}
        />
      ))}
    </View>
  );
};
