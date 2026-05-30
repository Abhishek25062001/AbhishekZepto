import { Text } from 'react-native';

export const NotificationUnreadBadge = ({ count }: { count: number }) => {
  if (count <= 0) {
    return null;
  }

  return <Text accessibilityLabel={`${count} unread notifications`}>{count > 99 ? '99+' : count}</Text>;
};
