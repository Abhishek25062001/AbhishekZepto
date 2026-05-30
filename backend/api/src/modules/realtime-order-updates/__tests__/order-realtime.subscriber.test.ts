import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AUTH_ROLE } from '../../auth/constants/auth-role.constants';
import { INTERNAL_EVENT_NAMES } from '../../internal-events/constants/internal-event-names.constant';
import {
  clearInternalEventSubscribersForTests,
  publishInternalEvent,
} from '../../internal-events/services/internal-event-bus.service';
import type { InternalEventMetadata } from '../../internal-events/types/internal-event.types';
import { ORDER_STATUS } from '../../orders/constants/order-status.constant';
import * as orderRealtimeEmitterService from '../services/order-realtime-emitter.service';
import {
  registerOrderRealtimeSubscriber,
  unregisterOrderRealtimeSubscriber,
} from '../subscribers/order-realtime.subscriber';

type MutableOrderRealtimeEmitterService = {
  emitOrderCreated: typeof orderRealtimeEmitterService.emitOrderCreated;
  emitOrderAccepted: typeof orderRealtimeEmitterService.emitOrderAccepted;
  emitOrderPacked: typeof orderRealtimeEmitterService.emitOrderPacked;
  emitOrderReadyForPickup: typeof orderRealtimeEmitterService.emitOrderReadyForPickup;
  emitOrderOutForDelivery: typeof orderRealtimeEmitterService.emitOrderOutForDelivery;
  emitOrderCancelled: typeof orderRealtimeEmitterService.emitOrderCancelled;
  emitOrderDelivered: typeof orderRealtimeEmitterService.emitOrderDelivered;
};

const mutableEmitter =
  orderRealtimeEmitterService as unknown as MutableOrderRealtimeEmitterService;

const originalEmitter = {
  emitOrderCreated: mutableEmitter.emitOrderCreated,
  emitOrderAccepted: mutableEmitter.emitOrderAccepted,
  emitOrderPacked: mutableEmitter.emitOrderPacked,
  emitOrderReadyForPickup: mutableEmitter.emitOrderReadyForPickup,
  emitOrderOutForDelivery: mutableEmitter.emitOrderOutForDelivery,
  emitOrderCancelled: mutableEmitter.emitOrderCancelled,
  emitOrderDelivered: mutableEmitter.emitOrderDelivered,
};

const metadata = (eventName: string): InternalEventMetadata => ({
  eventId: `${eventName}-id`,
  eventName: eventName as InternalEventMetadata['eventName'],
  sourceModule: 'orders',
  actorId: 'actor-1',
  actorRole: AUTH_ROLE.STORE_MANAGER,
  requestId: null,
  traceId: null,
  createdAt: '2026-05-29T10:00:00.000Z',
});

const payload = (orderStatus: string): Record<string, unknown> => ({
  orderId: 'order-1',
  orderNumber: 'ORD-1',
  customerId: 'customer-1',
  storeId: 'store-1',
  vendorId: 'vendor-1',
  cityId: 'city-1',
  orderStatus,
  paymentStatus: 'paid',
  totalAmount: 499,
  updatedAt: '2026-05-29T11:00:00.000Z',
});

test.afterEach(() => {
  unregisterOrderRealtimeSubscriber();
  clearInternalEventSubscribersForTests();
  Object.assign(mutableEmitter, originalEmitter);
});

test('order realtime subscriber maps internal order events to emitters', () => {
  const calls: Array<{ name: string; order: Record<string, unknown> }> = [];
  mutableEmitter.emitOrderCreated = (order) => {
    calls.push({ name: 'created', order: order as Record<string, unknown> });
  };
  mutableEmitter.emitOrderAccepted = (order) => {
    calls.push({ name: 'accepted', order: order as Record<string, unknown> });
  };
  mutableEmitter.emitOrderPacked = (order) => {
    calls.push({ name: 'packed', order: order as Record<string, unknown> });
  };
  mutableEmitter.emitOrderReadyForPickup = (order) => {
    calls.push({ name: 'ready', order: order as Record<string, unknown> });
  };
  mutableEmitter.emitOrderOutForDelivery = (order) => {
    calls.push({ name: 'out', order: order as Record<string, unknown> });
  };
  mutableEmitter.emitOrderCancelled = (order) => {
    calls.push({ name: 'cancelled', order: order as Record<string, unknown> });
  };
  mutableEmitter.emitOrderDelivered = (order) => {
    calls.push({ name: 'delivered', order: order as Record<string, unknown> });
  };

  registerOrderRealtimeSubscriber();

  publishInternalEvent(
    INTERNAL_EVENT_NAMES.ORDER_CREATED,
    payload(ORDER_STATUS.PLACED),
    metadata(INTERNAL_EVENT_NAMES.ORDER_CREATED),
  );
  publishInternalEvent(
    INTERNAL_EVENT_NAMES.ORDER_ACCEPTED,
    payload(ORDER_STATUS.ACCEPTED),
    metadata(INTERNAL_EVENT_NAMES.ORDER_ACCEPTED),
  );
  publishInternalEvent(
    INTERNAL_EVENT_NAMES.ORDER_PACKED,
    payload(ORDER_STATUS.PACKING),
    metadata(INTERNAL_EVENT_NAMES.ORDER_PACKED),
  );
  publishInternalEvent(
    INTERNAL_EVENT_NAMES.ORDER_READY_FOR_PICKUP,
    payload(ORDER_STATUS.READY_FOR_PICKUP),
    metadata(INTERNAL_EVENT_NAMES.ORDER_READY_FOR_PICKUP),
  );
  publishInternalEvent(
    INTERNAL_EVENT_NAMES.ORDER_OUT_FOR_DELIVERY,
    payload(ORDER_STATUS.SHIPPED),
    metadata(INTERNAL_EVENT_NAMES.ORDER_OUT_FOR_DELIVERY),
  );
  publishInternalEvent(
    INTERNAL_EVENT_NAMES.ORDER_CANCELLED,
    payload(ORDER_STATUS.CANCELLED),
    metadata(INTERNAL_EVENT_NAMES.ORDER_CANCELLED),
  );
  publishInternalEvent(
    INTERNAL_EVENT_NAMES.ORDER_DELIVERED,
    payload(ORDER_STATUS.DELIVERED),
    metadata(INTERNAL_EVENT_NAMES.ORDER_DELIVERED),
  );

  assert.deepEqual(
    calls.map((call) => call.name),
    ['created', 'accepted', 'packed', 'ready', 'out', 'cancelled', 'delivered'],
  );
  assert.equal(calls[0]?.order._id, 'order-1');
  assert.equal(calls[0]?.order.orderId, 'order-1');
  assert.equal(calls[0]?.order.updatedAt, '2026-05-29T11:00:00.000Z');
});

test('order realtime subscriber uses metadata timestamp when payload omits updatedAt', () => {
  const calls: Array<Record<string, unknown>> = [];
  mutableEmitter.emitOrderCreated = (order) => {
    calls.push(order as Record<string, unknown>);
  };

  registerOrderRealtimeSubscriber();

  publishInternalEvent(
    INTERNAL_EVENT_NAMES.ORDER_CREATED,
    {
      orderId: 'order-1',
      customerId: 'customer-1',
      storeId: 'store-1',
      orderStatus: ORDER_STATUS.PLACED,
    },
    metadata(INTERNAL_EVENT_NAMES.ORDER_CREATED),
  );

  assert.equal(calls[0]?.updatedAt, '2026-05-29T10:00:00.000Z');
});
