import type { CartItemRecord, CartRecord } from '../types/cart.types';

export const findCartLineIndex = (cart: CartRecord, itemId: string): number =>
  cart.items.findIndex((item) => item._id?.toString() === itemId);

export const findCartLineByVariantId = (
  cart: CartRecord,
  variantId: string,
): CartItemRecord | undefined =>
  cart.items.find((item) => item.variantId.toString() === variantId);
