import { Pressable, Text, View } from 'react-native';
import type { InAppNotification } from '../../../shared/api';
import { getNotificationIconName } from '../utils/notification-icon.util';
import { truncateNotificationMessage } from '../utils/notification-message.util';
import { formatNotificationRelativeTime } from '../utils/notification-time.util';

export const NotificationListItem = ({
  notification,
  onPress,
}: {
  notification: InAppNotification;
  onPress?: (notification: InAppNotification) => void;
}) => (
  <Pressable accessibilityLabel={notification.title} onPress={() => onPress?.(notification)}>
    <View>
      <Text>{getNotificationIconName(notification.notificationType)}</Text>
      <Text>{notification.title}</Text>
      <Text>{truncateNotificationMessage(notification.message)}</Text>
      <Text>{formatNotificationRelativeTime(notification.createdAt)}</Text>
    </View>
  </Pressable>
);
