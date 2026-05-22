import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { afterEach, beforeEach, test } from 'node:test';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import type { StoreRecord } from '../../stores/models/store.model';
import type { StoreProductRecord } from '../../store-products/models/store-product.model';
import * as auditLogServiceModule from '../../audit/services/audit-log.service';
import * as selectionRepositoryModule from '../../customer-addresses/repositories/customer-store-selection.repository';
import * as storeRepositoryModule from '../../stores/repositories/store.repository';
import type { CartRecord } from '../types/cart.types';
import * as cartRepositoryModule from '../repositories/cart.repository';
import * as cartProductValidationModule from '../utils/cart-product-validation.util';
import {
  addCartItem,
  clearCustomerCart,
  getCartForCustomer,
  removeCartItem,
  updateCartItemQuantity,
} from './cart.service';

const cartRepository = cartRepositoryModule as unknown as {
  findActiveCartByCustomerAndStore: typeof cartRepositoryModule.findActiveCartByCustomerAndStore;
  createCart: typeof cartRepositoryModule.createCart;
  saveCart: typeof cartRepositoryModule.saveCart;
  clearCartItems: typeof cartRepositoryModule.clearCartItems;
};

const storeRepository = storeRepositoryModule as unknown as {
  findStoreById: (storeId: string) => Promise<(StoreRecord & { _id: Types.ObjectId }) | null>;
};

const selectionRepository = selectionRepositoryModule as unknown as {
  findSelectedStoreByCustomerId: (
    customerId: string,
  ) => Promise<{ storeId: Types.ObjectId } | null>;
};

const cartProductValidation = cartProductValidationModule as unknown as {
  resolveStoreProductForCart: typeof cartProductValidationModule.resolveStoreProductForCart;
};

const auditLogService = auditLogServiceModule as unknown as {
  writeAuditLog: typeof auditLogServiceModule.writeAuditLog;
};

const customerId = new Types.ObjectId().toString();
const storeId = new Types.ObjectId();
const variantId = new Types.ObjectId();
const storeProductId = new Types.ObjectId();
const productId = new Types.ObjectId();
const itemId = new Types.ObjectId();

const buildStore = (): StoreRecord & { _id: Types.ObjectId } => ({
  _id: storeId,
  vendorId: new Types.ObjectId(),
  cityId: new Types.ObjectId(),
  serviceAreaIds: [],
  name: 'Seed Store',
  slug: 'seed-store',
  code: 'STORE-000001',
  description: null,
  phone: '9999999999',
  email: null,
  addressLine1: 'Line 1',
  addressLine2: null,
  landmark: null,
  pincode: '110075',
  latitude: 28.5,
  longitude: 77.0,
  serviceRadiusKm: 5,
  openingTime: '08:00',
  closingTime: '22:00',
  operatingDays: [],
  isOpen: true,
  isAcceptingOrders: true,
  temporaryClosureReason: null,
  storeType: 'dark_store',
  fulfillmentType: 'delivery',
  status: 'active',
  isDeleted: false,
  deletedAt: null,
  createdBy: null,
  updatedBy: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const buildStoreProduct = (): StoreProductRecord & { _id: Types.ObjectId } => ({
  _id: storeProductId,
  storeId,
  vendorId: new Types.ObjectId(),
  cityId: new Types.ObjectId(),
  productId,
  variantId,
  categoryId: new Types.ObjectId(),
  brandId: null,
  sku: 'SKU-1',
  storeSku: null,
  mrp: 100,
  sellingPrice: 90,
  discountType: 'none',
  discountValue: 0,
  finalPrice: 90,
  taxCategoryId: null,
  isAvailable: true,
  isVisible: true,
  isFeatured: false,
  isPriceLocked: false,
  priceUpdatedAt: null,
  availabilityUpdatedAt: null,
  status: 'active',
  isDeleted: false,
  deletedAt: null,
  createdBy: null,
  updatedBy: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const buildCart = (items: CartRecord['items'] = []) => ({
  _id: new Types.ObjectId(),
  customerId: new Types.ObjectId(customerId),
  storeId,
  status: 'active' as const,
  items,
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

beforeEach(() => {
  auditLogService.writeAuditLog = async () => undefined;
  storeRepository.findStoreById = async () => buildStore();
  selectionRepository.findSelectedStoreByCustomerId = async () => null;
});

afterEach(() => {
  cartRepository.findActiveCartByCustomerAndStore =
    cartRepositoryModule.findActiveCartByCustomerAndStore;
  cartRepository.createCart = cartRepositoryModule.createCart;
  cartRepository.saveCart = cartRepositoryModule.saveCart;
  cartRepository.clearCartItems = cartRepositoryModule.clearCartItems;
  storeRepository.findStoreById = storeRepositoryModule.findStoreById;
  selectionRepository.findSelectedStoreByCustomerId =
    selectionRepositoryModule.findSelectedStoreByCustomerId;
  cartProductValidation.resolveStoreProductForCart =
    cartProductValidationModule.resolveStoreProductForCart;
  auditLogService.writeAuditLog = auditLogServiceModule.writeAuditLog;
});

test('getCartForCustomer throws CART_NOT_FOUND when no cart', async () => {
  cartRepository.findActiveCartByCustomerAndStore = async () => null;

  await assert.rejects(
    () => getCartForCustomer(customerId, { storeId: storeId.toString() }),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.errorCode, ERROR_CODES.CART_NOT_FOUND);
      return true;
    },
  );
});

test('addCartItem creates cart and line', async () => {
  cartRepository.findActiveCartByCustomerAndStore = async () => null;
  cartRepository.createCart = async (payload) =>
    ({
      _id: new Types.ObjectId(),
      ...payload,
      items: payload.items ?? [],
    }) as Awaited<ReturnType<typeof cartRepositoryModule.createCart>>;
  cartRepository.saveCart = async (_cartId, _customerId, payload) =>
    ({
      _id: new Types.ObjectId(),
      customerId: new Types.ObjectId(customerId),
      storeId,
      status: 'active',
      currency: 'INR',
      lastCalculatedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      subtotal: payload.subtotal ?? 0,
      discountAmount: 0,
      taxAmount: 0,
      deliveryFeeAmount: 0,
      grandTotal: payload.grandTotal ?? 0,
      items: payload.items ?? [],
    }) as Awaited<ReturnType<typeof cartRepositoryModule.saveCart>>;

  cartProductValidation.resolveStoreProductForCart = async () => ({
    storeProduct: buildStoreProduct(),
    productName: 'Milk',
    availableQuantity: 20,
  });

  const result = await addCartItem(customerId, {
    storeId: storeId.toString(),
    variantId: variantId.toString(),
    quantity: 2,
  });

  assert.equal(result.items.length, 1);
  assert.equal(result.items[0]?.quantity, 2);
  assert.equal(result.grandTotal, 180);
});

test('addCartItem rejects insufficient stock', async () => {
  cartRepository.findActiveCartByCustomerAndStore = async () => null;
  cartRepository.createCart = async (payload) =>
    ({
      _id: new Types.ObjectId(),
      ...payload,
      items: [],
    }) as Awaited<ReturnType<typeof cartRepositoryModule.createCart>>;

  cartProductValidation.resolveStoreProductForCart = async () => ({
    storeProduct: buildStoreProduct(),
    productName: 'Milk',
    availableQuantity: 1,
  });

  await assert.rejects(
    () =>
      addCartItem(customerId, {
        storeId: storeId.toString(),
        variantId: variantId.toString(),
        quantity: 3,
      }),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.errorCode, ERROR_CODES.CART_INSUFFICIENT_STOCK);
      return true;
    },
  );
});

test('updateCartItemQuantity updates line', async () => {
  const now = new Date();
  const cart = buildCart([
    {
      _id: itemId,
      productId,
      variantId,
      storeProductId,
      quantity: 1,
      unitPriceSnapshot: 90,
      lineTotal: 90,
      productNameSnapshot: 'Milk',
      addedAt: now,
      updatedAt: now,
    },
  ]);

  cartRepository.findActiveCartByCustomerAndStore = async () => cart;
  cartRepository.saveCart = async () => {
    const line = cart.items[0]!;

    return {
      ...cart,
      items: [{ ...line, quantity: 2, lineTotal: 180 }],
      subtotal: 180,
      grandTotal: 180,
    };
  };

  cartProductValidation.resolveStoreProductForCart = async () => ({
    storeProduct: buildStoreProduct(),
    productName: 'Milk',
    availableQuantity: 10,
  });

  const result = await updateCartItemQuantity(customerId, {
    storeId: storeId.toString(),
    itemId: itemId.toString(),
    quantity: 2,
  });

  assert.equal(result.items[0]?.quantity, 2);
});

test('removeCartItem and clearCustomerCart', async () => {
  const now = new Date();
  const cart = buildCart([
    {
      _id: itemId,
      productId,
      variantId,
      storeProductId,
      quantity: 1,
      unitPriceSnapshot: 90,
      lineTotal: 90,
      productNameSnapshot: 'Milk',
      addedAt: now,
      updatedAt: now,
    },
  ]);

  cartRepository.findActiveCartByCustomerAndStore = async () => cart;
  cartRepository.saveCart = async () => ({ ...cart, items: [], subtotal: 0, grandTotal: 0 });
  cartRepository.clearCartItems = async () => ({ ...cart, items: [], subtotal: 0, grandTotal: 0 });

  const removed = await removeCartItem(customerId, storeId.toString(), itemId.toString());
  assert.equal(removed.items.length, 0);

  const cleared = await clearCustomerCart(customerId, storeId.toString());
  assert.equal(cleared.items.length, 0);
});
