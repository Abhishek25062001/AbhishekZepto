import assert from 'node:assert/strict';
import { test } from 'node:test';

import { storeProductFormSchema } from '../../forms/store-product.schema';

test('store product form blocks invalid price relationship', () => {
  const result = storeProductFormSchema.safeParse({
    discountType: 'none',
    isAvailable: true,
    isFeatured: false,
    isVisible: true,
    mrp: 50,
    productId: 'p',
    sellingPrice: 60,
    status: 'active',
    storeId: 's',
    variantId: 'v',
  });
  assert.equal(result.success, false);
});
