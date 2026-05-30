import assert from 'node:assert/strict';
import { test } from 'node:test';

import { VENDOR_REALTIME_EVENTS } from '../types/vendor-realtime.types';
import {
  isVendorRealtimeEventStale,
  shouldIgnoreVendorOrderRealtimeEvent,
  shouldIgnoreVendorPickupRealtimeEvent,
} from '../utils/vendor-realtime-stale-event.util';

test('detects vendor realtime events older than the latest accepted timestamp', () => {
  assert.equal(
    isVendorRealtimeEventStale(
      '2026-01-01T09:59:59.000Z',
      '2026-01-01T10:00:00.000Z',
    ),
    true,
  );
  assert.equal(
    isVendorRealtimeEventStale(
      '2026-01-01T10:00:00.000Z',
      '2026-01-01T10:00:00.000Z',
    ),
    false,
  );
});

test('ignores stale order events for the same order only', () => {
  assert.equal(
    shouldIgnoreVendorOrderRealtimeEvent(
      {
        eventName: VENDOR_REALTIME_EVENTS.ORDER_STATUS_UPDATED,
        orderId: 'order-1',
        storeId: 'store-1',
        orderStatus: 'accepted',
        totalAmount: 120,
        itemCount: 2,
        updatedAt: '2026-01-01T09:59:59.000Z',
        emittedAt: null,
        eventId: null,
        order: null,
      },
      {
        eventName: VENDOR_REALTIME_EVENTS.ORDER_STATUS_UPDATED,
        orderId: 'order-1',
        storeId: 'store-1',
        orderStatus: 'picking',
        totalAmount: 120,
        itemCount: 2,
        updatedAt: '2026-01-01T10:00:00.000Z',
        emittedAt: null,
        eventId: null,
        order: null,
      },
    ),
    true,
  );
});

test('ignores stale pickup events for the same order only', () => {
  assert.equal(
    shouldIgnoreVendorPickupRealtimeEvent(
      {
        eventName: VENDOR_REALTIME_EVENTS.RIDER_ARRIVED,
        orderId: 'order-1',
        assignmentId: 'assignment-1',
        riderId: 'rider-1',
        pickupStatus: 'arrived_at_store',
        arrivedAt: '2026-01-01T09:59:59.000Z',
        pickupCompletedAt: null,
        updatedAt: '2026-01-01T09:59:59.000Z',
        emittedAt: null,
        eventId: null,
      },
      {
        eventName: VENDOR_REALTIME_EVENTS.PICKUP_COMPLETED,
        orderId: 'order-1',
        assignmentId: 'assignment-1',
        riderId: 'rider-1',
        pickupStatus: 'pickup_completed',
        arrivedAt: null,
        pickupCompletedAt: '2026-01-01T10:00:00.000Z',
        updatedAt: '2026-01-01T10:00:00.000Z',
        emittedAt: null,
        eventId: null,
      },
    ),
    true,
  );
});

