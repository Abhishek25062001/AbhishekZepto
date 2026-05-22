import { model, Schema } from 'mongoose';
import type { SchemaOptions } from 'mongoose';
import { baseSchemaOptions } from '../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';
import { CART_STATUS, CART_STATUS_VALUES } from '../constants/cart-status.constant';
import type { CartItemRecord, CartRecord } from '../types/cart.types';

const CartItemSchema = new Schema<CartItemRecord>(
  {
    productId: { type: Schema.Types.ObjectId, required: true },
    variantId: { type: Schema.Types.ObjectId, required: true },
    storeProductId: { type: Schema.Types.ObjectId, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPriceSnapshot: { type: Number, required: true, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
    productNameSnapshot: { type: String, default: null, trim: true },
    addedAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { _id: true },
);

const CartSchema = new Schema<CartRecord>(
  {
    customerId: { type: Schema.Types.ObjectId, required: true, index: true },
    storeId: { type: Schema.Types.ObjectId, required: true, index: true },
    status: {
      type: String,
      enum: CART_STATUS_VALUES,
      default: CART_STATUS.ACTIVE,
    },
    items: { type: [CartItemSchema], default: [] },
    subtotal: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    deliveryFeeAmount: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    currency: { type: String, default: 'INR', trim: true },
    lastCalculatedAt: { type: Date, default: null },
  },
  baseSchemaOptions as SchemaOptions<CartRecord>,
);

CartSchema.index(
  { customerId: 1, storeId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: CART_STATUS.ACTIVE },
  },
);

CartSchema.index({ customerId: 1, updatedAt: -1 });

export const CartModel = model<CartRecord>(COLLECTION_NAMES.CARTS, CartSchema);
