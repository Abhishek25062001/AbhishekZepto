import { useEffect } from 'react';
import { Pressable, Text } from 'react-native';

import { customerNotificationApi } from '../api/customer-notification.api';
import { useNotificationCenterStore } from '../store/notification-center.store';

export const NotificationBell = ({ onPress }: { onPress?: () => void }) => {
  const unreadCount = useNotificationCenterStore((state) => state.unreadCount);
  const setUnreadCount = useNotificationCenterStore((state) => state.setUnreadCount);

  useEffect(() => {
    let isMounted = true;
    customerNotificationApi
      .unreadCount()
      .then((result) => {
        if (isMounted) {
          setUnreadCount(result.unreadCount);
        }
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, [setUnreadCount]);

  return (
    <Pressable
      accessibilityLabel={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
      accessibilityRole="button"
      onPress={onPress}
    >
      <Text>{unreadCount > 0 ? `Notifications ${unreadCount}` : 'Notifications'}</Text>
    </Pressable>
  );
};
