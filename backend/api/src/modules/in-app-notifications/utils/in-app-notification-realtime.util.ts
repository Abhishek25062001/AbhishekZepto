import {
  REALTIME_EVENTS,
  REALTIME_NAMESPACE,
  type RealtimeNamespace,
} from '../../realtime/constants/realtime-events.constant';
import { emitToRoom } from '../../realtime/services/socket-room.service';
import type { RealtimeEventPayload } from '../../realtime/types/realtime.types';
import {
  buildAdminSocketRoom,
  buildCustomerSocketRoom,
  buildDeliverySocketRoom,
  buildVendorSocketRoom,
} from '../../realtime/utils/socket-room-name.util';
import { IN_APP_NOTIFICATION_SURFACE } from '../constants/in-app-notification-surface.constant';
import type { InAppNotificationDocument } from '../types/in-app-notification.types';
import { toInAppNotificationResponse } from './in-app-notification-response.mapper';

const getRoom = (notification: InAppNotificationDocument): string => {
  const userId = notification.userId.toString();

  if (notification.appSurface === IN_APP_NOTIFICATION_SURFACE.CUSTOMER_APP) {
    return buildCustomerSocketRoom(userId);
  }

  if (notification.appSurface === IN_APP_NOTIFICATION_SURFACE.DELIVERY_AGENT_APP) {
    return buildDeliverySocketRoom(userId);
  }

  if (notification.appSurface === IN_APP_NOTIFICATION_SURFACE.VENDOR_PANEL) {
    return buildVendorSocketRoom(userId);
  }

  return buildAdminSocketRoom(userId);
};

const getNamespace = (notification: InAppNotificationDocument): RealtimeNamespace => {
  if (notification.appSurface === IN_APP_NOTIFICATION_SURFACE.CUSTOMER_APP) {
    return REALTIME_NAMESPACE.CUSTOMER;
  }

  if (notification.appSurface === IN_APP_NOTIFICATION_SURFACE.DELIVERY_AGENT_APP) {
    return REALTIME_NAMESPACE.DELIVERY;
  }

  if (notification.appSurface === IN_APP_NOTIFICATION_SURFACE.VENDOR_PANEL) {
    return REALTIME_NAMESPACE.VENDOR;
  }

  return REALTIME_NAMESPACE.ADMIN;
};

export const emitInAppNotificationCreated = (
  notification: InAppNotificationDocument,
): void => {
  const roomName = getRoom(notification);
  const payload: RealtimeEventPayload = {
    data: toInAppNotificationResponse(notification),
    emittedAt: new Date().toISOString(),
    eventName: REALTIME_EVENTS.NOTIFICATION_CREATED,
    roomName,
  };

  try {
    emitToRoom(roomName, REALTIME_EVENTS.NOTIFICATION_CREATED, payload, getNamespace(notification));
  } catch (error) {
    if (error instanceof Error && error.message === 'Socket server has not been initialized') {
      return;
    }

    throw error;
  }
};
