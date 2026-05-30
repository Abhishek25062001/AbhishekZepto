import { Pressable, Text, View } from 'react-native';
import type { InAppNotification } from '../../../../../../packages/shared/api';
import {
  formatNotificationRelativeTime,
  truncateNotificationMessage,
} from '../../../../../../packages/shared-ui/notifications';

export const NotificationListItem = ({
  notification,
  disabled = false,
  onPress,
}: {
  notification: InAppNotification;
  disabled?: boolean;
  onPress?: (notification: InAppNotification) => void;
}) => (
  <Pressable disabled={disabled} onPress={() => onPress?.(notification)}>
    <View>
      <Text>{notification.title}</Text>
      <Text>{truncateNotificationMessage(notification.message)}</Text>
      <Text>{formatNotificationRelativeTime(notification.createdAt)}</Text>
    </View>
  </Pressable>
);
