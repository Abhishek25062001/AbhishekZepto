import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';

import { Button, ScreenWrapper, Text } from '../../../components/common';
import { customerNotificationApi } from '../api/customer-notification.api';
import { NotificationFilterTabs } from '../components/NotificationFilterTabs';
import { NotificationList } from '../components/NotificationList';
import { useNotificationCenterStore } from '../store/notification-center.store';
import { getNotificationTarget } from '../utils/notification-routing.util';
import { useAppNavigation } from '../../../hooks/useAppNavigation';
import type { InAppNotification } from '../../../../../../packages/shared/api';

export const NotificationCenterScreen = () => {
  const navigation = useAppNavigation();
  const notifications = useNotificationCenterStore((state) => state.notifications);
  const setNotifications = useNotificationCenterStore((state) => state.setNotifications);
  const setUnreadCount = useNotificationCenterStore((state) => state.setUnreadCount);
  const markNotificationRead = useNotificationCenterStore((state) => state.markNotificationRead);
  const isLoading = useNotificationCenterStore((state) => state.isLoading);
  const error = useNotificationCenterStore((state) => state.error);
  const setLoading = useNotificationCenterStore((state) => state.setLoading);
  const setError = useNotificationCenterStore((state) => state.setError);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
  const [readingNotificationId, setReadingNotificationId] = useState<string | null>(null);

  const loadNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await customerNotificationApi.list({
        isRead: activeFilter === 'unread' ? false : undefined,
      });
      setNotifications(result.items, result.pagination);
      const countResult = await customerNotificationApi.unreadCount();
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
      await customerNotificationApi.markRead(notification.id);
      markNotificationRead(notification.id);
      const target = getNotificationTarget(notification);
      if (target?.startsWith('order:')) {
        navigation.navigate('OrderDetail', { orderId: target.replace('order:', '') });
      }
      if (target?.startsWith('tracking:')) {
        navigation.navigate('DeliveryTracking', { orderId: target.replace('tracking:', '') });
      }
    } finally {
      setReadingNotificationId(null);
    }
  };

  useEffect(() => {
    void loadNotifications();
  }, [activeFilter]);

  useEffect(() => {
    void customerNotificationApi.unreadCount().then((result) => {
      setUnreadCount(result.unreadCount);
    });
  }, [setUnreadCount]);

  return (
    <ScreenWrapper scrollable={false}>
      <ScrollView
        refreshControl={
          <RefreshControl onRefresh={() => void loadNotifications()} refreshing={isLoading} />
        }
      >
        <Text variant="h2">Notifications</Text>
        <NotificationFilterTabs activeFilter={activeFilter} onChange={setActiveFilter} />
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
