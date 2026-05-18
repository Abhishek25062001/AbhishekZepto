import assert from 'node:assert/strict';
import { test } from 'node:test';
import { STORE_PRODUCT_DISCOUNT_TYPE } from '../constants/store-product-discount-type.constant';
import { calculateFinalPrice } from './store-product-price.util';

test('calculateFinalPrice returns sellingPrice when discount is none', () => {
  assert.equal(calculateFinalPrice(100, 80, STORE_PRODUCT_DISCOUNT_TYPE.NONE, 0), 80);
});

test('calculateFinalPrice applies flat discount', () => {
  assert.equal(calculateFinalPrice(100, 80, STORE_PRODUCT_DISCOUNT_TYPE.FLAT, 10), 70);
});

test('calculateFinalPrice applies percentage discount', () => {
  assert.equal(calculateFinalPrice(100, 80, STORE_PRODUCT_DISCOUNT_TYPE.PERCENTAGE, 25), 60);
});
