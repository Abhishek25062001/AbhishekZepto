import assert from 'node:assert/strict';
import { test } from 'node:test';

import { setSearchParams } from './vendor-inventory-query-param.util';

test('movement list filter sync clears movementType', () => {
  const params = new URLSearchParams('movementType=stock_in&page=2');
  setSearchParams(params, { movementType: null, page: 1 });
  assert.equal(params.get('movementType'), null);
  assert.equal(params.get('page'), '1');
});
