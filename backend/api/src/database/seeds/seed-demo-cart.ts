import { Types } from 'mongoose';
import { AUTH_ROLE } from '../../modules/auth/constants/auth-role.constants';
import { findUserIdentityByPhoneAndRole } from '../../modules/auth/repositories/user-identity.repository';
import { findProductBySlug } from '../../modules/catalog/products/repositories/product.repository';
import { findProductVariantBySku } from '../../modules/catalog/variants/repositories/product-variant.repository';
import { CART_STATUS } from '../../modules/cart/constants/cart-status.constant';
import {
  createCart,
  findActiveCartByCustomerAndStore,
  saveCart,
} from '../../modules/cart/repositories/cart.repository';
import { recalculateCartTotals, recalculateLineTotal } from '../../modules/cart/utils/cart-totals.util';
import { findInventoryStockByStoreProduct } from '../../modules/inventory/repositories/inventory-stock.repository';
import { findStoreByCode } from '../../modules/stores/repositories/store.repository';
import { findStoreProductByStoreAndVariant } from '../../modules/store-products/repositories/store-product.repository';
import { SEED_STORE_CODE } from './seed-store-products';

const SEED_CUSTOMER_PHONE = '9999999999';

const DEMO_VARIANT_SKUS = [
  'SEED-AMUL-TAAZA-1L',
  'SEED-BRIT-GOODDAY-200G',
  'SEED-BANANA-DOZEN',
] as const;

const DEMO_PRODUCT_SLUGS: Record<(typeof DEMO_VARIANT_SKUS)[number], string> = {
  'SEED-AMUL-TAAZA-1L': 'amul-taaza-milk-1l',
  'SEED-BRIT-GOODDAY-200G': 'britannia-good-day-cashew',
  'SEED-BANANA-DOZEN': 'fresh-bananas-dozen',
};

export const seedDemoCart = async (dryRun: boolean): Promise<void> => {
  if (dryRun) {
    console.log('Dry run: would upsert demo cart for', SEED_CUSTOMER_PHONE);
    return;
  }

  const customer = await findUserIdentityByPhoneAndRole(SEED_CUSTOMER_PHONE, AUTH_ROLE.CUSTOMER);

  if (!customer) {
    console.log('Skipping demo cart seed: dev customer not found');
    return;
  }

  const store = await findStoreByCode(SEED_STORE_CODE);

  if (!store) {
    console.log('Skipping demo cart seed: seed store not found');
    return;
  }

  const customerId = customer._id.toString();
  const storeId = store._id.toString();
  const existing = await findActiveCartByCustomerAndStore(customerId, storeId);
  const now = new Date();
  const items: Array<{
    _id: Types.ObjectId;
    productId: Types.ObjectId;
    variantId: Types.ObjectId;
    storeProductId: Types.ObjectId;
    quantity: number;
    unitPriceSnapshot: number;
    lineTotal: number;
    productNameSnapshot: string;
    addedAt: Date;
    updatedAt: Date;
  }> = [];

  for (const variantSku of DEMO_VARIANT_SKUS) {
    const productSlug = DEMO_PRODUCT_SLUGS[variantSku];
    const product = await findProductBySlug(productSlug);
    const variant = await findProductVariantBySku(variantSku);

    if (!product || !variant) {
      console.log('Skipping demo cart line: catalog missing', variantSku);
      continue;
    }

    const storeProduct = await findStoreProductByStoreAndVariant(storeId, variant._id.toString());

    if (!storeProduct) {
      console.log('Skipping demo cart line: store product missing', variantSku);
      continue;
    }

    const stock = await findInventoryStockByStoreProduct(storeId, storeProduct._id.toString());
    const availableQuantity = stock?.availableQuantity ?? 0;
    const quantity = Math.min(2, Math.max(1, availableQuantity));

    if (availableQuantity < 1) {
      console.log('Skipping demo cart line: no stock', variantSku);
      continue;
    }

    items.push({
      _id: new Types.ObjectId(),
      productId: product._id,
      variantId: variant._id,
      storeProductId: storeProduct._id,
      quantity,
      unitPriceSnapshot: storeProduct.finalPrice,
      lineTotal: recalculateLineTotal(quantity, storeProduct.finalPrice),
      productNameSnapshot: product.name,
      addedAt: now,
      updatedAt: now,
    });
  }

  if (items.length === 0) {
    console.log('Skipping demo cart seed: no valid lines');
    return;
  }

  if (existing) {
    const cart = { ...existing, items };
    recalculateCartTotals(cart);
    await saveCart(existing._id.toString(), customerId, {
      items: cart.items,
      subtotal: cart.subtotal,
      discountAmount: cart.discountAmount,
      taxAmount: cart.taxAmount,
      deliveryFeeAmount: cart.deliveryFeeAmount,
      grandTotal: cart.grandTotal,
      lastCalculatedAt: cart.lastCalculatedAt,
    });
    console.log('Updated demo cart with', items.length, 'lines');
    return;
  }

  const cart = {
    customerId: customer._id,
    storeId: store._id,
    status: CART_STATUS.ACTIVE,
    items,
    subtotal: 0,
    discountAmount: 0,
    taxAmount: 0,
    deliveryFeeAmount: 0,
    grandTotal: 0,
    currency: 'INR',
    lastCalculatedAt: null,
    createdAt: now,
    updatedAt: now,
  };

  recalculateCartTotals(cart);
  await createCart(cart);
  console.log('Seeded demo cart with', items.length, 'lines');
};
