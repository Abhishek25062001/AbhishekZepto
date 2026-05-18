import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  hasPartialDeliverySession,
  isRestorableDeliverySession,
} from './session-restore.util';

test('restorable delivery session requires full token and id set', () => {
  assert.equal(
    isRestorableDeliverySession({
      accessToken: 'access',
      refreshToken: 'refresh',
      deliveryAgentId: 'agent-1',
    }),
    true,
  );
});

test('partial delivery session is treated as unsafe restore input', () => {
  assert.equal(
    hasPartialDeliverySession({
      accessToken: 'access',
      refreshToken: null,
      deliveryAgentId: 'agent-1',
    }),
    true,
  );
});
