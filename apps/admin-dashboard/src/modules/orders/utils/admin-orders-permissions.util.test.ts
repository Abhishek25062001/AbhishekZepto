import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  canCancelAdminOrder,
  canMonitorAdminOrderSla,
  canReadAdminOrders,
  canUpdateAdminOrderStatus,
} from './admin-orders-permissions.util';

test('admin order read permission controls list and detail visibility', () => {
  assert.equal(canReadAdminOrders(['orders:read']), true);
  assert.equal(canReadAdminOrders(['catalog:read']), false);
});

test('admin order mutation permissions are separated', () => {
  assert.equal(canUpdateAdminOrderStatus(['orders:update-status']), true);
  assert.equal(canUpdateAdminOrderStatus(['orders:cancel']), false);
  assert.equal(canCancelAdminOrder(['orders:cancel']), true);
  assert.equal(canCancelAdminOrder(['orders:read']), false);
});

test('wildcard permission can access all admin order operations', () => {
  assert.equal(canReadAdminOrders(['*:*']), true);
  assert.equal(canUpdateAdminOrderStatus(['*:*']), true);
  assert.equal(canCancelAdminOrder(['*:*']), true);
  assert.equal(canMonitorAdminOrderSla(['*:*']), true);
});
