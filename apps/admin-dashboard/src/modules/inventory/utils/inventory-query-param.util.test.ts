import assert from 'node:assert/strict';
import { test } from 'node:test';

import { parseOptionalString, setSearchParams } from './inventory-query-param.util';

test('parseOptionalString trims movement reference filters', () => {
  assert.equal(parseOptionalString(' order-1 '), 'order-1');
  assert.equal(parseOptionalString(null), undefined);
});

test('setSearchParams clears store product filters', () => {
  const params = new URLSearchParams('storeId=1&isVisible=true');
  setSearchParams(params, { isVisible: undefined, storeId: null });
  assert.equal(params.toString(), '');
});
