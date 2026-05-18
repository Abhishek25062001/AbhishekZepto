import assert from 'node:assert/strict';
import { test } from 'node:test';

import { parseOptionalBoolean, setSearchParams } from './utils/store-query-param.util';

test('parseOptionalBoolean handles explicit tokens', () => {
  assert.equal(parseOptionalBoolean('true'), true);
  assert.equal(parseOptionalBoolean('false'), false);
});

test('setSearchParams clears empty values', () => {
  const params = new URLSearchParams('page=1&status=active');
  setSearchParams(params, { page: null, status: '' });
  assert.equal(params.toString(), '');
});
