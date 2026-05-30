import assert from 'node:assert/strict';
import { test } from 'node:test';
import { INTERNAL_EVENT_NAMES } from '../constants/internal-event-names.constant';
import {
  clearInternalEventSubscribersForTests,
  subscribeToInternalEvent,
} from '../services/internal-event-bus.service';
import type { InternalEventEnvelope } from '../types/internal-event.types';
import {
  publishAssignmentCreated,
  publishDeliveryCompleted,
  publishDeliveryFailed,
  publishDeliveryLocationUpdated,
  publishPickupCompleted,
} from '../publishers/delivery-event.publisher';

test.afterEach(() => {
  clearInternalEventSubscribersForTests();
});

test('delivery publisher emits assignment created with sanitized payload', () => {
  const received: InternalEventEnvelope[] = [];

  subscribeToInternalEvent(INTERNAL_EVENT_NAMES.DELIVERY_ASSIGNMENT_CREATED, (event) => {
    received.push(event);
  });

  publishAssignmentCreated({
    _id: 'assignment-1',
    orderId: 'order-1',
    customerId: 'customer-1',
    deliveryAgentId: 'agent-1',
    storeId: 'store-1',
    cityId: 'city-1',
    deliveryStatus: 'assigned',
    internalNotes: 'do not expose',
  });

  assert.equal(received[0]?.eventName, INTERNAL_EVENT_NAMES.DELIVERY_ASSIGNMENT_CREATED);
  assert.equal(received[0]?.metadata.sourceModule, 'delivery');
  assert.deepEqual(received[0]?.payload, {
    orderId: 'order-1',
    assignmentId: 'assignment-1',
    customerId: 'customer-1',
    deliveryAgentId: 'agent-1',
    storeId: 'store-1',
    cityId: 'city-1',
    assignmentStatus: 'assigned',
  });
});

test('delivery publisher emits pickup completion payload', () => {
  const received: InternalEventEnvelope[] = [];

  subscribeToInternalEvent(INTERNAL_EVENT_NAMES.DELIVERY_PICKUP_COMPLETED, (event) => {
    received.push(event);
  });

  publishPickupCompleted({
    _id: 'assignment-1',
    orderId: 'order-1',
    customerId: 'customer-1',
    deliveryAgentId: 'agent-1',
    storeId: 'store-1',
    deliveryStatus: 'picked_up',
  });

  assert.equal(received[0]?.eventName, INTERNAL_EVENT_NAMES.DELIVERY_PICKUP_COMPLETED);
  assert.equal(received[0]?.payload.pickupStatus, 'picked_up');
});

test('delivery publisher emits location update payload', () => {
  const received: InternalEventEnvelope[] = [];

  subscribeToInternalEvent(INTERNAL_EVENT_NAMES.DELIVERY_LOCATION_UPDATED, (event) => {
    received.push(event);
  });

  publishDeliveryLocationUpdated({
    _id: 'assignment-1',
    orderId: 'order-1',
    customerId: 'customer-1',
    deliveryAgentId: 'agent-1',
    storeId: 'store-1',
    cityId: 'city-1',
    deliveryStatus: 'arrived_at_customer',
    currentLatitude: 28.6139,
    currentLongitude: 77.209,
    lastLocationUpdatedAt: '2026-05-29T01:10:00.000Z',
    estimatedDeliveryAt: '2026-05-29T01:20:00.000Z',
    updatedAt: '2026-05-29T01:10:00.000Z',
  });

  assert.equal(received[0]?.eventName, INTERNAL_EVENT_NAMES.DELIVERY_LOCATION_UPDATED);
  assert.deepEqual(received[0]?.payload, {
    orderId: 'order-1',
    assignmentId: 'assignment-1',
    customerId: 'customer-1',
    deliveryAgentId: 'agent-1',
    storeId: 'store-1',
    cityId: 'city-1',
    progressStatus: 'arrived_at_customer',
    currentLatitude: 28.6139,
    currentLongitude: 77.209,
    lastLocationUpdatedAt: '2026-05-29T01:10:00.000Z',
    estimatedDeliveryAt: '2026-05-29T01:20:00.000Z',
    updatedAt: '2026-05-29T01:10:00.000Z',
  });
});

test('delivery publisher emits completion and failure events', () => {
  const received: InternalEventEnvelope[] = [];

  subscribeToInternalEvent(INTERNAL_EVENT_NAMES.DELIVERY_COMPLETED, (event) => {
    received.push(event);
  });
  subscribeToInternalEvent(INTERNAL_EVENT_NAMES.DELIVERY_FAILED, (event) => {
    received.push(event);
  });

  publishDeliveryCompleted({
    _id: 'assignment-1',
    orderId: 'order-1',
    customerId: 'customer-1',
    deliveryAgentId: 'agent-1',
    deliveryStatus: 'delivered',
    deliveredAt: new Date('2026-05-29T01:00:00.000Z'),
  });
  publishDeliveryFailed({
    _id: 'assignment-2',
    orderId: 'order-2',
    customerId: 'customer-2',
    deliveryAgentId: 'agent-2',
    deliveryStatus: 'failed',
  });

  assert.equal(received.length, 2);
  assert.equal(received[0]?.payload.completedAt, '2026-05-29T01:00:00.000Z');
  assert.equal(received[1]?.payload.progressStatus, 'failed');
});
