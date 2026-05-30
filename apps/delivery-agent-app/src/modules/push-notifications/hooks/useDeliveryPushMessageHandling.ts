import { useEffect } from 'react';
import { Alert } from 'react-native';

import { deliveryNavigationRef } from '../../../app/navigation-ref';
import {
  getInitialPushNotification,
  onForegroundMessage,
  onNotificationOpened,
} from '../services/delivery-fcm.service';
import { useDeliveryPushStore } from '../store/delivery-push.store';
import { handleDeliveryPushPayload } from '../utils/delivery-push-payload.handler';
import type { DeliveryPushDataPayload } from '../types/delivery-push.types';

const toDeliveryPayload = (data: Record<string, string | object> | undefined): DeliveryPushDataPayload => ({
  assignmentId: typeof data?.assignmentId === 'string' ? data.assignmentId : undefined,
  orderId: typeof data?.orderId === 'string' ? data.orderId : undefined,
  screen: typeof data?.screen === 'string' ? data.screen : undefined,
  type: data?.type === 'assignment_created' ? data.type : undefined,
});

export const useDeliveryPushMessageHandling = (): void => {
  const setPushReceivedAt = useDeliveryPushStore((state) => state.setPushReceivedAt);

  useEffect(() => {
    const routePayload = (payload: DeliveryPushDataPayload): void => {
      if (deliveryNavigationRef.isReady()) {
        handleDeliveryPushPayload(payload, deliveryNavigationRef);
      }
    };

    const foregroundUnsubscribe = onForegroundMessage((message) => {
      const payload = toDeliveryPayload(message.data);
      setPushReceivedAt(new Date().toISOString());
      Alert.alert(message.notification?.title ?? 'Delivery assignment', message.notification?.body, [
        { text: 'Dismiss', style: 'cancel' },
        { text: 'Open', onPress: () => routePayload(payload) },
      ]);
    });

    const openedUnsubscribe = onNotificationOpened((message) => {
      setPushReceivedAt(new Date().toISOString());
      routePayload(toDeliveryPayload(message.data));
    });

    void getInitialPushNotification().then((message) => {
      if (message) {
        setPushReceivedAt(new Date().toISOString());
        routePayload(toDeliveryPayload(message.data));
      }
    });

    return () => {
      foregroundUnsubscribe();
      openedUnsubscribe();
    };
  }, [setPushReceivedAt]);
};
