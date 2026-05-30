import assert from 'node:assert/strict';
import { test } from 'node:test';

import { VENDOR_REALTIME_EVENTS } from '../types/vendor-realtime.types';
import { getRiderArrivedAlertViewModel } from '../utils/vendor-realtime-alert.util';

test('rider arrived alert builds view model from rider arrival event', () => {
  const viewModel = getRiderArrivedAlertViewModel({
    eventName: VENDOR_REALTIME_EVENTS.RIDER_ARRIVED,
    orderId: 'order-1',
    assignmentId: 'assignment-1',
    riderId: 'rider-1',
    pickupStatus: 'arrived_at_store',
    arrivedAt: '2026-01-01T10:00:00.000Z',
    pickupCompletedAt: null,
    updatedAt: '2026-01-01T10:00:00.000Z',
    emittedAt: null,
    eventId: null,
  });

  assert.equal(viewModel?.orderId, 'order-1');
  assert.equal(viewModel?.assignmentId, 'assignment-1');
  assert.equal(viewModel?.riderId, 'rider-1');
  assert.equal(viewModel?.targetPath, '/orders/active/order-1');
});

test('rider arrived alert hides for pickup completion events', () => {
  const viewModel = getRiderArrivedAlertViewModel({
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
  });

  assert.equal(viewModel, null);
});

