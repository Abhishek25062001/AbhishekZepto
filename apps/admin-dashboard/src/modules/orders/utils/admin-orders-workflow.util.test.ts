import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  canShowAdminCancellationAction,
  canShowAdminStatusUpdateAction,
  getNextAdminOrderStatuses,
} from './admin-orders-workflow.util';

test('getNextAdminOrderStatuses follows backend transition order', () => {
  assert.deepEqual(getNextAdminOrderStatuses('placed'), ['accepted']);
  assert.deepEqual(getNextAdminOrderStatuses('packing'), ['ready_for_pickup']);
  assert.deepEqual(getNextAdminOrderStatuses('ready_for_pickup'), []);
});

test('admin cancellation action is hidden after cutoff states', () => {
  assert.equal(canShowAdminCancellationAction({ orderStatus: 'packing' }), true);
  assert.equal(canShowAdminCancellationAction({ orderStatus: 'ready_for_pickup' }), false);
  assert.equal(canShowAdminCancellationAction({ orderStatus: 'cancelled' }), false);
});

test('admin status update action is hidden for terminal states', () => {
  assert.equal(canShowAdminStatusUpdateAction({ orderStatus: 'accepted' }), true);
  assert.equal(canShowAdminStatusUpdateAction({ orderStatus: 'cancelled' }), false);
});
