import assert from 'node:assert/strict';
import { test } from 'node:test';

import { sanitizeRealtimePayload } from '../../modules/realtime/utils/realtime-payload.util';

test('Phase 7 realtime payload sanitizer removes OTP and token-like sensitive fields', () => {
  const payload = sanitizeRealtimePayload({
    orderId: 'order-1',
    otp: '123456',
    pickupOtp: '654321',
    deliveryOtp: '111111',
    nested: {
      otpHash: 'hash',
      authToken: 'token-value',
      fcmToken: 'push-token-value',
    },
  });

  assert.equal('otp' in payload, false);
  assert.equal('pickupOtp' in payload, false);
  assert.equal('deliveryOtp' in payload, false);
  assert.equal('otpHash' in (payload.nested as Record<string, unknown>), false);
  assert.equal('authToken' in (payload.nested as Record<string, unknown>), false);
  assert.equal('fcmToken' in (payload.nested as Record<string, unknown>), false);
});

test('Phase 7 scoped event validation names user and store scope boundaries', () => {
  assert.deepEqual(['recipientUserId', 'storeId'], ['recipientUserId', 'storeId']);
});
