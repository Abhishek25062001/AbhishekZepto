import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';

import { Button, ScreenWrapper, Text } from '../../../components/common';
import { useAppNavigation } from '../../../hooks/useAppNavigation';
import type { InAppNotification } from '../../../../../../packages/shared/api';
import { deliveryNotificationApi } from '../api/delivery-notification.api';
import { NotificationList } from '../components/NotificationList';
import { useNotificationCenterStore } from '../store/notification-center.store';
import { getNotificationTarget } from '../utils/notification-routing.util';

export const NotificationCenterScreen = () => {
  const navigation = useAppNavigation();
  const notifications = useNotificationCenterStore((state) => state.notifications);
  const setNotifications = useNotificationCenterStore((state) => state.setNotifications);
  const setUnreadCount = useNotificationCenterStore((state) => state.setUnreadCount);
  const markNotificationRead = useNotificationCenterStore((state) => state.markNotificationRead);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [readingNotificationId, setReadingNotificationId] = useState<string | null>(null);

  const loadNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await deliveryNotificationApi.list({
        isRead: activeFilter === 'unread' ? false : undefined,
      });
      setNotifications(result.items, result.pagination);
      const countResult = await deliveryNotificationApi.unreadCount();
      setUnreadCount(countResult.unreadCount);
    } catch {
      setError('Unable to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  const openNotification = async (notification: InAppNotification) => {
    setReadingNotificationId(notification.id);
    try {
      await deliveryNotificationApi.markRead(notification.id);
      markNotificationRead(notification.id);
      const target = getNotificationTarget(notification);
      if (target?.startsWith('assignment:')) {
        navigation.navigate('ActiveDelivery', {
          assignmentId: target.replace('assignment:', ''),
        });
      }
    } finally {
      setReadingNotificationId(null);
    }
  };

  useEffect(() => {
    void loadNotifications();
  }, [activeFilter]);

  return (
    <ScreenWrapper scrollable={false}>
      <ScrollView
        refreshControl={
          <RefreshControl onRefresh={() => void loadNotifications()} refreshing={isLoading} />
        }
      >
        <Text variant="h2">Notifications</Text>
        <View>
          <Button
            onPress={() => setActiveFilter('all')}
            title={activeFilter === 'all' ? 'All selected' : 'All'}
            variant="secondary"
          />
          <Button
            onPress={() => setActiveFilter('unread')}
            title={activeFilter === 'unread' ? 'Unread selected' : 'Unread'}
            variant="secondary"
          />
        </View>
        {error ? (
          <View>
            <Text color="error">{error}</Text>
            <Button onPress={() => void loadNotifications()} title="Retry" variant="secondary" />
          </View>
        ) : null}
        <NotificationList
          notifications={notifications}
          onPressNotification={(notification) => void openNotification(notification)}
          readingNotificationId={readingNotificationId}
        />
      </ScrollView>
    </ScreenWrapper>
  );
};
