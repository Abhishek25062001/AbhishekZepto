import assert from 'node:assert/strict';
import { test } from 'node:test';

import { parseNumberParam, parseOptionalBoolean, parseOptionalString, setSearchParams } from './catalog-query-param.util';

test('parseNumberParam falls back when input is missing or invalid', () => {
  assert.equal(parseNumberParam(null, 5), 5);
  assert.equal(parseNumberParam('0', 3), 3);
  assert.equal(parseNumberParam('abc', 2), 2);
  assert.equal(parseNumberParam('4', 1), 4);
});

test('parseOptionalString trims meaningful values', () => {
  assert.equal(parseOptionalString(null), undefined);
  assert.equal(parseOptionalString('   '), undefined);
  assert.equal(parseOptionalString(' hello '), 'hello');
});

test('parseOptionalBoolean handles explicit tokens only', () => {
  assert.equal(parseOptionalBoolean(null), undefined);
  assert.equal(parseOptionalBoolean('true'), true);
  assert.equal(parseOptionalBoolean('false'), false);
  assert.equal(parseOptionalBoolean('yes'), undefined);
});

test('setSearchParams clears keys when updated to empty values', () => {
  const params = new URLSearchParams('page=2&search=foo&featured=true');
  setSearchParams(params, {
    featured: undefined,
    page: '',
    search: null,
  });

  assert.equal(params.toString(), '');
});
