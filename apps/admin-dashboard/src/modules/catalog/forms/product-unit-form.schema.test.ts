import assert from 'node:assert/strict';
import { test } from 'node:test';

import { CATALOG_STATUS } from '../constants/catalog-status.constants';
import { BASE_UNIT } from '../constants/product-unit.constants';
import { productUnitFormSchema } from './product-unit-form.schema';

test('productUnitFormSchema accepts healthy conversion factors', () => {
  const result = productUnitFormSchema.safeParse({
    baseUnit: BASE_UNIT.KG,
    code: 'kg-retail',
    conversionFactor: 1,
    name: 'Kilogram',
    status: CATALOG_STATUS.ACTIVE,
  });

  assert.equal(result.success, true);
});

test('productUnitFormSchema rejects non-positive conversion factors', () => {
  const result = productUnitFormSchema.safeParse({
    baseUnit: BASE_UNIT.PIECE,
    code: 'bad',
    conversionFactor: 0,
    name: 'Broken',
    status: CATALOG_STATUS.ACTIVE,
  });

  assert.equal(result.success, false);
});
