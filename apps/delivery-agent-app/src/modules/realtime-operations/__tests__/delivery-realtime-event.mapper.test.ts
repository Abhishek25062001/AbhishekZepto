import assert from 'node:assert/strict';
import { test } from 'node:test';

import { mapDeliveryRealtimeEventPayload } from '../utils/delivery-realtime-event.mapper';
import { DELIVERY_REALTIME_EVENTS } from '../types/delivery-realtime.types';

test('maps assignment created payload with deliveryId fallback', () => {
  const event = mapDeliveryRealtimeEventPayload(
    {
      eventName: DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CREATED,
      emittedAt: '2026-01-01T10:00:01.000Z',
      data: {
        deliveryId: 'assignment-1',
        orderId: 'order-1',
        assignmentStatus: 'assigned',
        assignmentCode: 'DEL-100',
        pickupEta: '2026-01-01T10:15:00.000Z',
        updatedAt: '2026-01-01T10:00:00.000Z',
      },
    },
    DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CREATED,
  );

  assert.equal(event?.eventName, DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CREATED);
  assert.equal(event?.assignmentId, 'assignment-1');
  assert.equal(event?.deliveryStatus, 'assigned');
});

test('maps rejected location sync status event with rejection reason', () => {
  const event = mapDeliveryRealtimeEventPayload(
    {
      data: {
        assignmentId: 'assignment-1',
        orderId: 'order-1',
        status: 'en_route_to_customer',
        rejectionReason: 'location too old',
        lastLocationUpdatedAt: '2026-01-01T10:00:00.000Z',
      },
    },
    DELIVERY_REALTIME_EVENTS.LOCATION_SYNC_REJECTED,
  );

  assert.equal(event?.eventName, DELIVERY_REALTIME_EVENTS.LOCATION_SYNC_REJECTED);
  assert.equal(event?.assignmentId, 'assignment-1');
  assert.equal(event?.deliveryStatus, 'en_route_to_customer');
  assert.equal(event && 'rejectionReason' in event ? event.rejectionReason : null, 'location too old');
});

test('returns null for malformed realtime payloads', () => {
  const event = mapDeliveryRealtimeEventPayload(
    {
      data: {
        assignmentId: '',
        orderId: 'order-1',
        deliveryStatus: 'assigned',
        updatedAt: '2026-01-01T10:00:00.000Z',
      },
    },
    DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CREATED,
  );

  assert.equal(event, null);
});

