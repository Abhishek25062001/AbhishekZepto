import type { CartRecord } from '../../cart/types/cart.types';
import {
  applyResolvedPricesToCartItems,
  resolveCurrentPricesForCart,
} from '../utils/cart-line-price.util';
import { detectCartPriceDrift } from '../utils/cart-price-drift.util';
import {
  calculateCartPricingTotals,
  recalculateLineTotal,
} from '../utils/cart-pricing-math.util';
import type { CartPriceDriftResult } from '../types/cart-pricing.types';

export { recalculateLineTotal };

export const applyLineTotals = (cart: CartRecord): void => {
  for (const item of cart.items) {
    item.lineTotal = recalculateLineTotal(item.quantity, item.unitPriceSnapshot);
  }
};

export const calculateCartPricing = (cart: CartRecord): void => {
  applyLineTotals(cart);

  const subtotal = cart.items.reduce((sum, item) => sum + item.lineTotal, 0);
  const totals = calculateCartPricingTotals(subtotal);

  cart.subtotal = totals.subtotal;
  cart.discountAmount = totals.discountAmount;
  cart.taxAmount = totals.taxAmount;
  cart.deliveryFeeAmount = totals.deliveryFeeAmount;
  cart.grandTotal = totals.grandTotal;
  cart.lastCalculatedAt = totals.lastCalculatedAt;
};

export const detectCartPriceDriftForStore = async (
  cart: CartRecord,
  storeId: string,
): Promise<CartPriceDriftResult> => {
  const currentPrices = await resolveCurrentPricesForCart(storeId, cart.items);
  return detectCartPriceDrift(cart.items, currentPrices);
};

export const refreshCartSnapshotsAndPricing = async (
  cart: CartRecord,
  storeId: string,
): Promise<void> => {
  const currentPrices = await resolveCurrentPricesForCart(storeId, cart.items);
  applyResolvedPricesToCartItems(cart.items, currentPrices);
  calculateCartPricing(cart);
};
