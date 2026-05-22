import { Types } from 'mongoose';
import type { CartItemRecord } from '../../cart/types/cart.types';
import { resolveStoreProductForCart } from '../../cart/utils/cart-product-validation.util';
import type { ResolvedCartLinePrice } from '../types/cart-pricing.types';

export const resolveCurrentPricesForCart = async (
  storeId: string,
  items: CartItemRecord[],
): Promise<ResolvedCartLinePrice[]> => {
  const resolved: ResolvedCartLinePrice[] = [];

  for (const item of items) {
    const itemId = item._id?.toString();

    if (!itemId) {
      continue;
    }

    const resolution = await resolveStoreProductForCart(storeId, item.variantId.toString());

    resolved.push({
      itemId,
      variantId: item.variantId.toString(),
      storeProductId: resolution.storeProduct._id.toString(),
      unitPrice: resolution.storeProduct.finalPrice,
      productName: resolution.productName,
    });
  }

  return resolved;
};

export const applyResolvedPricesToCartItems = (
  items: CartItemRecord[],
  currentPrices: ResolvedCartLinePrice[],
): void => {
  const priceByItemId = new Map(currentPrices.map((entry) => [entry.itemId, entry]));
  const now = new Date();

  for (const item of items) {
    const itemId = item._id?.toString();

    if (!itemId) {
      continue;
    }

    const current = priceByItemId.get(itemId);

    if (!current) {
      continue;
    }

    item.unitPriceSnapshot = current.unitPrice;
    item.productNameSnapshot = current.productName;
    item.storeProductId = new Types.ObjectId(current.storeProductId);
    item.updatedAt = now;
  }
};
