import assert from 'node:assert/strict';
import { test } from 'node:test';

import { VENDOR_REALTIME_EVENTS } from '../types/vendor-realtime.types';
import { mapVendorRealtimeEventPayload } from '../utils/vendor-realtime-event.mapper';

test('maps order created event to vendor order row model', () => {
  const event = mapVendorRealtimeEventPayload(
    {
      eventName: VENDOR_REALTIME_EVENTS.ORDER_CREATED,
      emittedAt: '2026-01-01T10:00:01.000Z',
      data: {
        orderId: 'order-1',
        orderNumber: 'ORD-1',
        storeId: 'store-1',
        customerId: 'customer-1',
        orderStatus: 'placed',
        storeStatus: 'pending_acceptance',
        totalAmount: 125.5,
        itemCount: 4,
        currency: 'INR',
        createdAt: '2026-01-01T10:00:00.000Z',
        updatedAt: '2026-01-01T10:00:00.000Z',
      },
    },
    VENDOR_REALTIME_EVENTS.ORDER_CREATED,
  );

  assert.equal(event?.eventName, VENDOR_REALTIME_EVENTS.ORDER_CREATED);
  assert.equal(event && 'order' in event ? event.order?.orderNumber : null, 'ORD-1');
  assert.equal(event && 'order' in event ? event.order?.grandTotal : null, 125.5);
});

test('maps pickup completed event to pickup model', () => {
  const event = mapVendorRealtimeEventPayload(
    {
      data: {
        orderId: 'order-1',
        assignmentId: 'assignment-1',
        riderId: 'rider-1',
        pickupCompletedAt: '2026-01-01T10:05:00.000Z',
      },
    },
    VENDOR_REALTIME_EVENTS.PICKUP_COMPLETED,
  );

  assert.equal(event?.eventName, VENDOR_REALTIME_EVENTS.PICKUP_COMPLETED);
  assert.equal(event && 'pickupStatus' in event ? event.pickupStatus : null, 'pickup_completed');
  assert.equal(
    event && 'pickupCompletedAt' in event ? event.pickupCompletedAt : null,
    '2026-01-01T10:05:00.000Z',
  );
});

test('ignores malformed vendor realtime payloads', () => {
  const event = mapVendorRealtimeEventPayload(
    {
      data: {
        orderId: 'order-1',
        orderStatus: 'placed',
      },
    },
    VENDOR_REALTIME_EVENTS.ORDER_CREATED,
  );

  assert.equal(event, null);
});

