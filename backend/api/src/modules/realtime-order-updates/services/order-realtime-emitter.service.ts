import { REALTIME_NAMESPACE } from '../../realtime/constants/realtime-events.constant';
import type { RealtimeEventPayload } from '../../realtime/types/realtime.types';
import * as socketRoomService from '../../realtime/services/socket-room.service';
import { ORDER_REALTIME_EVENTS } from '../constants/order-realtime-events.constant';
import type { OrderRealtimeEventName } from '../constants/order-realtime-events.constant';
import type { OrderRealtimePayload } from '../types/order-realtime.types';
import { mapOrderRealtimePayload } from '../utils/order-realtime-payload.mapper';
import { validateOrderRealtimePayload } from '../validators/order-realtime-payload.validator';
import {
  buildCityRoom,
  buildCustomerRoom,
  buildOrderRoom,
  buildVendorRoom,
} from './order-realtime-room.service';

const toEventPayload = (
  eventName: OrderRealtimeEventName,
  roomName: string,
  data: OrderRealtimePayload,
): RealtimeEventPayload => ({
  eventName: eventName as RealtimeEventPayload['eventName'],
  roomName,
  emittedAt: new Date().toISOString(),
  data,
});

const emitSafely = (
  roomName: string,
  eventName: OrderRealtimeEventName,
  data: OrderRealtimePayload,
  namespace: (typeof REALTIME_NAMESPACE)[keyof typeof REALTIME_NAMESPACE],
): void => {
  validateOrderRealtimePayload(eventName, data);

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

export const emitOrderCreated = (order: unknown): void => {
  const payload = mapOrderRealtimePayload(order);

  emitSafely(
    buildVendorRoom(payload.storeId),
    ORDER_REALTIME_EVENTS.VENDOR_ORDER_CREATED,
    payload,
    REALTIME_NAMESPACE.VENDOR,
  );

  if (payload.cityId) {
    emitSafely(
      buildCityRoom(payload.cityId),
      ORDER_REALTIME_EVENTS.ADMIN_ORDER_CREATED,
      payload,
      REALTIME_NAMESPACE.ADMIN,
    );
  }
};

export const emitOrderStatusUpdated = (
  order: unknown,
  eventSource: OrderRealtimePayload['eventSource'] = 'order',
): void => {
  const payload = mapOrderRealtimePayload(order, eventSource);

  emitSafely(
    buildCustomerRoom(payload.customerId),
    ORDER_REALTIME_EVENTS.CUSTOMER_ORDER_STATUS_UPDATED,
    payload,
    REALTIME_NAMESPACE.CUSTOMER,
  );
  emitSafely(
    buildOrderRoom(payload.orderId),
    ORDER_REALTIME_EVENTS.CUSTOMER_ORDER_STATUS_UPDATED,
    payload,
    REALTIME_NAMESPACE.CUSTOMER,
  );
  emitSafely(
    buildVendorRoom(payload.storeId),
    ORDER_REALTIME_EVENTS.VENDOR_ORDER_STATUS_UPDATED,
    payload,
    REALTIME_NAMESPACE.VENDOR,
  );

  if (payload.cityId) {
    emitSafely(
      buildCityRoom(payload.cityId),
      ORDER_REALTIME_EVENTS.ADMIN_ORDER_STATUS_UPDATED,
      payload,
      REALTIME_NAMESPACE.ADMIN,
    );
  }
};

const emitCustomerLifecycleEvent = (
  order: unknown,
  eventName: OrderRealtimeEventName,
  eventSource: OrderRealtimePayload['eventSource'] = 'order',
): void => {
  const payload = mapOrderRealtimePayload(order, eventSource);

  emitSafely(
    buildCustomerRoom(payload.customerId),
    eventName,
    payload,
    REALTIME_NAMESPACE.CUSTOMER,
  );
  emitSafely(
    buildOrderRoom(payload.orderId),
    eventName,
    payload,
    REALTIME_NAMESPACE.CUSTOMER,
  );
};

export const emitOrderAccepted = (order: unknown): void => {
  emitCustomerLifecycleEvent(order, ORDER_REALTIME_EVENTS.CUSTOMER_ORDER_ACCEPTED);
  emitOrderStatusUpdated(order);
};

export const emitOrderPacked = (order: unknown): void => {
  emitCustomerLifecycleEvent(order, ORDER_REALTIME_EVENTS.CUSTOMER_ORDER_PACKED);
  emitOrderStatusUpdated(order);
};

export const emitOrderReadyForPickup = (order: unknown): void => {
  emitCustomerLifecycleEvent(order, ORDER_REALTIME_EVENTS.CUSTOMER_ORDER_READY_FOR_PICKUP);
  emitOrderStatusUpdated(order);
};

export const emitOrderOutForDelivery = (order: unknown): void => {
  emitCustomerLifecycleEvent(
    order,
    ORDER_REALTIME_EVENTS.CUSTOMER_ORDER_OUT_FOR_DELIVERY,
    'delivery',
  );
  emitOrderStatusUpdated(order, 'delivery');
};

export const emitOrderDelivered = (order: unknown): void => {
  emitCustomerLifecycleEvent(
    order,
    ORDER_REALTIME_EVENTS.CUSTOMER_ORDER_DELIVERED,
    'delivery',
  );
  emitOrderStatusUpdated(order, 'delivery');
};

export const emitOrderCancelled = (order: unknown): void => {
  const payload = mapOrderRealtimePayload(order);

  emitSafely(
    buildCustomerRoom(payload.customerId),
    ORDER_REALTIME_EVENTS.CUSTOMER_ORDER_CANCELLED,
    payload,
    REALTIME_NAMESPACE.CUSTOMER,
  );
  emitSafely(
    buildOrderRoom(payload.orderId),
    ORDER_REALTIME_EVENTS.CUSTOMER_ORDER_CANCELLED,
    payload,
    REALTIME_NAMESPACE.CUSTOMER,
  );
  emitSafely(
    buildVendorRoom(payload.storeId),
    ORDER_REALTIME_EVENTS.VENDOR_ORDER_CANCELLED,
    payload,
    REALTIME_NAMESPACE.VENDOR,
  );

  if (payload.cityId) {
    emitSafely(
      buildCityRoom(payload.cityId),
      ORDER_REALTIME_EVENTS.ADMIN_ORDER_CANCELLED,
      payload,
      REALTIME_NAMESPACE.ADMIN,
    );
  }
};
