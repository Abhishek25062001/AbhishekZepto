import { Pressable, Text } from 'react-native';
import { NotificationUnreadBadge } from './NotificationUnreadBadge';

export const NotificationBell = ({
  unreadCount,
  onPress,
}: {
  unreadCount: number;
  onPress?: () => void;
}) => (
  <Pressable accessibilityLabel="Open notifications" onPress={onPress}>
    <Text>Notifications</Text>
    <NotificationUnreadBadge count={unreadCount} />
  </Pressable>
);
