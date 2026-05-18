import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  CATALOG_BRAND_SEEDS,
  CATALOG_CATEGORY_SEEDS,
  CATALOG_PRODUCT_SEEDS,
  CATALOG_UNIT_SEEDS,
} from './catalog-seed-data';

const uniqueStrings = (values: string[]): string[] => [...new Set(values)];

test('catalog category seeds have unique slugs', () => {
  const slugs = CATALOG_CATEGORY_SEEDS.map((item) => item.slug);
  assert.equal(slugs.length, uniqueStrings(slugs).length);
  assert.equal(CATALOG_CATEGORY_SEEDS.length, 10);
});

test('catalog brand seeds have unique slugs', () => {
  const slugs = CATALOG_BRAND_SEEDS.map((item) => item.slug);
  assert.equal(slugs.length, uniqueStrings(slugs).length);
});

test('catalog unit seeds match planned base units', () => {
  const codes = CATALOG_UNIT_SEEDS.map((item) => item.code);
  assert.deepEqual(codes.sort(), ['dozen', 'g', 'kg', 'litre', 'ml', 'pack', 'piece'].sort());
  assert.equal(codes.length, uniqueStrings(codes).length);
});

test('catalog product seeds reference valid categories and brands', () => {
  const categorySlugs = new Set(CATALOG_CATEGORY_SEEDS.map((item) => item.slug));
  const brandSlugs = new Set(CATALOG_BRAND_SEEDS.map((item) => item.slug));
  const productSlugs = CATALOG_PRODUCT_SEEDS.map((item) => item.slug);

  assert.equal(productSlugs.length, uniqueStrings(productSlugs).length);
  assert.ok(CATALOG_PRODUCT_SEEDS.length >= 10);

  for (const product of CATALOG_PRODUCT_SEEDS) {
    assert.ok(categorySlugs.has(product.categorySlug), `Unknown category: ${product.categorySlug}`);
    assert.ok(brandSlugs.has(product.brandSlug), `Unknown brand: ${product.brandSlug}`);
    assert.ok(product.variants.length >= 1, `Product ${product.slug} needs at least one variant`);
  }
});

test('catalog variant seeds have unique skus', () => {
  const skus = CATALOG_PRODUCT_SEEDS.flatMap((product) =>
    product.variants.map((variant) => variant.sku),
  );
  assert.equal(skus.length, uniqueStrings(skus).length);
});

test('catalog variant unit codes exist in unit seeds', () => {
  const unitCodes = new Set(CATALOG_UNIT_SEEDS.map((item) => item.code));
  const variantUnits = CATALOG_PRODUCT_SEEDS.flatMap((product) =>
    product.variants.map((variant) => variant.unit),
  );

  for (const unit of variantUnits) {
    assert.ok(unitCodes.has(unit), `Unknown unit code on variant: ${unit}`);
  }
});
