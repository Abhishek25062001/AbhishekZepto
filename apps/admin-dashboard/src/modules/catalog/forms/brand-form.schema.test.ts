import assert from 'node:assert/strict';
import { test } from 'node:test';

import { CATALOG_STATUS } from '../constants/catalog-status.constants';
import { brandFormSchema } from './brand-form.schema';

test('brandFormSchema validates core merchandising fields', () => {
  const result = brandFormSchema.safeParse({
    isFeatured: true,
    isVisible: true,
    name: 'Acme',
    status: CATALOG_STATUS.ACTIVE,
  });

  assert.equal(result.success, true);
});

test('brandFormSchema enforces enumerated status values', () => {
  const result = brandFormSchema.safeParse({
    isFeatured: false,
    isVisible: true,
    name: 'Acme',
    status: 'retired',
  });

  assert.equal(result.success, false);
});
