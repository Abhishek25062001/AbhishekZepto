import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Types } from 'mongoose';

import { AppError } from '../../../../errors/AppError';
import { ERROR_CODES } from '../../../../errors/error-codes';
import {
  assertValidPriceRange,
  buildAdminProductFilters,
  buildCustomerProductFilters,
  buildVendorProductFilters,
} from './catalog-filter.util';

const categoryId = new Types.ObjectId().toString();

test('buildAdminProductFilters applies category and approval filters', () => {
  const filter = buildAdminProductFilters({
    page: 1,
    limit: 20,
    categoryId,
    approvalStatus: 'approved',
    search: 'milk',
  });

  assert.equal(filter.isDeleted, false);
  assert.equal(filter.approvalStatus, 'approved');
  assert.equal(String(filter.categoryId), categoryId);
  assert.ok(filter.$or);
});

test('buildCustomerProductFilters enforces customer visibility', () => {
  const { productMatch, storeProductMatch, requireInStock } = buildCustomerProductFilters(
    { page: 1, limit: 20, isAvailable: true },
    { cityId: new Types.ObjectId().toString() },
  );

  assert.equal(productMatch.status, 'active');
  assert.equal(productMatch.approvalStatus, 'approved');
  assert.equal(productMatch.isVisible, true);
  assert.equal(storeProductMatch.isAvailable, true);
  assert.equal(requireInStock, true);
});

test('buildCustomerProductFilters applies price range on store products', () => {
  const { storeProductMatch } = buildCustomerProductFilters(
    { page: 1, limit: 20, minPrice: 10, maxPrice: 100 },
    { cityId: new Types.ObjectId().toString() },
  );

  assert.equal(storeProductMatch.finalPrice?.$gte, 10);
  assert.equal(storeProductMatch.finalPrice?.$lte, 100);
});

test('buildVendorProductFilters scopes tenant vendorId', () => {
  const vendorId = new Types.ObjectId().toString();
  const { storeProductMatch } = buildVendorProductFilters(
    { page: 1, limit: 20 },
    { vendorId, storeId: null, cityId: null },
  );

  assert.equal(String(storeProductMatch.vendorId), vendorId);
});

test('assertValidPriceRange throws for invalid range', () => {
  assert.throws(
    () => assertValidPriceRange(100, 10),
    (error: unknown) =>
      error instanceof AppError &&
      error.errorCode === ERROR_CODES.CATALOG_SEARCH_PRICE_RANGE_INVALID,
  );
});
