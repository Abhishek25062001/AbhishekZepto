import assert from 'node:assert/strict';
import { test } from 'node:test';

import { APP_SURFACE } from '../../modules/push-notifications/constants/app-surface.constant';
import { PUSH_NOTIFICATION_STATUS } from '../../modules/push-notifications/constants/push-status.constant';

test('Phase 7 push notification validation covers customer and delivery app surfaces', () => {
  assert.equal(APP_SURFACE.CUSTOMER_APP, 'customer_app');
  assert.equal(APP_SURFACE.DELIVERY_AGENT_APP, 'delivery_agent_app');
});

test('Phase 7 push logs expose sent and failed statuses for validation', () => {
  assert.equal(PUSH_NOTIFICATION_STATUS.SENT, 'sent');
  assert.equal(PUSH_NOTIFICATION_STATUS.FAILED, 'failed');
});
