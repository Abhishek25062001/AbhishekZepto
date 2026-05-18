import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  parseNumberParam,
  parseOptionalBoolean,
  parseOptionalString,
  setSearchParams,
} from './vendor-catalog-query-param.util';

test('parseNumberParam falls back when invalid', () => {
  assert.equal(parseNumberParam(null, 5), 5);
  assert.equal(parseNumberParam('abc', 2), 2);
});

test('parseOptionalString trims values', () => {
  assert.equal(parseOptionalString('  hi '), 'hi');
  assert.equal(parseOptionalString(''), undefined);
});

test('parseOptionalBoolean handles tokens', () => {
  assert.equal(parseOptionalBoolean('true'), true);
  assert.equal(parseOptionalBoolean('maybe'), undefined);
});

test('setSearchParams clears empty values', () => {
  const params = new URLSearchParams('page=2&search=foo');
  setSearchParams(params, { page: '', search: null });
  assert.equal(params.toString(), '');
});
