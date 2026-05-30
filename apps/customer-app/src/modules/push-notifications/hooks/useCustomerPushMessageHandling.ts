import { useEffect } from 'react';
import { Alert } from 'react-native';

import { customerNavigationRef } from '../../../app/navigation-ref';
import {
  getInitialPushNotification,
  onForegroundMessage,
  onNotificationOpened,
} from '../services/customer-fcm.service';
import { useCustomerPushStore } from '../store/customer-push.store';
import { handleCustomerPushPayload } from '../utils/customer-push-payload.handler';
import type { CustomerPushDataPayload } from '../types/customer-push.types';

const toCustomerPayload = (data: Record<string, string | object> | undefined): CustomerPushDataPayload => ({
  assignmentId: typeof data?.assignmentId === 'string' ? data.assignmentId : undefined,
  orderId: typeof data?.orderId === 'string' ? data.orderId : undefined,
  screen: typeof data?.screen === 'string' ? data.screen : undefined,
  type:
    data?.type === 'order_out_for_delivery' ||
    data?.type === 'order_delivered' ||
    data?.type === 'delivery_failed'
      ? data.type
      : undefined,
});

export const useCustomerPushMessageHandling = (): void => {
  const setPushReceivedAt = useCustomerPushStore((state) => state.setPushReceivedAt);

  useEffect(() => {
    const routePayload = (payload: CustomerPushDataPayload): void => {
      if (customerNavigationRef.isReady()) {
        handleCustomerPushPayload(payload, customerNavigationRef);
      }
    };

    const foregroundUnsubscribe = onForegroundMessage((message) => {
      const payload = toCustomerPayload(message.data);
      const receivedAt = new Date().toISOString();
      setPushReceivedAt(receivedAt);
      Alert.alert(message.notification?.title ?? 'Order update', message.notification?.body, [
        { text: 'Dismiss', style: 'cancel' },
        { text: 'View', onPress: () => routePayload(payload) },
      ]);
    });

    const openedUnsubscribe = onNotificationOpened((message) => {
      setPushReceivedAt(new Date().toISOString());
      routePayload(toCustomerPayload(message.data));
    });

    void getInitialPushNotification().then((message) => {
      if (message) {
        setPushReceivedAt(new Date().toISOString());
        routePayload(toCustomerPayload(message.data));
      }
    });

    return () => {
      foregroundUnsubscribe();
      openedUnsubscribe();
    };
  }, [setPushReceivedAt]);
};
