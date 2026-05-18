import assert from 'node:assert/strict';
import { test } from 'node:test';

import { CATALOG_STATUS } from '../constants/catalog-status.constants';
import { categoryFormSchema } from './category-form.schema';

test('categoryFormSchema accepts minimal valid payloads', () => {
  const result = categoryFormSchema.safeParse({
    isFeatured: false,
    isVisible: true,
    name: 'Beverages',
    status: CATALOG_STATUS.ACTIVE,
  });

  assert.equal(result.success, true);
});

test('categoryFormSchema rejects empty names', () => {
  const result = categoryFormSchema.safeParse({
    isFeatured: false,
    isVisible: true,
    name: '',
    status: CATALOG_STATUS.ACTIVE,
  });

  assert.equal(result.success, false);
});
