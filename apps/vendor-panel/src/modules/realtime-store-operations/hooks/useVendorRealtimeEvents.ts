import { useEffect } from 'react';

import {
  getNotificationFromRealtimePayload,
  NOTIFICATION_CREATED_EVENT,
  shouldShowPriorityNotificationAlert,
} from '../../../../../../packages/shared-ui/notifications';
import { useNotificationCenterStore } from '../../notification-center/store/notification-center.store';
import { addVendorSocketListener } from '../services/vendor-realtime-socket.service';
import { useVendorRealtimeStore } from '../store/vendor-realtime.store';
import {
  VENDOR_REALTIME_EVENTS,
  type VendorRealtimeEventName,
} from '../types/vendor-realtime.types';
import { handleVendorRealtimePayload } from '../utils/vendor-realtime-event-handler.util';

const VENDOR_EVENTS: VendorRealtimeEventName[] = [
  VENDOR_REALTIME_EVENTS.ORDER_CREATED,
  VENDOR_REALTIME_EVENTS.ORDER_STATUS_UPDATED,
  VENDOR_REALTIME_EVENTS.ORDER_CANCELLED,
  VENDOR_REALTIME_EVENTS.RIDER_ARRIVED,
  VENDOR_REALTIME_EVENTS.PICKUP_COMPLETED,
];

export const handleVendorNotificationCreatedPayload = (payload: {
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

export const useVendorRealtimeEvents = (): void => {
  const socketConnected = useVendorRealtimeStore((state) => state.socketConnected);

  useEffect(() => {
    const cleanupListeners = VENDOR_EVENTS.map((eventName) =>
      addVendorSocketListener(eventName, (payload) => {
        handleVendorRealtimePayload(payload, eventName);
      }),
    );
    cleanupListeners.push(
      addVendorSocketListener(NOTIFICATION_CREATED_EVENT, (payload) => {
        handleVendorNotificationCreatedPayload(payload);
      }),
    );

    return () => {
      cleanupListeners.forEach((cleanup) => cleanup());
    };
  }, [socketConnected]);
};
