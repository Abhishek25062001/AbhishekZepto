import assert from 'node:assert/strict';
import { test } from 'node:test';

import { extractApiErrorCode, mapCatalogErrorCodeToMessage } from './catalog-error-message.util';

test('mapCatalogErrorCodeToMessage prefers catalog dictionary entries', () => {
  assert.equal(mapCatalogErrorCodeToMessage('PRODUCT_NOT_FOUND', 'fallback'), 'Product not found.');
  assert.equal(mapCatalogErrorCodeToMessage('UNKNOWN_CODE', 'fallback'), 'fallback');
});

test('mapCatalogErrorCodeToMessage normalizes dotted error codes', () => {
  assert.equal(
    mapCatalogErrorCodeToMessage('domain.error.PRODUCT_SLUG_ALREADY_EXISTS', 'fallback'),
    'A product with this slug already exists.',
  );
});

test('extractApiErrorCode reads axios-like error payloads', () => {
  const error = {
    response: {
      data: {
        error: { code: 'CATEGORY_NOT_FOUND' },
      },
    },
  };

  assert.equal(extractApiErrorCode(error), 'CATEGORY_NOT_FOUND');
  assert.equal(extractApiErrorCode(new Error('nope')), undefined);
});
