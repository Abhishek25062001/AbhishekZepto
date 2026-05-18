import assert from 'node:assert/strict';
import { test } from 'node:test';

import { AppError } from '../../../../errors/AppError';
import { ERROR_CODES } from '../../../../errors/error-codes';
import { buildSearchRegex, normalizeSearchQuery } from './catalog-search-query.util';

test('normalizeSearchQuery trims and collapses whitespace', () => {
  assert.equal(normalizeSearchQuery('  organic   milk  '), 'organic milk');
  assert.equal(normalizeSearchQuery(''), undefined);
  assert.equal(normalizeSearchQuery(undefined), undefined);
});

test('normalizeSearchQuery rejects queries longer than 100 characters', () => {
  assert.throws(
    () => normalizeSearchQuery('a'.repeat(101)),
    (error: unknown) =>
      error instanceof AppError &&
      error.errorCode === ERROR_CODES.CATALOG_SEARCH_QUERY_TOO_LONG,
  );
});

test('buildSearchRegex escapes special characters', () => {
  const regex = buildSearchRegex('milk+');
  assert.match('organic milk+ powder', regex);
  assert.doesNotMatch('organic milk powder', regex);
});
