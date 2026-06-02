import assert from 'node:assert/strict';
import { test } from 'node:test';

import { CATALOG_STATUS } from '../constants/catalog-status.constants';
import { productVariantFormSchema } from './product-variant-form.schema';

test('productVariantFormSchema accepts a valid variant payload', () => {
  const parsed = productVariantFormSchema.parse({
    barcode: '',
    defaultSellingPrice: 95,
    heightCm: null,
    imageUrl: '',
    isDefault: true,
    isVisible: true,
    lengthCm: null,
    mrp: 100,
    sku: 'SKU-001',
    status: CATALOG_STATUS.ACTIVE,
    unit: 'piece',
    unitValue: 1,
    variantName: 'Single pack',
    weightInGrams: 250,
    widthCm: null,
  });

  assert.equal(parsed.barcode, null);
  assert.equal(parsed.imageUrl, null);
  assert.equal(parsed.variantName, 'Single pack');
});

test('productVariantFormSchema rejects negative prices and empty names', () => {
  const parsed = productVariantFormSchema.safeParse({
    mrp: -1,
    sku: '',
    unit: '',
    unitValue: 0,
    variantName: '',
  });

  assert.equal(parsed.success, false);
});
