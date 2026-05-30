import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  isDeliveryRealtimeEventStale,
  shouldIgnoreAssignmentRealtimeEvent,
  shouldIgnoreStatusRealtimeEvent,
} from '../utils/delivery-realtime-stale-event.util';
import { DELIVERY_REALTIME_EVENTS } from '../types/delivery-realtime.types';

test('detects realtime events older than the latest accepted timestamp', () => {
  assert.equal(
    isDeliveryRealtimeEventStale(
      '2026-01-01T09:59:59.000Z',
      '2026-01-01T10:00:00.000Z',
    ),
    true,
  );
  assert.equal(
    isDeliveryRealtimeEventStale(
      '2026-01-01T10:00:01.000Z',
      '2026-01-01T10:00:00.000Z',
    ),
    false,
  );
});

test('ignores stale assignment events for the same assignment only', () => {
  assert.equal(
    shouldIgnoreAssignmentRealtimeEvent(
      {
        eventName: DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CREATED,
        assignmentId: 'assignment-1',
        orderId: 'order-1',
        deliveryStatus: 'assigned',
        assignmentCode: null,
        pickupEta: null,
        updatedAt: '2026-01-01T09:59:59.000Z',
        emittedAt: null,
        eventId: null,
        assignment: null,
      },
      {
        eventName: DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CREATED,
        assignmentId: 'assignment-1',
        orderId: 'order-1',
        deliveryStatus: 'assigned',
        assignmentCode: null,
        pickupEta: null,
        updatedAt: '2026-01-01T10:00:00.000Z',
        emittedAt: null,
        eventId: null,
        assignment: null,
      },
    ),
    true,
  );
});

test('ignores stale status events for the same assignment only', () => {
  assert.equal(
    shouldIgnoreStatusRealtimeEvent(
      {
        eventName: DELIVERY_REALTIME_EVENTS.DELIVERY_STATUS_UPDATED,
        assignmentId: 'assignment-1',
        orderId: 'order-1',
        deliveryStatus: 'picked_up',
        updatedAt: '2026-01-01T09:59:59.000Z',
        emittedAt: null,
        eventId: null,
        rejectionReason: null,
      },
      {
        eventName: DELIVERY_REALTIME_EVENTS.DELIVERY_STATUS_UPDATED,
        assignmentId: 'assignment-1',
        orderId: 'order-1',
        deliveryStatus: 'en_route_to_customer',
        updatedAt: '2026-01-01T10:00:00.000Z',
        emittedAt: null,
        eventId: null,
        rejectionReason: null,
      },
    ),
    true,
  );
});

