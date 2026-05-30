import { REALTIME_EVENTS, REALTIME_NAMESPACE } from '../constants/realtime-events.constant';
import type { RealtimeEventName } from '../constants/realtime-events.constant';
import type { RealtimeEventPayload } from '../types/realtime.types';
import {
  mapAssignmentRealtimePayload,
  mapDeliveryProgressRealtimePayload,
  mapPickupRealtimePayload,
  mapSlaBreachRealtimePayload,
} from '../utils/realtime-payload.util';
import {
  ADMIN_OPERATIONS_ROOM,
  buildCityRoom,
  buildDeliveryRoom,
  buildOrderRoom,
  buildVendorRoom,
} from '../utils/realtime-room.util';
import type { IDeliveryAssignmentDocument } from '../../delivery/types/delivery-assignment.types';
import { emitToRoom } from './socket-room.service';

const toEventPayload = (
  eventName: RealtimeEventName,
  roomName: string,
  data: Record<string, unknown>,
): RealtimeEventPayload => ({
  eventName,
  roomName,
  emittedAt: new Date().toISOString(),
  data,
});

const emitSafely = (
  roomName: string,
  eventName: RealtimeEventName,
  data: Record<string, unknown>,
  namespace: (typeof REALTIME_NAMESPACE)[keyof typeof REALTIME_NAMESPACE],
): void => {
  try {
    emitToRoom(roomName, eventName, toEventPayload(eventName, roomName, data), namespace);
  } catch (error) {
    if (error instanceof Error && error.message === 'Socket server has not been initialized') {
      return;
    }

    throw error;
  }
};

export const emitAssignmentCreated = (delivery: IDeliveryAssignmentDocument): void => {
  const payload = mapAssignmentRealtimePayload(delivery);

  if (delivery.deliveryAgentId) {
    emitSafely(
      buildDeliveryRoom(delivery.deliveryAgentId.toString()),
      REALTIME_EVENTS.DELIVERY_ASSIGNMENT_CREATED,
      payload,
      REALTIME_NAMESPACE.DELIVERY,
    );
  }

  emitSafely(
    buildCityRoom(delivery.cityId.toString()),
    REALTIME_EVENTS.ADMIN_DELIVERY_ASSIGNMENT_CREATED,
    payload,
    REALTIME_NAMESPACE.ADMIN,
  );
  emitSafely(
    ADMIN_OPERATIONS_ROOM,
    REALTIME_EVENTS.ADMIN_DELIVERY_ASSIGNMENT_CREATED,
    payload,
    REALTIME_NAMESPACE.ADMIN,
  );
};

export const emitPickupCompleted = (delivery: IDeliveryAssignmentDocument): void => {
  const payload = mapPickupRealtimePayload(delivery);

  emitSafely(
    buildVendorRoom(delivery.storeId.toString()),
    REALTIME_EVENTS.VENDOR_PICKUP_COMPLETED,
    payload,
    REALTIME_NAMESPACE.VENDOR,
  );
};

export const emitDeliveryLocationUpdated = (
  delivery: IDeliveryAssignmentDocument,
): void => {
  const payload = mapDeliveryProgressRealtimePayload(delivery);

  emitSafely(
    buildOrderRoom(delivery.orderId.toString()),
    REALTIME_EVENTS.CUSTOMER_DELIVERY_LOCATION_UPDATED,
    payload,
    REALTIME_NAMESPACE.CUSTOMER,
  );
};

export const emitDeliveryProgressUpdated = (
  delivery: IDeliveryAssignmentDocument,
): void => {
  const payload = mapDeliveryProgressRealtimePayload(delivery);

  emitSafely(
    buildOrderRoom(delivery.orderId.toString()),
    REALTIME_EVENTS.CUSTOMER_DELIVERY_PROGRESS_UPDATED,
    payload,
    REALTIME_NAMESPACE.CUSTOMER,
  );
};

export const emitDeliveryCompleted = (delivery: IDeliveryAssignmentDocument): void => {
  const payload = mapDeliveryProgressRealtimePayload(delivery);

  emitSafely(
    buildOrderRoom(delivery.orderId.toString()),
    REALTIME_EVENTS.CUSTOMER_ORDER_DELIVERED,
    payload,
    REALTIME_NAMESPACE.CUSTOMER,
  );
};

export const emitSlaBreachCreated = (delivery: IDeliveryAssignmentDocument): void => {
  const payload = mapSlaBreachRealtimePayload(delivery);

  emitSafely(
    buildCityRoom(delivery.cityId.toString()),
    REALTIME_EVENTS.ADMIN_DELIVERY_SLA_BREACH_CREATED,
    payload,
    REALTIME_NAMESPACE.ADMIN,
  );
  emitSafely(
    ADMIN_OPERATIONS_ROOM,
    REALTIME_EVENTS.ADMIN_DELIVERY_SLA_BREACH_CREATED,
    payload,
    REALTIME_NAMESPACE.ADMIN,
  );
};
