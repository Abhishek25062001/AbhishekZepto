import { useEffect } from 'react';
import { Alert } from 'react-native';

import {
  getNotificationFromRealtimePayload,
  NOTIFICATION_CREATED_EVENT,
  shouldShowPriorityNotificationAlert,
} from '../../../../../../packages/shared-ui/notifications';
import { useNotificationCenterStore } from '../../notification-center/store/notification-center.store';
import { useDeliveryStore } from '../../../store/delivery.store';
import { addDeliverySocketListener } from '../services/delivery-realtime-socket.service';
import { useDeliveryRealtimeStore } from '../store/delivery-realtime.store';
import {
  DELIVERY_REALTIME_EVENTS,
  type DeliveryAssignmentRealtimeEvent,
  type DeliveryStatusRealtimeEvent,
  type DeliveryRealtimeEventName,
  type DeliveryRealtimeSocketPayload,
} from '../types/delivery-realtime.types';
import { mapDeliveryRealtimeEventPayload } from '../utils/delivery-realtime-event.mapper';
import {
  shouldIgnoreAssignmentRealtimeEvent,
  shouldIgnoreStatusRealtimeEvent,
} from '../utils/delivery-realtime-stale-event.util';

const DELIVERY_EVENTS: DeliveryRealtimeEventName[] = [
  DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CREATED,
  DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CANCELLED,
  DELIVERY_REALTIME_EVENTS.PICKUP_UPDATED,
  DELIVERY_REALTIME_EVENTS.DELIVERY_STATUS_UPDATED,
  DELIVERY_REALTIME_EVENTS.LOCATION_SYNC_ACKNOWLEDGED,
  DELIVERY_REALTIME_EVENTS.LOCATION_SYNC_REJECTED,
];

const isAssignmentRealtimeEvent = (
  event: ReturnType<typeof mapDeliveryRealtimeEventPayload>,
): event is DeliveryAssignmentRealtimeEvent =>
  event?.eventName === DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CREATED ||
  event?.eventName === DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CANCELLED;

const isStatusRealtimeEvent = (
  event: ReturnType<typeof mapDeliveryRealtimeEventPayload>,
): event is DeliveryStatusRealtimeEvent =>
  Boolean(event) && !isAssignmentRealtimeEvent(event);

export const handleDeliveryRealtimePayload = (
  payload: DeliveryRealtimeSocketPayload,
  eventName: DeliveryRealtimeEventName,
): void => {
  const event = mapDeliveryRealtimeEventPayload(payload, eventName);
  if (!event) {
    return;
  }

  if (isAssignmentRealtimeEvent(event)) {
    if (
      shouldIgnoreAssignmentRealtimeEvent(
        event,
        useDeliveryRealtimeStore.getState().lastAssignmentEvent,
      )
    ) {
      return;
    }

    useDeliveryRealtimeStore.getState().setLastAssignmentEvent(event);
    if (event.eventName === DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CANCELLED) {
      useDeliveryStore.getState().clearCurrentDelivery();
      return;
    }

    useDeliveryStore.getState().setCurrentDelivery({
      currentAssignmentId: event.assignmentId,
      currentOrderId: event.orderId,
      currentDeliveryStatus: event.deliveryStatus,
    });
    return;
  }

  if (isStatusRealtimeEvent(event)) {
    if (
      shouldIgnoreStatusRealtimeEvent(
        event,
        useDeliveryRealtimeStore.getState().lastStatusEvent,
      )
    ) {
      return;
    }

    useDeliveryRealtimeStore.getState().setLastStatusEvent(event);
    if (event.eventName === DELIVERY_REALTIME_EVENTS.LOCATION_SYNC_REJECTED) {
      useDeliveryRealtimeStore.getState().setLocationSyncPaused(true);
      useDeliveryRealtimeStore
        .getState()
        .setLocationSyncError(
          event.rejectionReason ?? 'Location sync was rejected',
        );
    }
    useDeliveryStore.getState().setCurrentDelivery({
      currentAssignmentId: event.assignmentId,
      currentOrderId: event.orderId,
      currentDeliveryStatus: event.deliveryStatus,
    });
  }
};

export const handleDeliveryNotificationCreatedPayload = (
  payload: DeliveryRealtimeSocketPayload,
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

export const useDeliveryRealtimeEvents = (): void => {
  const socketConnected = useDeliveryRealtimeStore((state) => state.socketConnected);

  useEffect(() => {
    const cleanupListeners = DELIVERY_EVENTS.map((eventName) =>
      addDeliverySocketListener(eventName, (payload) => {
        handleDeliveryRealtimePayload(payload, eventName);
      }),
    );
    cleanupListeners.push(
      addDeliverySocketListener(NOTIFICATION_CREATED_EVENT, (payload) => {
        handleDeliveryNotificationCreatedPayload(payload);
      }),
    );

    return () => {
      cleanupListeners.forEach((cleanup) => cleanup());
    };
  }, [socketConnected]);
};
