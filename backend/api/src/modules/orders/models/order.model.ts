import { model, Schema } from 'mongoose';
import type { SchemaOptions } from 'mongoose';
import { baseSchemaOptions } from '../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';
import { ORDER_PAYMENT_STATUS, ORDER_PAYMENT_STATUS_VALUES } from '../constants/order-payment-status.constant';
import { ORDER_ITEM_PICKING_STATUS, ORDER_ITEM_PICKING_STATUS_VALUES } from '../constants/order-item-picking-status.constant';
import { ORDER_PACKING_STATUS_VALUES } from '../constants/order-packing-status.constant';
import { ORDER_PICKER_STATUS_VALUES } from '../constants/order-picker-status.constant';
import { ORDER_SLA_STAGE_VALUES, ORDER_SLA_STATUS, ORDER_SLA_STATUS_VALUES } from '../constants/order-sla.constant';
import { ORDER_STATUS, ORDER_STATUS_VALUES } from '../constants/order-status.constant';
import { ORDER_STORE_STATUS, ORDER_STORE_STATUS_VALUES } from '../constants/order-store-status.constant';
import type { OrderLineItem, OrderRecord, OrderTimelineEvent } from '../types/order.types';

const OrderAddressSnapshotSchema = new Schema(
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

const OrderLineItemSchema = new Schema<OrderLineItem>(
  {
    productId: { type: Schema.Types.ObjectId, required: true },
    variantId: { type: Schema.Types.ObjectId, required: true },
    storeProductId: { type: Schema.Types.ObjectId, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
    productName: { type: String, default: null, trim: true },
    pickedQuantity: { type: Number, default: 0, min: 0 },
    missingQuantity: { type: Number, default: 0, min: 0 },
    pickingStatus: {
      type: String,
      enum: ORDER_ITEM_PICKING_STATUS_VALUES,
      default: ORDER_ITEM_PICKING_STATUS.PENDING,
    },
  },
  { _id: false },
);

const OrderTimelineEventSchema = new Schema<OrderTimelineEvent>(
  {
    event: { type: String, required: true, trim: true },
    fromStatus: { type: String, enum: ORDER_STATUS_VALUES, default: null },
    toStatus: { type: String, enum: ORDER_STATUS_VALUES, default: null },
    itemId: { type: String, default: null, trim: true },
    quantity: { type: Number, default: null, min: 0 },
    actorId: { type: Schema.Types.ObjectId, default: null },
    actorType: {
      type: String,
      enum: ['customer', 'store', 'admin', 'system'],
      required: true,
    },
    actorRole: { type: String, default: null, trim: true },
    reason: { type: String, default: null, trim: true },
    createdAt: { type: Date, required: true },
  },
  { _id: false },
);

const OrderCancellationActorSchema = new Schema(
  {
    actorId: { type: Schema.Types.ObjectId, default: null },
    actorType: {
      type: String,
      enum: ['customer', 'store', 'admin', 'system'],
      required: true,
    },
    actorRole: { type: String, default: null, trim: true },
  },
  { _id: false },
);

const OrderSchema = new Schema<OrderRecord>(
  {
    orderNumber: { type: String, required: true, trim: true },
    customerId: { type: Schema.Types.ObjectId, required: true, index: true },
    storeId: { type: Schema.Types.ObjectId, required: true, index: true },
    checkoutSessionId: { type: Schema.Types.ObjectId, required: true },
    paymentId: { type: Schema.Types.ObjectId, required: true },
    cartId: { type: Schema.Types.ObjectId, required: true },
    addressSnapshot: { type: OrderAddressSnapshotSchema, required: true },
    items: { type: [OrderLineItemSchema], default: [] },
    subtotal: { type: Number, required: true, min: 0 },
    taxAmount: { type: Number, default: 0, min: 0 },
    deliveryFeeAmount: { type: Number, default: 0, min: 0 },
    discountAmount: { type: Number, default: 0, min: 0 },
    grandTotal: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, trim: true, default: 'INR' },
    paymentStatus: {
      type: String,
      enum: ORDER_PAYMENT_STATUS_VALUES,
      default: ORDER_PAYMENT_STATUS.PAID,
    },
    orderStatus: {
      type: String,
      enum: ORDER_STATUS_VALUES,
      default: ORDER_STATUS.PLACED,
    },
    storeStatus: {
      type: String,
      enum: ORDER_STORE_STATUS_VALUES,
      default: ORDER_STORE_STATUS.PENDING_ACCEPTANCE,
    },
    pickerStatus: {
      type: String,
      enum: ORDER_PICKER_STATUS_VALUES,
      default: null,
    },
    packingStatus: {
      type: String,
      enum: ORDER_PACKING_STATUS_VALUES,
      default: null,
    },
    assignedPickerId: { type: Schema.Types.ObjectId, default: null },
    readyForPickupAt: { type: Date, default: null },
    acceptedAt: { type: Date, default: null },
    rejectedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: null, trim: true },
    cancellationReason: { type: String, default: null, trim: true },
    cancelledAt: { type: Date, default: null },
    cancelledBy: { type: OrderCancellationActorSchema, default: null },
    refundReviewRequired: { type: Boolean, default: false },
    slaStatus: {
      type: String,
      enum: ORDER_SLA_STATUS_VALUES,
      default: ORDER_SLA_STATUS.ON_TRACK,
    },
    slaBreachedStage: {
      type: String,
      enum: ORDER_SLA_STAGE_VALUES,
      default: null,
    },
    timeline: { type: [OrderTimelineEventSchema], default: [] },
    inventoryConfirmed: { type: Boolean, default: false },
    placedAt: { type: Date, required: true },
  },
  baseSchemaOptions as SchemaOptions<OrderRecord>,
);

OrderSchema.index({ orderNumber: 1 }, { unique: true });
OrderSchema.index({ customerId: 1, placedAt: -1 });
OrderSchema.index({ storeId: 1, storeStatus: 1, placedAt: -1 });
OrderSchema.index({ storeId: 1, pickerStatus: 1, placedAt: -1 });
OrderSchema.index({ storeId: 1, packingStatus: 1, placedAt: -1 });
OrderSchema.index({ slaStatus: 1, slaBreachedStage: 1 });
OrderSchema.index({ storeId: 1, slaStatus: 1, createdAt: -1 });
OrderSchema.index({ paymentId: 1 }, { unique: true });

export const OrderModel = model<OrderRecord>(COLLECTION_NAMES.ORDERS, OrderSchema);
