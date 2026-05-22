import {
  getCartDeliveryFeeAmount,
  getCartTaxRatePercent,
} from '../constants/cart-pricing-config.constant';
import type { CartPricingTotals } from '../types/cart-pricing.types';

export const recalculateLineTotal = (quantity: number, unitPriceSnapshot: number): number =>
  quantity * unitPriceSnapshot;

export const calculateCartPricingTotals = (subtotal: number): CartPricingTotals => {
  const discountAmount = 0;
  const taxRate = getCartTaxRatePercent();
  const taxAmount = Math.round((subtotal * taxRate) / 100);
  const deliveryFeeAmount = getCartDeliveryFeeAmount();
  const grandTotal = subtotal - discountAmount + taxAmount + deliveryFeeAmount;

  return {
    subtotal,
    discountAmount,
    taxAmount,
    deliveryFeeAmount,
    grandTotal,
    lastCalculatedAt: new Date(),
  };
};
