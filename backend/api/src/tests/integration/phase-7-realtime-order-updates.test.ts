import assert from 'node:assert/strict';
import { test } from 'node:test';

import { ORDER_REALTIME_EVENTS } from '../../modules/realtime-order-updates/constants/order-realtime-events.constant';
import { mapOrderRealtimePayload } from '../../modules/realtime-order-updates/utils/order-realtime-payload.mapper';

test('Phase 7 realtime order events cover customer vendor and admin surfaces', () => {
  assert.equal(ORDER_REALTIME_EVENTS.CUSTOMER_ORDER_STATUS_UPDATED, 'customer.order_status_updated');
  assert.equal(ORDER_REALTIME_EVENTS.VENDOR_ORDER_CREATED, 'vendor.order_created');
  assert.equal(ORDER_REALTIME_EVENTS.ADMIN_ORDER_STATUS_UPDATED, 'admin.order_status_updated');
});

test('Phase 7 realtime order payload consumes documented order fields only', () => {
  const payload = mapOrderRealtimePayload({
    _id: 'order-1',
    customerId: 'customer-1',
    storeId: 'store-1',
    cityId: 'city-1',
    orderStatus: 'accepted',
    paymentStatus: 'paid',
    updatedAt: '2026-05-30T10:00:00.000Z',
    otp: '123456',
  });

  assert.equal(payload.orderId, 'order-1');
  assert.equal(payload.customerId, 'customer-1');
  assert.equal(payload.storeId, 'store-1');
  assert.equal(payload.cityId, 'city-1');
  assert.equal(payload.orderStatus, 'accepted');
  assert.equal(payload.paymentStatus, 'paid');
  assert.equal('otp' in payload, false);
});
