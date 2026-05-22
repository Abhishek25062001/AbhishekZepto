import assert from 'node:assert/strict';
import { test } from 'node:test';

import { validateProfileInput } from './customer-profile-validation.util';

test('validateProfileInput accepts valid input', () => {
  const result = validateProfileInput({ name: 'Demo', email: 'user@example.com' });
  assert.equal(result.valid, true);
});

test('validateProfileInput rejects invalid email', () => {
  const result = validateProfileInput({ name: 'Demo', email: 'bad' });
  assert.equal(result.valid, false);
  assert.ok(result.emailError);
});

test('validateProfileInput rejects long name', () => {
  const result = validateProfileInput({ name: 'a'.repeat(101), email: '' });
  assert.equal(result.valid, false);
  assert.ok(result.nameError);
});
