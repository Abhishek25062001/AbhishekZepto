import assert from 'node:assert/strict';
import { test } from 'node:test';
import { generateInventoryLockToken } from './inventory-lock-token.util';

test('generateInventoryLockToken uses lock_ prefix', () => {
  const token = generateInventoryLockToken();
  assert.match(token, /^lock_[A-Za-z0-9_-]+$/);
});

test('generateInventoryLockToken produces unique values', () => {
  const tokens = new Set(Array.from({ length: 50 }, () => generateInventoryLockToken()));
  assert.equal(tokens.size, 50);
});
