import type { CartRecord } from '../types/cart.types';
import {
  calculateCartPricing,
  recalculateLineTotal,
} from '../../pricing/services/cart-pricing.service';

export { recalculateLineTotal };

export const recalculateCartTotals = (cart: CartRecord): void => {
  calculateCartPricing(cart);
};
