import { model, Schema } from 'mongoose';
import type { SchemaOptions } from 'mongoose';
import { baseSchemaOptions } from '../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';
import {
  CHECKOUT_SESSION_STATUS,
  CHECKOUT_SESSION_STATUS_VALUES,
} from '../constants/checkout-session-status.constant';
import type {
  CheckoutAddressSnapshot,
  CheckoutSessionRecord,
  CheckoutSummarySnapshot,
} from '../types/checkout.types';

const CheckoutAddressSnapshotSchema = new Schema<CheckoutAddressSnapshot>(
  {
    label: { type: String, required: true, trim: true },
    line1: { type: String, required: true, trim: true },
    line2: { type: String, default: null, trim: true },
    landmark: { type: String, default: null, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, default: null, trim: true },
    postalCode: { type: String, default: null, trim: true },
    country: { type: String, required: true, trim: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { _id: false },
);

const CheckoutSummaryItemSchema = new Schema(
  {
    itemId: { type: String, required: true },
    productId: { type: String, required: true },
    variantId: { type: String, required: true },
    storeProductId: { type: String, required: true },
    productName: { type: String, default: null, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const CheckoutSummarySnapshotSchema = new Schema<CheckoutSummarySnapshot>(
  {
    currency: { type: String, required: true, trim: true },
    itemCount: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
    discountAmount: { type: Number, required: true, min: 0 },
    taxAmount: { type: Number, required: true, min: 0 },
    deliveryFeeAmount: { type: Number, required: true, min: 0 },
    grandTotal: { type: Number, required: true, min: 0 },
    items: { type: [CheckoutSummaryItemSchema], default: [] },
  },
  { _id: false },
);

const CheckoutSessionSchema = new Schema<CheckoutSessionRecord>(
  {
    customerId: { type: Schema.Types.ObjectId, required: true, index: true },
    cartId: { type: Schema.Types.ObjectId, required: true },
    storeId: { type: Schema.Types.ObjectId, required: true, index: true },
    addressId: { type: Schema.Types.ObjectId, required: true },
    addressSnapshot: { type: CheckoutAddressSnapshotSchema, required: true },
    status: {
      type: String,
      enum: CHECKOUT_SESSION_STATUS_VALUES,
      default: CHECKOUT_SESSION_STATUS.INITIATED,
    },
    lockTokens: { type: [String], default: [] },
    reservationExpiresAt: { type: Date, required: true },
    summarySnapshot: { type: CheckoutSummarySnapshotSchema, required: true },
    paymentId: { type: Schema.Types.ObjectId, default: null },
    orderId: { type: Schema.Types.ObjectId, default: null },
    idempotencyKey: { type: String, default: null, trim: true },
    failureReason: { type: String, default: null, trim: true },
  },
  baseSchemaOptions as SchemaOptions<CheckoutSessionRecord>,
);

CheckoutSessionSchema.index({ customerId: 1, status: 1 });
CheckoutSessionSchema.index({ reservationExpiresAt: 1 });
CheckoutSessionSchema.index(
  { customerId: 1, idempotencyKey: 1 },
  { unique: true, sparse: true },
);

export const CheckoutSessionModel = model<CheckoutSessionRecord>(
  COLLECTION_NAMES.CHECKOUT_SESSIONS,
  CheckoutSessionSchema,
);
