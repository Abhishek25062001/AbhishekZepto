import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { afterEach, beforeEach, test } from 'node:test';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import type { StoreRecord } from '../../stores/models/store.model';
import type { CartRecord } from '../types/cart.types';
import * as pricingServiceModule from '../../pricing/services/cart-pricing.service';
import * as storeRepositoryModule from '../../stores/repositories/store.repository';
import * as selectionRepositoryModule from '../../customer-addresses/repositories/customer-store-selection.repository';
import * as cartRepositoryModule from '../repositories/cart.repository';
import {
  getCartForCustomer,
  recalculateCartForCustomer,
} from './cart.service';

const storeRepository = storeRepositoryModule as unknown as {
  findStoreById: (storeId: string) => Promise<(StoreRecord & { _id: Types.ObjectId }) | null>;
};

const selectionRepository = selectionRepositoryModule as unknown as {
  findSelectedStoreByCustomerId: (
    customerId: string,
  ) => Promise<{ storeId: Types.ObjectId } | null>;
};

const cartRepository = cartRepositoryModule as unknown as {
  findActiveCartByCustomerAndStore: (
    customerId: string,
    storeId: string,
  ) => Promise<(CartRecord & { _id: Types.ObjectId }) | null>;
  saveCart: typeof cartRepositoryModule.saveCart;
};

const pricingService = pricingServiceModule as unknown as {
  detectCartPriceDriftForStore: typeof pricingServiceModule.detectCartPriceDriftForStore;
  refreshCartSnapshotsAndPricing: typeof pricingServiceModule.refreshCartSnapshotsAndPricing;
  calculateCartPricing: typeof pricingServiceModule.calculateCartPricing;
};

const customerId = new Types.ObjectId().toString();
const storeId = new Types.ObjectId();

const buildCart = (): CartRecord & { _id: Types.ObjectId } => ({
  _id: new Types.ObjectId(),
  customerId: new Types.ObjectId(customerId),
  storeId,
  status: 'active',
  items: [
    {
      _id: new Types.ObjectId(),
      productId: new Types.ObjectId(),
      variantId: new Types.ObjectId(),
      storeProductId: new Types.ObjectId(),
      quantity: 2,
      unitPriceSnapshot: 100,
      lineTotal: 200,
      productNameSnapshot: 'Item',
      addedAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  subtotal: 200,
  discountAmount: 0,
  taxAmount: 0,
  deliveryFeeAmount: 0,
  grandTotal: 200,
  currency: 'INR',
  lastCalculatedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

beforeEach(() => {
  storeRepository.findStoreById = async () =>
    ({ _id: storeId, status: 'active' }) as StoreRecord & { _id: Types.ObjectId };
  selectionRepository.findSelectedStoreByCustomerId = async () => null;
});

afterEach(() => {
  storeRepository.findStoreById = storeRepositoryModule.findStoreById;
  selectionRepository.findSelectedStoreByCustomerId =
    selectionRepositoryModule.findSelectedStoreByCustomerId;
  cartRepository.findActiveCartByCustomerAndStore =
    cartRepositoryModule.findActiveCartByCustomerAndStore;
  cartRepository.saveCart = cartRepositoryModule.saveCart;
  pricingService.detectCartPriceDriftForStore = pricingServiceModule.detectCartPriceDriftForStore;
  pricingService.refreshCartSnapshotsAndPricing =
    pricingServiceModule.refreshCartSnapshotsAndPricing;
  pricingService.calculateCartPricing = pricingServiceModule.calculateCartPricing;
});

test('getCartForCustomer throws CART_PRICE_CHANGED when validatePrices detects drift', async () => {
  const cart = buildCart();
  cartRepository.findActiveCartByCustomerAndStore = async () => cart;
  pricingService.detectCartPriceDriftForStore = async () => ({
    hasDrift: true,
    changedItems: [{ itemId: 'x', variantId: 'y', oldPrice: 100, newPrice: 120 }],
  });
  pricingService.calculateCartPricing = () => undefined;

  await assert.rejects(
    () => getCartForCustomer(customerId, { storeId: storeId.toString(), validatePrices: true }),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.errorCode, ERROR_CODES.CART_PRICE_CHANGED);
      return true;
    },
  );
});

test('recalculateCartForCustomer refreshes pricing and persists', async () => {
  const cart = buildCart();
  cartRepository.findActiveCartByCustomerAndStore = async () => cart;
  pricingService.refreshCartSnapshotsAndPricing = async (target) => {
    target.subtotal = 220;
    target.taxAmount = 11;
    target.deliveryFeeAmount = 40;
    target.grandTotal = 271;
  };
  cartRepository.saveCart = async (_id, _customerId, payload) =>
    ({
      ...cart,
      ...payload,
    }) as CartRecord & { _id: Types.ObjectId };

  const result = await recalculateCartForCustomer(customerId, {
    storeId: storeId.toString(),
  });

  assert.equal(result.grandTotal, 271);
  assert.equal(result.taxAmount, 11);
});
