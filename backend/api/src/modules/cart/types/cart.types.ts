import type { Types } from 'mongoose';
import type { CartStatus } from '../constants/cart-status.constant';

export type CartItemRecord = {
  _id?: Types.ObjectId;
  productId: Types.ObjectId;
  variantId: Types.ObjectId;
  storeProductId: Types.ObjectId;
  quantity: number;
  unitPriceSnapshot: number;
  lineTotal: number;
  productNameSnapshot: string | null;
  addedAt: Date;
  updatedAt: Date;
};

export type CartRecord = {
  customerId: Types.ObjectId;
  storeId: Types.ObjectId;
  status: CartStatus;
  items: CartItemRecord[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  deliveryFeeAmount: number;
  grandTotal: number;
  currency: string;
  lastCalculatedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type GetCartQuery = {
  storeId: string;
  validatePrices?: boolean;
};

export type RecalculateCartInput = {
  storeId: string;
};

export type AddCartItemInput = {
  storeId: string;
  variantId: string;
  quantity: number;
};

export type UpdateCartItemInput = {
  storeId: string;
  itemId: string;
  quantity: number;
};

export type CartItemParams = {
  itemId: string;
};

export type CartStoreQuery = {
  storeId: string;
};

export type CartItemResponse = {
  id: string;
  productId: string;
  variantId: string;
  storeProductId: string;
  quantity: number;
  unitPriceSnapshot: number;
  lineTotal: number;
  productNameSnapshot: string | null;
};

export type CartResponse = {
  id: string;
  storeId: string;
  status: CartStatus;
  currency: string;
  items: CartItemResponse[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  deliveryFeeAmount: number;
  grandTotal: number;
};

export type CartAuditContext = {
  actorId: string;
  requestId?: string | null;
  traceId?: string | null;
};
