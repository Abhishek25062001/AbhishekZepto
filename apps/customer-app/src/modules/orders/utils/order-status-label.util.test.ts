import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  canCustomerCancelOrderStatus,
  getOrderStatusDescription,
  getOrderStatusLabel,
  isCancelledOrderStatus,
  isTerminalOrderStatus,
} from './order-status-label.util';

test('getOrderStatusLabel returns customer-safe phase 5 labels', () => {
  assert.deepEqual(
    [
      'placed',
      'accepted',
      'picking',
      'packing',
      'ready_for_pickup',
      'shipped_placeholder',
      'delivered_placeholder',
      'cancelled',
    ].map((status) => getOrderStatusLabel(status)),
    [
      'Order placed',
      'Store accepted',
      'Picking items',
      'Packing order',
      'Ready for pickup',
      'On the way',
      'Delivered',
      'Cancelled',
    ],
  );
});

test('getOrderStatusLabel falls back for unknown status', () => {
  assert.equal(getOrderStatusLabel('unknown'), 'Order placed');
});

test('status helpers identify terminal and cancellable states', () => {
  assert.equal(canCustomerCancelOrderStatus('placed'), true);
  assert.equal(canCustomerCancelOrderStatus('accepted'), false);
  assert.equal(isTerminalOrderStatus('cancelled'), true);
  assert.equal(isTerminalOrderStatus('delivered_placeholder'), true);
  assert.equal(isTerminalOrderStatus('ready_for_pickup'), false);
  assert.equal(isCancelledOrderStatus('cancelled'), true);
});

test('getOrderStatusDescription returns customer-safe fallback copy', () => {
  assert.equal(getOrderStatusDescription('picking'), 'The store is picking your items.');
  assert.equal(getOrderStatusDescription('unknown'), 'Your order was placed successfully.');
});
