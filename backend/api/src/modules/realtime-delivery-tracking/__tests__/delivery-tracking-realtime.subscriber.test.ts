import assert from 'node:assert/strict';
import { test } from 'node:test';

import { INTERNAL_EVENT_NAMES } from '../../internal-events/constants/internal-event-names.constant';
import {
  clearInternalEventSubscribersForTests,
  publishInternalEvent,
} from '../../internal-events/services/internal-event-bus.service';
import type {
  InternalEventMetadata,
  InternalEventPayload,
} from '../../internal-events/types/internal-event.types';
import { DELIVERY_STATUS } from '../../delivery/constants/delivery-status.constant';
import * as deliveryTrackingRealtimeEmitterService from '../services/delivery-tracking-realtime-emitter.service';
import { registerDeliveryTrackingRealtimeSubscriber } from '../subscribers/delivery-tracking-realtime.subscriber';

type MutableDeliveryTrackingEmitter = {
  emitDeliveryLocationUpdated: typeof deliveryTrackingRealtimeEmitterService.emitDeliveryLocationUpdated;
  emitDeliveryProgressUpdated: typeof deliveryTrackingRealtimeEmitterService.emitDeliveryProgressUpdated;
  emitRiderReachedCustomer: typeof deliveryTrackingRealtimeEmitterService.emitRiderReachedCustomer;
  emitOrderDelivered: typeof deliveryTrackingRealtimeEmitterService.emitOrderDelivered;
  emitDeliveryFailed: typeof deliveryTrackingRealtimeEmitterService.emitDeliveryFailed;
};

const deliveryTrackingEmitter =
  deliveryTrackingRealtimeEmitterService as unknown as MutableDeliveryTrackingEmitter;

const originalEmitDeliveryLocationUpdated =
  deliveryTrackingEmitter.emitDeliveryLocationUpdated;
const originalEmitDeliveryProgressUpdated =
  deliveryTrackingEmitter.emitDeliveryProgressUpdated;
const originalEmitRiderReachedCustomer = deliveryTrackingEmitter.emitRiderReachedCustomer;
const originalEmitOrderDelivered = deliveryTrackingEmitter.emitOrderDelivered;
const originalEmitDeliveryFailed = deliveryTrackingEmitter.emitDeliveryFailed;

const buildMetadata = (
  eventName: InternalEventMetadata['eventName'],
): InternalEventMetadata => ({
  eventId: `event-${eventName}`,
  eventName,
  sourceModule: 'test',
  actorId: null,
  actorRole: null,
  requestId: null,
  traceId: null,
  createdAt: '2026-05-01T10:00:00.000Z',
});

const trackingPayload = (
  progressStatus = DELIVERY_STATUS.EN_ROUTE_TO_CUSTOMER,
): InternalEventPayload => ({
  assignmentId: 'assignment-1',
  orderId: 'order-1',
  customerId: 'customer-1',
  deliveryAgentId: 'agent-1',
  storeId: 'store-1',
  cityId: 'city-1',
  progressStatus,
  currentLatitude: 28.6139,
  currentLongitude: 77.209,
  lastLocationUpdatedAt: '2026-05-01T10:00:00.000Z',
  estimatedDeliveryAt: '2026-05-01T10:20:00.000Z',
  updatedAt: '2026-05-01T10:01:00.000Z',
});

test.afterEach(() => {
  deliveryTrackingEmitter.emitDeliveryLocationUpdated =
    originalEmitDeliveryLocationUpdated;
  deliveryTrackingEmitter.emitDeliveryProgressUpdated =
    originalEmitDeliveryProgressUpdated;
  deliveryTrackingEmitter.emitRiderReachedCustomer = originalEmitRiderReachedCustomer;
  deliveryTrackingEmitter.emitOrderDelivered = originalEmitOrderDelivered;
  deliveryTrackingEmitter.emitDeliveryFailed = originalEmitDeliveryFailed;
  clearInternalEventSubscribersForTests();
});

test('delivery tracking subscriber routes internal delivery events to realtime emitters', () => {
  const calls: Array<{ eventType: string; source: Record<string, unknown> }> = [];

  deliveryTrackingEmitter.emitDeliveryLocationUpdated = (source) => {
    calls.push({ eventType: 'location_updated', source: source as Record<string, unknown> });
  };
  deliveryTrackingEmitter.emitDeliveryProgressUpdated = (source) => {
    calls.push({ eventType: 'progress_updated', source: source as Record<string, unknown> });
  };
  deliveryTrackingEmitter.emitRiderReachedCustomer = (source) => {
    calls.push({ eventType: 'reached_customer', source: source as Record<string, unknown> });
  };
  deliveryTrackingEmitter.emitOrderDelivered = (source) => {
    calls.push({ eventType: 'delivered', source: source as Record<string, unknown> });
  };
  deliveryTrackingEmitter.emitDeliveryFailed = (source) => {
    calls.push({ eventType: 'failed', source: source as Record<string, unknown> });
  };

  registerDeliveryTrackingRealtimeSubscriber();

  publishInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_LOCATION_UPDATED,
    trackingPayload(),
    buildMetadata(INTERNAL_EVENT_NAMES.DELIVERY_LOCATION_UPDATED),
  );
  publishInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_OUT_FOR_DELIVERY,
    trackingPayload(DELIVERY_STATUS.EN_ROUTE_TO_CUSTOMER),
    buildMetadata(INTERNAL_EVENT_NAMES.DELIVERY_OUT_FOR_DELIVERY),
  );
  publishInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_REACHED_CUSTOMER,
    trackingPayload(DELIVERY_STATUS.ARRIVED_AT_CUSTOMER),
    buildMetadata(INTERNAL_EVENT_NAMES.DELIVERY_REACHED_CUSTOMER),
  );
  publishInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_COMPLETED,
    trackingPayload(DELIVERY_STATUS.DELIVERED),
    buildMetadata(INTERNAL_EVENT_NAMES.DELIVERY_COMPLETED),
  );
  publishInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_FAILED,
    trackingPayload(DELIVERY_STATUS.FAILED),
    buildMetadata(INTERNAL_EVENT_NAMES.DELIVERY_FAILED),
  );

  assert.deepEqual(
    calls.map((call) => call.eventType),
    [
      'location_updated',
      'progress_updated',
      'reached_customer',
      'delivered',
      'failed',
    ],
  );
  assert.equal(calls[0]?.source._id, 'assignment-1');
  assert.equal(calls[0]?.source.updatedAt, '2026-05-01T10:01:00.000Z');
  assert.equal(calls[2]?.source.progressStatus, DELIVERY_STATUS.ARRIVED_AT_CUSTOMER);
});
