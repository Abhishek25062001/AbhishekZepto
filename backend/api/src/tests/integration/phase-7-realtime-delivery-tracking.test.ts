import assert from 'node:assert/strict';
import { test } from 'node:test';

import { DELIVERY_TRACKING_REALTIME_EVENTS } from '../../modules/realtime-delivery-tracking/constants/delivery-tracking-events.constant';
import { mapDeliveryTrackingRealtimePayload } from '../../modules/realtime-delivery-tracking/utils/delivery-tracking-payload.mapper';

test('Phase 7 realtime delivery tracking events cover customer and admin surfaces', () => {
  assert.equal(
    DELIVERY_TRACKING_REALTIME_EVENTS.CUSTOMER_DELIVERY_LOCATION_UPDATED,
    'customer.delivery_location_updated',
  );
  assert.equal(
    DELIVERY_TRACKING_REALTIME_EVENTS.ADMIN_DELIVERY_LOCATION_UPDATED,
    'admin.delivery_location_updated',
  );
  assert.equal(
    DELIVERY_TRACKING_REALTIME_EVENTS.CUSTOMER_RIDER_REACHED_CUSTOMER,
    'customer.rider_reached_customer',
  );
  assert.equal(DELIVERY_TRACKING_REALTIME_EVENTS.CUSTOMER_DELIVERY_FAILED, 'customer.delivery_failed');
});

test('Phase 7 realtime delivery tracking payload consumes documented fields', () => {
  const payload = mapDeliveryTrackingRealtimePayload({
    orderId: 'order-1',
    assignmentId: 'assignment-1',
    deliveryAgentId: 'agent-1',
    customerId: 'customer-1',
    cityId: 'city-1',
    progressStatus: 'en_route_to_customer',
    currentLatitude: 12.9,
    currentLongitude: 77.6,
    lastLocationUpdatedAt: '2026-05-30T10:00:00.000Z',
    deliveryOtp: 'hidden',
  });

  assert.equal(payload.orderId, 'order-1');
  assert.equal(payload.assignmentId, 'assignment-1');
  assert.equal(payload.currentLatitude, 12.9);
  assert.equal('deliveryOtp' in payload, false);
});
