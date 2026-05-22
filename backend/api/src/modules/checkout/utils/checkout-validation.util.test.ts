import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { test } from 'node:test';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import type { CartRecord } from '../../cart/types/cart.types';
import { assertCartReadyForCheckout } from './checkout-validation.util';

const emptyCart = (): CartRecord => ({
  customerId: new Types.ObjectId(),
  storeId: new Types.ObjectId(),
  status: 'active',
  items: [],
  subtotal: 0,
  discountAmount: 0,
  taxAmount: 0,
  deliveryFeeAmount: 0,
  grandTotal: 0,
  currency: 'INR',
  lastCalculatedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

test('assertCartReadyForCheckout throws CHECKOUT_CART_EMPTY', () => {
  assert.throws(
    () => assertCartReadyForCheckout(emptyCart()),
    (error: unknown) =>
      error instanceof AppError &&
      error.errorCode === ERROR_CODES.CHECKOUT_CART_EMPTY,
  );
});
