import { useEffect } from 'react';
import { Alert } from 'react-native';

import {
  getNotificationFromRealtimePayload,
  NOTIFICATION_CREATED_EVENT,
  shouldShowPriorityNotificationAlert,
} from '../../../../../../packages/shared-ui/notifications';
import { useNotificationCenterStore } from '../../notification-center/store/notification-center.store';
import { addSocketListener } from '../services/customer-realtime-socket.service';
import { useRealtimeOrderStore } from '../store/realtime-order.store';
import { CUSTOMER_REALTIME_EVENTS } from '../types/realtime-order.types';
import type {
  CustomerRealtimeEventName,
  RealtimeSocketPayload,
} from '../types/realtime-order.types';
import { mapRealtimeOrderEventPayload } from '../utils/realtime-order-event.mapper';

const ORDER_EVENTS: CustomerRealtimeEventName[] = [
  CUSTOMER_REALTIME_EVENTS.ORDER_STATUS_UPDATED,
  CUSTOMER_REALTIME_EVENTS.ORDER_ACCEPTED,
  CUSTOMER_REALTIME_EVENTS.ORDER_PACKED,
  CUSTOMER_REALTIME_EVENTS.ORDER_READY_FOR_PICKUP,
  CUSTOMER_REALTIME_EVENTS.ORDER_OUT_FOR_DELIVERY,
  CUSTOMER_REALTIME_EVENTS.ORDER_DELIVERED,
  CUSTOMER_REALTIME_EVENTS.ORDER_CANCELLED,
];

export const handleRealtimeOrderPayload = (
  payload: RealtimeSocketPayload,
  eventName: CustomerRealtimeEventName,
): void => {
  const event = mapRealtimeOrderEventPayload(payload, eventName);
  if (!event) {
    return;
  }

  const latestEvent = [...useRealtimeOrderStore.getState().realtimeOrderEvents]
    .reverse()
    .find((storedEvent) => storedEvent.orderId === event.orderId);
  if (
    latestEvent &&
    Date.parse(event.updatedAt) < Date.parse(latestEvent.updatedAt)
  ) {
    return;
  }

  useRealtimeOrderStore.getState().addRealtimeOrderEvent(event);
};

export const handleCustomerNotificationCreatedPayload = (
  payload: RealtimeSocketPayload,
): void => {
  const notification = getNotificationFromRealtimePayload(payload);
  if (!notification) {
    return;
  }

  useNotificationCenterStore.getState().prependNotification(notification);
  if (shouldShowPriorityNotificationAlert(notification)) {
    Alert.alert(notification.title, notification.message);
  }
};

export const useRealtimeOrderEvents = (): void => {
  const socketConnected = useRealtimeOrderStore((state) => state.socketConnected);

  useEffect(() => {
    const cleanupListeners = ORDER_EVENTS.map((eventName) =>
      addSocketListener(eventName, (payload) => {
        handleRealtimeOrderPayload(payload, eventName);
      }),
    );
    cleanupListeners.push(
      addSocketListener(NOTIFICATION_CREATED_EVENT, (payload) => {
        handleCustomerNotificationCreatedPayload(payload);
      }),
    );

    return () => {
      cleanupListeners.forEach((cleanup) => cleanup());
    };
  }, [socketConnected]);
};
