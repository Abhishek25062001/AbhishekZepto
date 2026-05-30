import assert from 'node:assert/strict';
import { test } from 'node:test';

import { handleDeliveryPushPayload } from '../utils/delivery-push-payload.handler';

test('assignment-created payload navigates to active assignment screen', () => {
  const calls: Array<{ screen: string; params?: Record<string, string> }> = [];

  const handled = handleDeliveryPushPayload(
    { assignmentId: 'assignment-1', type: 'assignment_created' },
    { navigate: (screen, params) => calls.push({ screen, params }) },
  );

  assert.equal(handled, true);
  assert.deepEqual(calls, [
    { screen: 'ActiveDelivery', params: { assignmentId: 'assignment-1' } },
  ]);
});

test('malformed delivery payload falls back to dashboard', () => {
  const calls: Array<{ screen: string; params?: Record<string, string> }> = [];

  const handled = handleDeliveryPushPayload(
    { type: 'assignment_created' },
    { navigate: (screen, params) => calls.push({ screen, params }) },
  );

  assert.equal(handled, false);
  assert.deepEqual(calls, [{ screen: 'DeliveryHome', params: undefined }]);
});
