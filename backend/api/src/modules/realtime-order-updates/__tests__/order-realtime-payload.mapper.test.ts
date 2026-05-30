import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ORDER_STATUS } from '../../orders/constants/order-status.constant';
import { mapOrderRealtimePayload } from '../utils/order-realtime-payload.mapper';

test('mapOrderRealtimePayload maps only the safe realtime order fields', () => {
  const updatedAt = new Date('2026-05-29T10:00:00.000Z');

  const payload = mapOrderRealtimePayload({
    _id: { toString: () => 'order-1' },
    customerId: { toString: () => 'customer-1' },
    storeId: { toString: () => 'store-1' },
    vendorId: { toString: () => 'vendor-1' },
    cityId: { toString: () => 'city-1' },
    orderStatus: ORDER_STATUS.ACCEPTED,
    paymentStatus: 'paid',
    grandTotal: 499,
    updatedAt,
    __v: 1,
    accessToken: 'hidden',
    refreshToken: 'hidden',
    otp: '123456',
    paymentGatewaySecret: 'hidden',
    rawMetadata: { internal: true },
    session: { id: 'session-1' },
  });

  assert.deepEqual(payload, {
    orderId: 'order-1',
    customerId: 'customer-1',
    storeId: 'store-1',
    vendorId: 'vendor-1',
    cityId: 'city-1',
    orderStatus: ORDER_STATUS.ACCEPTED,
    paymentStatus: 'paid',
    totalAmount: 499,
    updatedAt: '2026-05-29T10:00:00.000Z',
    eventSource: 'order',
  });

  assert.equal('accessToken' in payload, false);
  assert.equal('refreshToken' in payload, false);
  assert.equal('otp' in payload, false);
  assert.equal('paymentGatewaySecret' in payload, false);
  assert.equal('__v' in payload, false);
  assert.equal('rawMetadata' in payload, false);
  assert.equal('session' in payload, false);
});

test('mapOrderRealtimePayload prefers orderId and totalAmount when present', () => {
  const payload = mapOrderRealtimePayload(
    {
      orderId: 'order-public',
      _id: 'order-private',
      customerId: 'customer-1',
      storeId: 'store-1',
      orderStatus: ORDER_STATUS.SHIPPED,
      totalAmount: 325,
      grandTotal: 999,
      updatedAt: '2026-05-29T11:00:00.000Z',
    },
    'delivery',
  );

  assert.equal(payload.orderId, 'order-public');
  assert.equal(payload.totalAmount, 325);
  assert.equal(payload.eventSource, 'delivery');
  assert.equal(payload.updatedAt, '2026-05-29T11:00:00.000Z');
});
