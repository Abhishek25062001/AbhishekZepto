import assert from 'node:assert/strict';
import { test } from 'node:test';

import { cityFormSchema } from '../../forms/city.schema';

test('city form blocks submit without required fields', () => {
  const result = cityFormSchema.safeParse({ name: 'Only name' });
  assert.equal(result.success, false);
});
