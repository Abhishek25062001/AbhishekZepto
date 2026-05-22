import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  ADMIN_ORDER_STATUS_LABELS,
  formatAdminOrderMoney,
  getAdminOrderCancellationReason,
} from './admin-orders-display.util';

test('ADMIN_ORDER_STATUS_LABELS includes ready for pickup label', () => {
  assert.equal(ADMIN_ORDER_STATUS_LABELS.ready_for_pickup, 'Ready for pickup');
});

test('formatAdminOrderMoney formats INR totals', () => {
  assert.match(formatAdminOrderMoney(250), /250/);
});

test('getAdminOrderCancellationReason falls back when absent', () => {
  assert.equal(
    getAdminOrderCancellationReason({ cancellationReason: null }),
    'No cancellation reason recorded',
  );
});
