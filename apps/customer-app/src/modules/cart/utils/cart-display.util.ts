import type { Cart } from '../types/cart.types';

export const getCartItemCount = (cart: Cart | undefined): number =>
  cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

export const createEmptyCart = (storeId: string): Cart => ({
  id: '',
  storeId,
  status: 'active',
  currency: 'INR',
  items: [],
  subtotal: 0,
  discountAmount: 0,
  taxAmount: 0,
  deliveryFeeAmount: 0,
  grandTotal: 0,
});
