import { Types } from 'mongoose';
import { writeAuditLog } from '../../audit';
import { findSelectedStoreByCustomerId } from '../../customer-addresses/repositories/customer-store-selection.repository';
import { findStoreById } from '../../stores/repositories/store.repository';
import { CART_AUDIT_EVENTS } from '../constants/cart-audit-events.constant';
import { CART_STATUS } from '../constants/cart-status.constant';
import { getCartMaxQuantityPerLine } from '../constants/cart-limits.constant';
import type { CartRecord } from '../types/cart.types';
import {
  clearCartItems,
  createCart,
  findActiveCartByCustomerAndStore,
  saveCart,
} from '../repositories/cart.repository';
import type {
  AddCartItemInput,
  CartAuditContext,
  CartResponse,
  GetCartQuery,
  RecalculateCartInput,
  UpdateCartItemInput,
} from '../types/cart.types';
import {
  calculateCartPricing,
  detectCartPriceDriftForStore,
  refreshCartSnapshotsAndPricing,
} from '../../pricing/services/cart-pricing.service';
import {
  cartItemNotFoundError,
  cartMaxQuantityExceededError,
  cartNotFoundError,
  cartPriceChangedError,
  cartStoreMismatchError,
  cartStoreNotFoundError,
} from '../utils/cart-error.mapper';
import { findCartLineByVariantId, findCartLineIndex } from '../utils/cart-line-item.util';
import {
  assertStockAvailable,
  resolveStoreProductForCart,
} from '../utils/cart-product-validation.util';
import { toCartResponse } from '../utils/cart-response.mapper';
import { recalculateCartTotals, recalculateLineTotal } from '../utils/cart-totals.util';

const assertStoreContext = async (customerId: string, storeId: string): Promise<void> => {
  const store = await findStoreById(storeId);

  if (!store) {
    throw cartStoreNotFoundError();
  }

  const selection = await findSelectedStoreByCustomerId(customerId);

  if (selection && selection.storeId.toString() !== storeId) {
    throw cartStoreMismatchError();
  }
};

const assertQuantityWithinMax = (quantity: number): void => {
  if (quantity > getCartMaxQuantityPerLine()) {
    throw cartMaxQuantityExceededError();
  }
};

const requireActiveCart = async (
  customerId: string,
  storeId: string,
): Promise<CartRecord & { _id: Types.ObjectId }> => {
  const cart = await findActiveCartByCustomerAndStore(customerId, storeId);

  if (!cart) {
    throw cartNotFoundError();
  }

  return cart;
};

const persistCart = async (
  cart: CartRecord & { _id: Types.ObjectId },
  customerId: string,
): Promise<CartRecord & { _id: Types.ObjectId }> => {
  const saved = await saveCart(cart._id.toString(), customerId, {
    items: cart.items,
    subtotal: cart.subtotal,
    discountAmount: cart.discountAmount,
    taxAmount: cart.taxAmount,
    deliveryFeeAmount: cart.deliveryFeeAmount,
    grandTotal: cart.grandTotal,
    lastCalculatedAt: cart.lastCalculatedAt,
  });

  if (!saved) {
    throw cartNotFoundError();
  }

  return saved;
};

const getOrCreateActiveCart = async (
  customerId: string,
  storeId: string,
): Promise<CartRecord & { _id: Types.ObjectId }> => {
  const existing = await findActiveCartByCustomerAndStore(customerId, storeId);

  if (existing) {
    return existing;
  }

  return createCart({
    customerId: new Types.ObjectId(customerId),
    storeId: new Types.ObjectId(storeId),
    status: CART_STATUS.ACTIVE,
    items: [],
    subtotal: 0,
    discountAmount: 0,
    taxAmount: 0,
    deliveryFeeAmount: 0,
    grandTotal: 0,
    currency: 'INR',
    lastCalculatedAt: null,
  });
};

const writeCartAudit = async (
  eventType: string,
  customerId: string,
  storeId: string,
  audit: CartAuditContext | undefined,
  metadata: Record<string, unknown>,
): Promise<void> => {
  if (!audit?.actorId) {
    return;
  }

  await writeAuditLog({
    eventType,
    actorId: new Types.ObjectId(audit.actorId),
    actorRole: 'customer',
    actorSurface: 'customer_app',
    entityType: 'cart',
    entityId: new Types.ObjectId(storeId),
    vendorId: null,
    storeId: new Types.ObjectId(storeId),
    cityId: null,
    requestId: audit.requestId ?? null,
    traceId: audit.traceId ?? null,
    ipAddress: null,
    userAgent: null,
    metadata: { customerId, ...metadata },
    status: 'success',
  });
};

export const getCartForCustomer = async (
  customerId: string,
  query: GetCartQuery,
  audit?: CartAuditContext,
): Promise<CartResponse> => {
  await assertStoreContext(customerId, query.storeId);

  const cart = await requireActiveCart(customerId, query.storeId);

  if (query.validatePrices) {
    const drift = await detectCartPriceDriftForStore(cart, query.storeId);

    if (drift.hasDrift) {
      throw cartPriceChangedError(drift.changedItems);
    }
  }

  calculateCartPricing(cart);

  await writeCartAudit(CART_AUDIT_EVENTS.VIEWED, customerId, query.storeId, audit, {
    itemCount: cart.items.length,
  });

  return toCartResponse(cart);
};

export const recalculateCartForCustomer = async (
  customerId: string,
  input: RecalculateCartInput,
  audit?: CartAuditContext,
): Promise<CartResponse> => {
  await assertStoreContext(customerId, input.storeId);

  const cart = await requireActiveCart(customerId, input.storeId);

  await refreshCartSnapshotsAndPricing(cart, input.storeId);
  const saved = await persistCart(cart, customerId);

  await writeCartAudit(CART_AUDIT_EVENTS.RECALCULATED, customerId, input.storeId, audit, {
    itemCount: saved.items.length,
  });

  return toCartResponse(saved);
};

export const addCartItem = async (
  customerId: string,
  input: AddCartItemInput,
  audit?: CartAuditContext,
): Promise<CartResponse> => {
  await assertStoreContext(customerId, input.storeId);
  assertQuantityWithinMax(input.quantity);

  const resolution = await resolveStoreProductForCart(input.storeId, input.variantId);
  const { storeProduct, productName, availableQuantity } = resolution;

  const cart = await getOrCreateActiveCart(customerId, input.storeId);
  const existingLine = findCartLineByVariantId(cart, input.variantId);
  const nextQuantity = (existingLine?.quantity ?? 0) + input.quantity;

  assertQuantityWithinMax(nextQuantity);
  assertStockAvailable(availableQuantity, nextQuantity);

  const now = new Date();
  const unitPriceSnapshot = storeProduct.finalPrice;

  if (existingLine) {
    existingLine.quantity = nextQuantity;
    existingLine.unitPriceSnapshot = unitPriceSnapshot;
    existingLine.lineTotal = recalculateLineTotal(nextQuantity, unitPriceSnapshot);
    existingLine.productNameSnapshot = productName;
    existingLine.updatedAt = now;
  } else {
    cart.items.push({
      _id: new Types.ObjectId(),
      productId: storeProduct.productId,
      variantId: storeProduct.variantId,
      storeProductId: storeProduct._id,
      quantity: input.quantity,
      unitPriceSnapshot,
      lineTotal: recalculateLineTotal(input.quantity, unitPriceSnapshot),
      productNameSnapshot: productName,
      addedAt: now,
      updatedAt: now,
    });
  }

  recalculateCartTotals(cart);
  const saved = await persistCart(cart, customerId);

  await writeCartAudit(CART_AUDIT_EVENTS.ITEM_ADDED, customerId, input.storeId, audit, {
    variantId: input.variantId,
    quantity: input.quantity,
  });

  return toCartResponse(saved);
};

export const updateCartItemQuantity = async (
  customerId: string,
  input: UpdateCartItemInput,
  audit?: CartAuditContext,
): Promise<CartResponse> => {
  await assertStoreContext(customerId, input.storeId);
  assertQuantityWithinMax(input.quantity);

  const cart = await requireActiveCart(customerId, input.storeId);
  const lineIndex = findCartLineIndex(cart, input.itemId);

  if (lineIndex < 0) {
    throw cartItemNotFoundError();
  }

  const line = cart.items[lineIndex];

  if (!line) {
    throw cartItemNotFoundError();
  }

  const resolution = await resolveStoreProductForCart(
    input.storeId,
    line.variantId.toString(),
  );

  assertStockAvailable(resolution.availableQuantity, input.quantity);

  const now = new Date();
  line.quantity = input.quantity;
  line.unitPriceSnapshot = resolution.storeProduct.finalPrice;
  line.lineTotal = recalculateLineTotal(input.quantity, line.unitPriceSnapshot);
  line.productNameSnapshot = resolution.productName;
  line.updatedAt = now;

  recalculateCartTotals(cart);
  const saved = await persistCart(cart, customerId);

  await writeCartAudit(CART_AUDIT_EVENTS.ITEM_UPDATED, customerId, input.storeId, audit, {
    itemId: input.itemId,
    quantity: input.quantity,
  });

  return toCartResponse(saved);
};

export const removeCartItem = async (
  customerId: string,
  storeId: string,
  itemId: string,
  audit?: CartAuditContext,
): Promise<CartResponse> => {
  await assertStoreContext(customerId, storeId);

  const cart = await requireActiveCart(customerId, storeId);
  const lineIndex = findCartLineIndex(cart, itemId);

  if (lineIndex < 0) {
    throw cartItemNotFoundError();
  }

  cart.items.splice(lineIndex, 1);
  recalculateCartTotals(cart);
  const saved = await persistCart(cart, customerId);

  await writeCartAudit(CART_AUDIT_EVENTS.ITEM_REMOVED, customerId, storeId, audit, { itemId });

  return toCartResponse(saved);
};

export const clearCustomerCart = async (
  customerId: string,
  storeId: string,
  audit?: CartAuditContext,
): Promise<CartResponse> => {
  await assertStoreContext(customerId, storeId);

  const cart = await requireActiveCart(customerId, storeId);
  const cleared = await clearCartItems(cart._id.toString(), customerId);

  if (!cleared) {
    throw cartNotFoundError();
  }

  await writeCartAudit(CART_AUDIT_EVENTS.CLEARED, customerId, storeId, audit, {});

  return toCartResponse(cleared);
};
