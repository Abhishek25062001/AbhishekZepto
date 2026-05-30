import { REALTIME_NAMESPACE } from '../../realtime/constants/realtime-events.constant';
import type { RealtimeEventPayload } from '../../realtime/types/realtime.types';
import * as socketRoomService from '../../realtime/services/socket-room.service';
import { DELIVERY_TRACKING_REALTIME_EVENTS } from '../constants/delivery-tracking-events.constant';
import type { DeliveryTrackingRealtimeEventName } from '../constants/delivery-tracking-events.constant';
import type { DeliveryTrackingRealtimePayload } from '../types/delivery-tracking-realtime.types';
import { mapDeliveryTrackingRealtimePayload } from '../utils/delivery-tracking-payload.mapper';
import {
  hasValidDeliveryTrackingCoordinates,
  validateDeliveryTrackingRealtimePayload,
} from '../validators/delivery-tracking-realtime.validator';
import {
  buildCityRoom,
  buildDeliveryRoom,
  buildOrderRoom,
} from './delivery-tracking-room.service';

const toEventPayload = (
  eventName: DeliveryTrackingRealtimeEventName,
  roomName: string,
  data: DeliveryTrackingRealtimePayload,
): RealtimeEventPayload => ({
  eventName: eventName as RealtimeEventPayload['eventName'],
  roomName,
  emittedAt: new Date().toISOString(),
  data,
});

const emitSafely = (
  roomName: string,
  eventName: DeliveryTrackingRealtimeEventName,
  data: DeliveryTrackingRealtimePayload,
  namespace: (typeof REALTIME_NAMESPACE)[keyof typeof REALTIME_NAMESPACE],
): void => {
  validateDeliveryTrackingRealtimePayload(eventName, data);

  try {
    socketRoomService.emitToRoom(
      roomName,
      eventName,
      toEventPayload(eventName, roomName, data),
      namespace,
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Socket server has not been initialized') {
      return;
    }

    throw error;
  }
};

const emitIfCityPresent = (
  payload: DeliveryTrackingRealtimePayload,
  eventName: DeliveryTrackingRealtimeEventName,
): void => {
  if (!payload.cityId) {
    return;
  }

  emitSafely(
    buildCityRoom(payload.cityId),
    eventName,
    payload,
    REALTIME_NAMESPACE.ADMIN,
  );
};

export const emitDeliveryLocationUpdated = (progress: unknown): void => {
  const payload = mapDeliveryTrackingRealtimePayload(progress);

  if (!hasValidDeliveryTrackingCoordinates(payload)) {
    if (payload.deliveryAgentId) {
      emitSafely(
        buildDeliveryRoom(payload.deliveryAgentId),
        DELIVERY_TRACKING_REALTIME_EVENTS.DELIVERY_LOCATION_SYNC_REJECTED,
        payload,
        REALTIME_NAMESPACE.DELIVERY,
      );
    }
    return;
  }

  emitSafely(
    buildOrderRoom(payload.orderId),
    DELIVERY_TRACKING_REALTIME_EVENTS.CUSTOMER_DELIVERY_LOCATION_UPDATED,
    payload,
    REALTIME_NAMESPACE.CUSTOMER,
  );
  emitIfCityPresent(
    payload,
    DELIVERY_TRACKING_REALTIME_EVENTS.ADMIN_DELIVERY_LOCATION_UPDATED,
  );
  emitSafely(
    buildDeliveryRoom(payload.deliveryAgentId),
    DELIVERY_TRACKING_REALTIME_EVENTS.DELIVERY_LOCATION_SYNC_ACKNOWLEDGED,
    payload,
    REALTIME_NAMESPACE.DELIVERY,
  );
};

export const emitDeliveryProgressUpdated = (progress: unknown): void => {
  const payload = mapDeliveryTrackingRealtimePayload(progress);

  emitSafely(
    buildOrderRoom(payload.orderId),
    DELIVERY_TRACKING_REALTIME_EVENTS.CUSTOMER_DELIVERY_PROGRESS_UPDATED,
    payload,
    REALTIME_NAMESPACE.CUSTOMER,
  );
  emitIfCityPresent(
    payload,
    DELIVERY_TRACKING_REALTIME_EVENTS.ADMIN_DELIVERY_PROGRESS_UPDATED,
  );
};

export const emitRiderReachedCustomer = (progress: unknown): void => {
  const payload = mapDeliveryTrackingRealtimePayload(progress);

  emitSafely(
    buildOrderRoom(payload.orderId),
    DELIVERY_TRACKING_REALTIME_EVENTS.CUSTOMER_RIDER_REACHED_CUSTOMER,
    payload,
    REALTIME_NAMESPACE.CUSTOMER,
  );
};

export const emitOrderDelivered = (progressOrCompletion: unknown): void => {
  const payload = mapDeliveryTrackingRealtimePayload(progressOrCompletion);

  emitSafely(
    buildOrderRoom(payload.orderId),
    DELIVERY_TRACKING_REALTIME_EVENTS.CUSTOMER_ORDER_DELIVERED,
    payload,
    REALTIME_NAMESPACE.CUSTOMER,
  );
};

export const emitDeliveryFailed = (progress: unknown): void => {
  const payload = mapDeliveryTrackingRealtimePayload(progress);

  emitSafely(
    buildOrderRoom(payload.orderId),
    DELIVERY_TRACKING_REALTIME_EVENTS.CUSTOMER_DELIVERY_FAILED,
    payload,
    REALTIME_NAMESPACE.CUSTOMER,
  );
  emitIfCityPresent(
    payload,
    DELIVERY_TRACKING_REALTIME_EVENTS.ADMIN_DELIVERY_FAILED,
  );
};
