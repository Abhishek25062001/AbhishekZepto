import { useEffect } from 'react';

import {
  getNotificationFromRealtimePayload,
  NOTIFICATION_CREATED_EVENT,
  shouldShowPriorityNotificationAlert,
} from '../../../../../../packages/shared-ui/notifications';
import { useNotificationCenterStore } from '../../notification-center/store/notification-center.store';
import { addAdminSocketListener } from '../services/admin-realtime-socket.service';
import { useAdminRealtimeStore } from '../store/admin-realtime.store';
import {
  ADMIN_REALTIME_EVENTS,
  type AdminRealtimeEventName,
} from '../types/control-tower-realtime.types';
import { handleAdminRealtimePayload } from '../utils/admin-realtime-event-handler.util';

const ADMIN_EVENTS: AdminRealtimeEventName[] = [
  ADMIN_REALTIME_EVENTS.ORDER_CREATED,
  ADMIN_REALTIME_EVENTS.ORDER_STATUS_UPDATED,
  ADMIN_REALTIME_EVENTS.ORDER_DELAYED,
  ADMIN_REALTIME_EVENTS.ORDER_CANCELLED,
  ADMIN_REALTIME_EVENTS.DELIVERY_ASSIGNMENT_CREATED,
  ADMIN_REALTIME_EVENTS.DELIVERY_STATUS_CHANGED,
  ADMIN_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED,
  ADMIN_REALTIME_EVENTS.DELIVERY_PROGRESS_UPDATED,
  ADMIN_REALTIME_EVENTS.DELIVERY_FAILED,
  ADMIN_REALTIME_EVENTS.DELIVERY_SLA_BREACH_CREATED,
];

export const handleAdminNotificationCreatedPayload = (payload: {
  data?: unknown;
}): void => {
  const notification = getNotificationFromRealtimePayload(payload);
  if (!notification) {
    return;
  }

  useNotificationCenterStore.getState().prependNotification(notification);
  if (shouldShowPriorityNotificationAlert(notification)) {
    window.alert(`${notification.title}\n${notification.message}`);
  }
};

export const useAdminRealtimeEvents = (): void => {
  const socketConnected = useAdminRealtimeStore((state) => state.socketConnected);

  useEffect(() => {
    const cleanupListeners = ADMIN_EVENTS.map((eventName) =>
      addAdminSocketListener(eventName, (payload) => {
        handleAdminRealtimePayload(payload, eventName);
      }),
    );
    cleanupListeners.push(
      addAdminSocketListener(NOTIFICATION_CREATED_EVENT, (payload) => {
        handleAdminNotificationCreatedPayload(payload);
      }),
    );

    return () => {
      cleanupListeners.forEach((cleanup) => cleanup());
    };
  }, [socketConnected]);
};
