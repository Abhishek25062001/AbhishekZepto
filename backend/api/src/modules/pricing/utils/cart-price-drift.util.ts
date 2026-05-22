import type { CartItemRecord } from '../../cart/types/cart.types';
import type { CartPriceDriftResult, ResolvedCartLinePrice } from '../types/cart-pricing.types';

export const detectCartPriceDrift = (
  items: CartItemRecord[],
  currentPrices: ResolvedCartLinePrice[],
): CartPriceDriftResult => {
  const priceByItemId = new Map(currentPrices.map((entry) => [entry.itemId, entry]));
  const changedItems: CartPriceDriftResult['changedItems'] = [];

  for (const item of items) {
    const itemId = item._id?.toString();

    if (!itemId) {
      continue;
    }

    const current = priceByItemId.get(itemId);

    if (!current) {
      continue;
    }

    if (item.unitPriceSnapshot !== current.unitPrice) {
      changedItems.push({
        itemId,
        variantId: item.variantId.toString(),
        oldPrice: item.unitPriceSnapshot,
        newPrice: current.unitPrice,
      });
    }
  }

  return {
    hasDrift: changedItems.length > 0,
    changedItems,
  };
};
