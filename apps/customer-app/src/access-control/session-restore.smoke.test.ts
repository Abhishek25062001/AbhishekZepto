import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  hasPartialCustomerSession,
  isRestorableCustomerSession,
} from './session-restore.util';

test('restorable customer session requires full token and id set', () => {
  assert.equal(
    isRestorableCustomerSession({
      accessToken: 'access',
      refreshToken: 'refresh',
      customerId: 'customer-1',
    }),
    true,
  );
  assert.equal(isRestorableCustomerSession(null), false);
  assert.equal(
    isRestorableCustomerSession({
      accessToken: 'access',
      refreshToken: null,
      customerId: 'customer-1',
    }),
    false,
  );
});

test('partial customer session is treated as unsafe restore input', () => {
  assert.equal(
    hasPartialCustomerSession({
      accessToken: 'access',
      refreshToken: null,
      customerId: 'customer-1',
    }),
    true,
  );
  assert.equal(hasPartialCustomerSession(null), false);
});
