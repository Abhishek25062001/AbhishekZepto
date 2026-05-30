import { Pressable, Text, View } from 'react-native';
import type { InAppNotification } from '../../../../../../packages/shared/api';
import {
  formatNotificationRelativeTime,
  truncateNotificationMessage,
} from '../../../../../../packages/shared-ui/notifications';

export const NotificationList = ({
  notifications,
  readingNotificationId,
  onPressNotification,
}: {
  notifications: InAppNotification[];
  readingNotificationId?: string | null;
  onPressNotification?: (notification: InAppNotification) => void;
}) => (
  <View>
    {notifications.length ? (
      notifications.map((notification) => (
        <Pressable
          disabled={readingNotificationId === notification.id}
          key={notification.id}
          onPress={() => onPressNotification?.(notification)}
        >
          <Text>{notification.title}</Text>
          <Text>{truncateNotificationMessage(notification.message)}</Text>
          <Text>{formatNotificationRelativeTime(notification.createdAt)}</Text>
        </Pressable>
      ))
    ) : (
      <Text>No notifications</Text>
    )}
  </View>
);
