import assert from 'node:assert/strict';
import { test } from 'node:test';

import { CUSTOMER_REALTIME_EVENTS } from '../types/realtime-order.types';
import {
  hasValidRealtimeCoordinates,
  isLocationEventStale,
  mapRealtimeDeliveryTrackingPayload,
} from '../utils/realtime-delivery-location.util';

test('valid coordinates are accepted', () => {
  assert.equal(hasValidRealtimeCoordinates(28.6139, 77.209), true);
});

test('stale location update is identified', () => {
  assert.equal(
    isLocationEventStale(
      '2026-05-30T01:00:00.000Z',
      '2026-05-30T01:01:00.000Z',
    ),
    true,
  );
});

test('malformed coordinates are ignored for location events', () => {
  const event = mapRealtimeDeliveryTrackingPayload(
    {
      emittedAt: '2026-05-30T01:00:00.000Z',
      data: {
        orderId: 'order-1',
        assignmentId: 'assignment-1',
        deliveryAgentId: 'agent-1',
        currentLatitude: 999,
        currentLongitude: 77.209,
      },
    },
    CUSTOMER_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED,
  );

  assert.equal(event, null);
});
