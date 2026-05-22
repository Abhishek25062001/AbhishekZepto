import assert from 'node:assert/strict';
import { test } from 'node:test';

import { seedDemoCart } from './seed-demo-cart';

test('seedDemoCart dry run logs without throwing', async () => {
  await seedDemoCart(true);
  assert.ok(true);
});
