import assert from 'node:assert/strict';
import { test } from 'node:test';

import { seedCustomerAddresses } from './seed-customer-addresses';

test('seedCustomerAddresses dry run logs without throwing', async () => {
  await seedCustomerAddresses(true);
  assert.ok(true);
});
