import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ORDER_STATUS } from '../../orders/constants/order-status.constant';
import type { OrderStatus } from '../../orders/constants/order-status.constant';
import { REALTIME_NAMESPACE } from '../../realtime/constants/realtime-events.constant';
import * as socketRoomService from '../../realtime/services/socket-room.service';
import type { RealtimeEventPayload } from '../../realtime/types/realtime.types';
import { ORDER_REALTIME_EVENTS } from '../constants/order-realtime-events.constant';
import {
  emitOrderCancelled,
  emitOrderCreated,
  emitOrderOutForDelivery,
} from '../services/order-realtime-emitter.service';

type MutableSocketRoomService = {
  emitToRoom: typeof socketRoomService.emitToRoom;
};

type EmittedEvent = {
  roomName: string;
  eventName: string;
  payload: RealtimeEventPayload;
  namespace?: string;
};

const mutableSocketRoomService = socketRoomService as unknown as MutableSocketRoomService;
const originalEmitToRoom = mutableSocketRoomService.emitToRoom;

const buildOrder = (
  orderStatus: OrderStatus = ORDER_STATUS.ACCEPTED,
): Record<string, unknown> => ({
  _id: 'order-1',
  customerId: 'customer-1',
  storeId: 'store-1',
  vendorId: 'vendor-1',
  cityId: 'city-1',
  orderStatus,
  paymentStatus: 'paid',
  totalAmount: 499,
  updatedAt: new Date('2026-05-29T10:00:00.000Z'),
});

test.afterEach(() => {
  mutableSocketRoomService.emitToRoom = originalEmitToRoom;
});

test('emitOrderCreated publishes vendor and admin order created events', () => {
  const emitted: EmittedEvent[] = [];
  mutableSocketRoomService.emitToRoom = (roomName, eventName, payload, namespace) => {
    emitted.push({ roomName, eventName, payload, namespace });
  };

  emitOrderCreated(buildOrder(ORDER_STATUS.PLACED));

  assert.deepEqual(
    emitted.map((event) => ({
      roomName: event.roomName,
      eventName: event.eventName,
      namespace: event.namespace,
    })),
    [
      {
        roomName: 'vendor:store-1',
        eventName: ORDER_REALTIME_EVENTS.VENDOR_ORDER_CREATED,
        namespace: REALTIME_NAMESPACE.VENDOR,
      },
      {
        roomName: 'city:city-1',
        eventName: ORDER_REALTIME_EVENTS.ADMIN_ORDER_CREATED,
        namespace: REALTIME_NAMESPACE.ADMIN,
      },
    ],
  );
  assert.equal(emitted[0]?.payload.data.orderId, 'order-1');
  assert.equal(emitted[0]?.payload.data.totalAmount, 499);
});

test('emitOrderOutForDelivery fans out lifecycle and status updates', () => {
  const emitted: EmittedEvent[] = [];
  mutableSocketRoomService.emitToRoom = (roomName, eventName, payload, namespace) => {
    emitted.push({ roomName, eventName, payload, namespace });
  };

  emitOrderOutForDelivery(buildOrder(ORDER_STATUS.SHIPPED));

  assert.ok(
    emitted.some(
      (event) =>
        event.roomName === 'customer:customer-1' &&
        event.eventName === ORDER_REALTIME_EVENTS.CUSTOMER_ORDER_OUT_FOR_DELIVERY,
    ),
  );
  assert.ok(
    emitted.some(
      (event) =>
        event.roomName === 'order:order-1' &&
        event.eventName === ORDER_REALTIME_EVENTS.CUSTOMER_ORDER_STATUS_UPDATED,
    ),
  );
  assert.ok(
    emitted.some(
      (event) =>
        event.roomName === 'vendor:store-1' &&
        event.eventName === ORDER_REALTIME_EVENTS.VENDOR_ORDER_STATUS_UPDATED,
    ),
  );
  assert.ok(
    emitted.every((event) => event.payload.data.eventSource === 'delivery'),
  );
});

test('emitOrderCancelled publishes customer vendor and admin cancellation events', () => {
  const emitted: EmittedEvent[] = [];
  mutableSocketRoomService.emitToRoom = (roomName, eventName, payload, namespace) => {
    emitted.push({ roomName, eventName, payload, namespace });
  };

  emitOrderCancelled(buildOrder(ORDER_STATUS.CANCELLED));

  assert.deepEqual(
    emitted.map((event) => ({
      roomName: event.roomName,
      eventName: event.eventName,
      namespace: event.namespace,
    })),
    [
      {
        roomName: 'customer:customer-1',
        eventName: ORDER_REALTIME_EVENTS.CUSTOMER_ORDER_CANCELLED,
        namespace: REALTIME_NAMESPACE.CUSTOMER,
      },
      {
        roomName: 'order:order-1',
        eventName: ORDER_REALTIME_EVENTS.CUSTOMER_ORDER_CANCELLED,
        namespace: REALTIME_NAMESPACE.CUSTOMER,
      },
      {
        roomName: 'vendor:store-1',
        eventName: ORDER_REALTIME_EVENTS.VENDOR_ORDER_CANCELLED,
        namespace: REALTIME_NAMESPACE.VENDOR,
      },
      {
        roomName: 'city:city-1',
        eventName: ORDER_REALTIME_EVENTS.ADMIN_ORDER_CANCELLED,
        namespace: REALTIME_NAMESPACE.ADMIN,
      },
    ],
  );
});
