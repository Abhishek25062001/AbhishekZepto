import assert from 'node:assert/strict';
import { test } from 'node:test';

import { DELIVERY_STATUS } from '../../delivery/constants/delivery-status.constant';
import { REALTIME_NAMESPACE } from '../../realtime/constants/realtime-events.constant';
import * as socketRoomService from '../../realtime/services/socket-room.service';
import type { RealtimeEventPayload } from '../../realtime/types/realtime.types';
import { DELIVERY_TRACKING_REALTIME_EVENTS } from '../constants/delivery-tracking-events.constant';
import {
  emitDeliveryFailed,
  emitDeliveryLocationUpdated,
  emitDeliveryProgressUpdated,
  emitOrderDelivered,
  emitRiderReachedCustomer,
} from '../services/delivery-tracking-realtime-emitter.service';

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

const buildProgress = (overrides: Record<string, unknown> = {}): Record<string, unknown> => ({
  _id: 'assignment-1',
  orderId: 'order-1',
  deliveryAgentId: 'agent-1',
  customerId: 'customer-1',
  storeId: 'store-1',
  cityId: 'city-1',
  progressStatus: DELIVERY_STATUS.EN_ROUTE_TO_CUSTOMER,
  currentLatitude: 28.6139,
  currentLongitude: 77.209,
  lastLocationUpdatedAt: new Date('2026-05-01T10:00:00.000Z'),
  estimatedDeliveryAt: new Date('2026-05-01T10:20:00.000Z'),
  updatedAt: new Date('2026-05-01T10:01:00.000Z'),
  ...overrides,
});

test.afterEach(() => {
  mutableSocketRoomService.emitToRoom = originalEmitToRoom;
});

test('emitDeliveryLocationUpdated emits customer admin and delivery ack events', () => {
  const emitted: EmittedEvent[] = [];
  mutableSocketRoomService.emitToRoom = (roomName, eventName, payload, namespace) => {
    emitted.push({ roomName, eventName, payload, namespace });
  };

  emitDeliveryLocationUpdated(buildProgress());

  assert.deepEqual(
    emitted.map((event) => ({
      roomName: event.roomName,
      eventName: event.eventName,
      namespace: event.namespace,
    })),
    [
      {
        roomName: 'order:order-1',
        eventName: DELIVERY_TRACKING_REALTIME_EVENTS.CUSTOMER_DELIVERY_LOCATION_UPDATED,
        namespace: REALTIME_NAMESPACE.CUSTOMER,
      },
      {
        roomName: 'city:city-1',
        eventName: DELIVERY_TRACKING_REALTIME_EVENTS.ADMIN_DELIVERY_LOCATION_UPDATED,
        namespace: REALTIME_NAMESPACE.ADMIN,
      },
      {
        roomName: 'delivery:agent-1',
        eventName: DELIVERY_TRACKING_REALTIME_EVENTS.DELIVERY_LOCATION_SYNC_ACKNOWLEDGED,
        namespace: REALTIME_NAMESPACE.DELIVERY,
      },
    ],
  );
  assert.equal(emitted[0]?.payload.data.orderId, 'order-1');
  assert.equal(emitted[0]?.payload.data.currentLatitude, 28.6139);
});

test('emitDeliveryLocationUpdated rejects invalid location payloads to delivery room only', () => {
  const emitted: EmittedEvent[] = [];
  mutableSocketRoomService.emitToRoom = (roomName, eventName, payload, namespace) => {
    emitted.push({ roomName, eventName, payload, namespace });
  };

  emitDeliveryLocationUpdated(buildProgress({ currentLatitude: null }));

  assert.deepEqual(
    emitted.map((event) => ({
      roomName: event.roomName,
      eventName: event.eventName,
      namespace: event.namespace,
    })),
    [
      {
        roomName: 'delivery:agent-1',
        eventName: DELIVERY_TRACKING_REALTIME_EVENTS.DELIVERY_LOCATION_SYNC_REJECTED,
        namespace: REALTIME_NAMESPACE.DELIVERY,
      },
    ],
  );
});

test('emitDeliveryProgressUpdated emits customer and admin progress events', () => {
  const emitted: EmittedEvent[] = [];
  mutableSocketRoomService.emitToRoom = (roomName, eventName, payload, namespace) => {
    emitted.push({ roomName, eventName, payload, namespace });
  };

  emitDeliveryProgressUpdated(buildProgress({ progressStatus: DELIVERY_STATUS.PICKED_UP }));

  assert.deepEqual(
    emitted.map((event) => ({
      roomName: event.roomName,
      eventName: event.eventName,
      namespace: event.namespace,
    })),
    [
      {
        roomName: 'order:order-1',
        eventName: DELIVERY_TRACKING_REALTIME_EVENTS.CUSTOMER_DELIVERY_PROGRESS_UPDATED,
        namespace: REALTIME_NAMESPACE.CUSTOMER,
      },
      {
        roomName: 'city:city-1',
        eventName: DELIVERY_TRACKING_REALTIME_EVENTS.ADMIN_DELIVERY_PROGRESS_UPDATED,
        namespace: REALTIME_NAMESPACE.ADMIN,
      },
    ],
  );
});

test('specialized emitters emit customer and admin lifecycle events', () => {
  const emitted: EmittedEvent[] = [];
  mutableSocketRoomService.emitToRoom = (roomName, eventName, payload, namespace) => {
    emitted.push({ roomName, eventName, payload, namespace });
  };

  emitRiderReachedCustomer(buildProgress({ progressStatus: DELIVERY_STATUS.ARRIVED_AT_CUSTOMER }));
  emitOrderDelivered(buildProgress({ progressStatus: DELIVERY_STATUS.DELIVERED }));
  emitDeliveryFailed(buildProgress({ progressStatus: DELIVERY_STATUS.FAILED }));

  assert.deepEqual(
    emitted.map((event) => ({
      roomName: event.roomName,
      eventName: event.eventName,
      namespace: event.namespace,
    })),
    [
      {
        roomName: 'order:order-1',
        eventName: DELIVERY_TRACKING_REALTIME_EVENTS.CUSTOMER_RIDER_REACHED_CUSTOMER,
        namespace: REALTIME_NAMESPACE.CUSTOMER,
      },
      {
        roomName: 'order:order-1',
        eventName: DELIVERY_TRACKING_REALTIME_EVENTS.CUSTOMER_ORDER_DELIVERED,
        namespace: REALTIME_NAMESPACE.CUSTOMER,
      },
      {
        roomName: 'order:order-1',
        eventName: DELIVERY_TRACKING_REALTIME_EVENTS.CUSTOMER_DELIVERY_FAILED,
        namespace: REALTIME_NAMESPACE.CUSTOMER,
      },
      {
        roomName: 'city:city-1',
        eventName: DELIVERY_TRACKING_REALTIME_EVENTS.ADMIN_DELIVERY_FAILED,
        namespace: REALTIME_NAMESPACE.ADMIN,
      },
    ],
  );
});
