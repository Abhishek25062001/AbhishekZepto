import assert from 'node:assert/strict';
import { test } from 'node:test';

import { CUSTOMER_RECENTLY_VIEWED_MAX } from '../constants/customer-catalog.constants';

test('recently viewed max constant is 10', () => {
  assert.equal(CUSTOMER_RECENTLY_VIEWED_MAX, 10);
});

test('dedupe moves latest id to front', () => {
  const existing = ['a', 'b', 'c'];
  const productId = 'b';
  const next = [productId, ...existing.filter((id) => id !== productId)].slice(
    0,
    CUSTOMER_RECENTLY_VIEWED_MAX,
  );
  assert.deepEqual(next, ['b', 'a', 'c']);
});

test('limit keeps max 10 ids', () => {
  const existing = Array.from({ length: 12 }, (_, index) => `id-${index}`);
  const next = ['new', ...existing].slice(0, CUSTOMER_RECENTLY_VIEWED_MAX);
  assert.equal(next.length, 10);
  assert.equal(next[0], 'new');
});
