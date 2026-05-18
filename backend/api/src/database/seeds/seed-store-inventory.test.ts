import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CATALOG_PRODUCT_SEEDS } from './catalog-seed-data';
import { STORE_INVENTORY_VARIANT_SEEDS } from './store-inventory-seed-data';

const catalogVariantSkus = CATALOG_PRODUCT_SEEDS.flatMap((product) =>
  product.variants.map((variant) => variant.sku),
);

test('store inventory seeds cover every catalog variant sku', () => {
  const seedSkus = STORE_INVENTORY_VARIANT_SEEDS.map((item) => item.variantSku);
  assert.deepEqual(seedSkus.sort(), catalogVariantSkus.sort());
});

test('store inventory seeds have unique variant skus', () => {
  const seedSkus = STORE_INVENTORY_VARIANT_SEEDS.map((item) => item.variantSku);
  assert.equal(seedSkus.length, new Set(seedSkus).size);
});

test('store inventory seed quantities are non-negative', () => {
  for (const item of STORE_INVENTORY_VARIANT_SEEDS) {
    assert.ok(item.availableQuantity >= 0);
    assert.ok(item.lowStockThreshold >= 0);
    assert.ok(item.reorderLevel >= 0);
  }
});
