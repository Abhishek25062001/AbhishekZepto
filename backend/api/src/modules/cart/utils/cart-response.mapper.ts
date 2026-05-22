import type { Types } from 'mongoose';
import type { CartItemRecord, CartRecord, CartItemResponse, CartResponse } from '../types/cart.types';

const toCartItemResponse = (item: CartItemRecord): CartItemResponse => ({
  id: item._id?.toString() ?? '',
  productId: item.productId.toString(),
  variantId: item.variantId.toString(),
  storeProductId: item.storeProductId.toString(),
  quantity: item.quantity,
  unitPriceSnapshot: item.unitPriceSnapshot,
  lineTotal: item.lineTotal,
  productNameSnapshot: item.productNameSnapshot,
});

export const toCartResponse = (cart: CartRecord & { _id: Types.ObjectId }): CartResponse => ({
  id: cart._id.toString(),
  storeId: cart.storeId.toString(),
  status: cart.status,
  currency: cart.currency,
  items: cart.items.map(toCartItemResponse),
  subtotal: cart.subtotal,
  discountAmount: cart.discountAmount,
  taxAmount: cart.taxAmount,
  deliveryFeeAmount: cart.deliveryFeeAmount,
  grandTotal: cart.grandTotal,
});
