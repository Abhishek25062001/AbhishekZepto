import assert from 'node:assert/strict';
import { test } from 'node:test';

import { storeFormSchema } from '../../forms/store.schema';

test('store form blocks missing vendor', () => {
  const result = storeFormSchema.safeParse({ name: 'Store' });
  assert.equal(result.success, false);
});
