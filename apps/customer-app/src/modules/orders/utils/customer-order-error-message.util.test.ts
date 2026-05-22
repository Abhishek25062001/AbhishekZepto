import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  getOrderErrorMessage,
  isOrderNotFoundError,
} from './customer-order-error-message.util';

test('getOrderErrorMessage maps ORDER_NOT_FOUND', () => {
  const error = {
    response: {
      data: {
        error: { code: 'ORDER_NOT_FOUND', details: {} },
        message: 'Not found',
      },
    },
  };

  assert.equal(getOrderErrorMessage(error, 'fallback'), 'Order not found.');
  assert.equal(isOrderNotFoundError(error), true);
});

test('getOrderErrorMessage maps cancellation errors', () => {
  assert.equal(
    getOrderErrorMessage(
      {
        response: {
          data: {
            error: { code: 'ORDER_CANCELLATION_NOT_ALLOWED' },
            message: 'server',
          },
        },
      },
      'fallback',
    ),
    'This order can no longer be cancelled.',
  );
  assert.equal(
    getOrderErrorMessage(
      {
        response: {
          data: {
            error: { code: 'ORDER_CANCELLATION_REASON_REQUIRED' },
            message: 'server',
          },
        },
      },
      'fallback',
    ),
    'Cancellation reason is required.',
  );
});

test('getOrderErrorMessage maps ORDER_NOT_OWNED', () => {
  const error = {
    response: {
      data: {
        error: { code: 'ORDER_NOT_OWNED', details: {} },
        message: 'Forbidden',
      },
    },
  };

  assert.equal(
    getOrderErrorMessage(error, 'fallback'),
    'You do not have access to this order.',
  );
});

test('getOrderErrorMessage uses fallback for unknown errors', () => {
  assert.equal(getOrderErrorMessage(new Error('network'), 'Could not load.'), 'Could not load.');
});
