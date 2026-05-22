import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getProfileErrorMessage } from './customer-profile-error-message.util';

test('getProfileErrorMessage maps PROFILE_VALIDATION_FAILED', () => {
  const error = {
    response: {
      data: {
        error: { code: 'PROFILE_VALIDATION_FAILED', details: {} },
        message: 'Validation failed',
      },
    },
  };

  assert.match(getProfileErrorMessage(error, 'fallback'), /name and email/i);
});

test('getProfileErrorMessage maps USER_NOT_FOUND', () => {
  const error = {
    response: {
      data: {
        error: { code: 'USER_NOT_FOUND', details: {} },
        message: 'Not found',
      },
    },
  };

  assert.equal(getProfileErrorMessage(error, 'fallback'), 'Profile not found.');
});

test('getProfileErrorMessage uses fallback for unknown errors', () => {
  assert.equal(getProfileErrorMessage(new Error('network'), 'Could not load.'), 'Could not load.');
});
