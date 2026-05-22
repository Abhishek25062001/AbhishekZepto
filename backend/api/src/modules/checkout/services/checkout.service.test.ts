import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { afterEach, beforeEach, test } from 'node:test';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import type { CartRecord } from '../../cart/types/cart.types';
import type { CheckoutSessionRecord } from '../types/checkout.types';
import * as addressRepositoryModule from '../../customer-addresses/repositories/customer-address.repository';
import * as selectionRepositoryModule from '../../customer-addresses/repositories/customer-store-selection.repository';
import * as cartRepositoryModule from '../../cart/repositories/cart.repository';
import * as checkoutRepositoryModule from '../repositories/checkout-session.repository';
import * as lockUtilModule from '../utils/checkout-inventory-lock.util';
import * as validationModule from '../utils/checkout-validation.util';
import {
  cancelCheckoutForCustomer,
  getCheckoutSummaryForCustomer,
  initiateCheckoutForCustomer,
} from './checkout.service';

const addressRepository = addressRepositoryModule as unknown as {
  findAddressByIdForCustomer: typeof addressRepositoryModule.findAddressByIdForCustomer;
};

const selectionRepository = selectionRepositoryModule as unknown as {
  findSelectedStoreByCustomerId: typeof selectionRepositoryModule.findSelectedStoreByCustomerId;
};

const cartRepository = cartRepositoryModule as unknown as {
  findActiveCartByCustomerAndStore: typeof cartRepositoryModule.findActiveCartByCustomerAndStore;
};

const checkoutRepository = checkoutRepositoryModule as unknown as {
  findCheckoutSessionByIdempotencyKey: typeof checkoutRepositoryModule.findCheckoutSessionByIdempotencyKey;
  findActiveCheckoutSessionByCustomer: typeof checkoutRepositoryModule.findActiveCheckoutSessionByCustomer;
  createCheckoutSession: typeof checkoutRepositoryModule.createCheckoutSession;
  findCheckoutSessionByIdForCustomer: typeof checkoutRepositoryModule.findCheckoutSessionByIdForCustomer;
  updateCheckoutSessionById: typeof checkoutRepositoryModule.updateCheckoutSessionById;
};

const lockUtil = lockUtilModule as unknown as {
  createCheckoutLocksForCart: typeof lockUtilModule.createCheckoutLocksForCart;
  releaseCheckoutLocks: typeof lockUtilModule.releaseCheckoutLocks;
};

const validation = validationModule as unknown as {
  assertCartReadyForCheckout: typeof validationModule.assertCartReadyForCheckout;
  assertStoreOpenForCheckout: typeof validationModule.assertStoreOpenForCheckout;
  assertAddressServiceableForStore: typeof validationModule.assertAddressServiceableForStore;
  assertCartPricingCurrentForCheckout: typeof validationModule.assertCartPricingCurrentForCheckout;
  assertCartStockAvailableForCheckout: typeof validationModule.assertCartStockAvailableForCheckout;
};

const customerId = new Types.ObjectId().toString();
const storeId = new Types.ObjectId();
const addressId = new Types.ObjectId();
const cartId = new Types.ObjectId();

const buildCart = (): CartRecord & { _id: Types.ObjectId } => ({
  _id: cartId,
  customerId: new Types.ObjectId(customerId),
  storeId,
  status: 'active',
  items: [
    {
      _id: new Types.ObjectId(),
      productId: new Types.ObjectId(),
      variantId: new Types.ObjectId(),
      storeProductId: new Types.ObjectId(),
      quantity: 1,
      unitPriceSnapshot: 100,
      lineTotal: 100,
      productNameSnapshot: 'Item',
      addedAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  subtotal: 100,
  discountAmount: 0,
  taxAmount: 0,
  deliveryFeeAmount: 0,
  grandTotal: 100,
  currency: 'INR',
  lastCalculatedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
});

const buildAddress = () => ({
  _id: addressId,
  customerId: new Types.ObjectId(customerId),
  label: 'Home',
  line1: '123 St',
  line2: null,
  landmark: null,
  city: 'Mumbai',
  cityId: null,
  state: null,
  postalCode: null,
  country: 'IN',
  latitude: 19.0,
  longitude: 72.0,
  isDefault: true,
  status: 'active' as const,
  isDeleted: false,
  deletedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const buildSession = (): CheckoutSessionRecord & { _id: Types.ObjectId } => ({
  _id: new Types.ObjectId(),
  customerId: new Types.ObjectId(customerId),
  cartId,
  storeId,
  addressId,
  addressSnapshot: {
    label: 'Home',
    line1: '123 St',
    line2: null,
    landmark: null,
    city: 'Mumbai',
    state: null,
    postalCode: null,
    country: 'IN',
    latitude: 19,
    longitude: 72,
  },
  status: 'initiated',
  lockTokens: ['lk_test'],
  reservationExpiresAt: new Date(Date.now() + 60_000),
  summarySnapshot: {
    currency: 'INR',
    itemCount: 1,
    subtotal: 100,
    discountAmount: 0,
    taxAmount: 0,
    deliveryFeeAmount: 0,
    grandTotal: 100,
    items: [],
  },
  paymentId: null,
  orderId: null,
  idempotencyKey: null,
  failureReason: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const audit = { actorId: customerId, requestId: null, traceId: null };

beforeEach(() => {
  checkoutRepository.findCheckoutSessionByIdempotencyKey = async () => null;
  checkoutRepository.findActiveCheckoutSessionByCustomer = async () => null;
  selectionRepository.findSelectedStoreByCustomerId = async () =>
    ({
      _id: new Types.ObjectId(),
      customerId: new Types.ObjectId(customerId),
      storeId,
      addressId,
      isSelected: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }) as Awaited<ReturnType<typeof selectionRepositoryModule.findSelectedStoreByCustomerId>>;
  addressRepository.findAddressByIdForCustomer = async () => buildAddress();
  cartRepository.findActiveCartByCustomerAndStore = async () => buildCart();
  validation.assertCartReadyForCheckout = () => undefined;
  validation.assertStoreOpenForCheckout = async () => undefined;
  validation.assertAddressServiceableForStore = async () => undefined;
  validation.assertCartPricingCurrentForCheckout = async () => undefined;
  validation.assertCartStockAvailableForCheckout = async () => undefined;
  lockUtil.createCheckoutLocksForCart = async () => ['lk_test'];
  lockUtil.releaseCheckoutLocks = async () => undefined;
});

afterEach(() => {
  checkoutRepository.findCheckoutSessionByIdempotencyKey =
    checkoutRepositoryModule.findCheckoutSessionByIdempotencyKey;
  checkoutRepository.findActiveCheckoutSessionByCustomer =
    checkoutRepositoryModule.findActiveCheckoutSessionByCustomer;
  checkoutRepository.createCheckoutSession = checkoutRepositoryModule.createCheckoutSession;
  checkoutRepository.findCheckoutSessionByIdForCustomer =
    checkoutRepositoryModule.findCheckoutSessionByIdForCustomer;
  checkoutRepository.updateCheckoutSessionById =
    checkoutRepositoryModule.updateCheckoutSessionById;
  selectionRepository.findSelectedStoreByCustomerId =
    selectionRepositoryModule.findSelectedStoreByCustomerId;
  addressRepository.findAddressByIdForCustomer =
    addressRepositoryModule.findAddressByIdForCustomer;
  cartRepository.findActiveCartByCustomerAndStore =
    cartRepositoryModule.findActiveCartByCustomerAndStore;
  lockUtil.createCheckoutLocksForCart = lockUtilModule.createCheckoutLocksForCart;
  lockUtil.releaseCheckoutLocks = lockUtilModule.releaseCheckoutLocks;
});

test('initiateCheckoutForCustomer creates session with locks', async () => {
  const session = buildSession();
  checkoutRepository.createCheckoutSession = async () => session;

  const result = await initiateCheckoutForCustomer(
    customerId,
    { addressId: addressId.toString() },
    audit,
  );

  assert.equal(result.checkoutSessionId, session._id.toString());
  assert.deepEqual(result.lockTokens, ['lk_test']);
  assert.equal(result.summary.grandTotal, 100);
});

test('initiateCheckoutForCustomer returns idempotent session', async () => {
  const session = buildSession();
  checkoutRepository.findCheckoutSessionByIdempotencyKey = async () => session;

  const result = await initiateCheckoutForCustomer(
    customerId,
    { addressId: addressId.toString(), idempotencyKey: 'key-1' },
    audit,
  );

  assert.equal(result.checkoutSessionId, session._id.toString());
});

test('getCheckoutSummaryForCustomer throws when session missing', async () => {
  checkoutRepository.findCheckoutSessionByIdForCustomer = async () => null;

  await assert.rejects(
    () =>
      getCheckoutSummaryForCustomer(customerId, {
        checkoutSessionId: new Types.ObjectId().toString(),
      }),
    (error: unknown) =>
      error instanceof AppError &&
      error.errorCode === ERROR_CODES.CHECKOUT_SESSION_NOT_FOUND,
  );
});

test('cancelCheckoutForCustomer releases locks and cancels session', async () => {
  const session = buildSession();
  const cancelledSession = { ...session, status: 'cancelled' as const, lockTokens: [] };
  let fetchCount = 0;

  checkoutRepository.findCheckoutSessionByIdForCustomer = async () => {
    fetchCount += 1;
    return fetchCount === 1 ? session : cancelledSession;
  };

  checkoutRepository.updateCheckoutSessionById = async () => cancelledSession;

  const result = await cancelCheckoutForCustomer(
    customerId,
    { checkoutSessionId: session._id.toString() },
    audit,
  );

  assert.equal(result.status, 'cancelled');
});
