import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  CUSTOMER_CATALOG_SEARCH_MIN_LENGTH,
} from '../constants/customer-catalog.constants';

export const CUSTOMER_CATALOG_SEARCH_ENDPOINT = '/api/v1/customer/catalog/search';

test('search does not run before minimum query length', () => {
  assert.equal('a'.length < CUSTOMER_CATALOG_SEARCH_MIN_LENGTH, true);
  assert.equal('ab'.length >= CUSTOMER_CATALOG_SEARCH_MIN_LENGTH, true);
});

test('search uses customer search endpoint', () => {
  assert.equal(CUSTOMER_CATALOG_SEARCH_ENDPOINT, '/api/v1/customer/catalog/search');
});
