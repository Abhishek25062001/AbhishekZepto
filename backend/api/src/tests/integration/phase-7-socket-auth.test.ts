import assert from 'node:assert/strict';
import { test } from 'node:test';

import { SOCKET_ERROR_CODES } from '../../modules/realtime/constants/socket-error-codes.constant';
import { REALTIME_NAMESPACE } from '../../modules/realtime/constants/realtime-events.constant';

test('Phase 7 socket auth covers all realtime namespaces', () => {
  assert.deepEqual(Object.values(REALTIME_NAMESPACE).sort(), [
    '/admin',
    '/admin-control',
    '/customer',
    '/delivery',
    '/vendor',
  ]);
});

test('Phase 7 socket auth exposes required rejection error codes', () => {
  assert.equal(SOCKET_ERROR_CODES.AUTH_REQUIRED, 'AUTH_REQUIRED');
  assert.equal(SOCKET_ERROR_CODES.INVALID_SOCKET_TOKEN, 'INVALID_SOCKET_TOKEN');
  assert.equal(SOCKET_ERROR_CODES.SOCKET_FORBIDDEN, 'SOCKET_FORBIDDEN');
});
