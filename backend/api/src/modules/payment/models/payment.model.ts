import { model, Schema } from 'mongoose';
import type { SchemaOptions } from 'mongoose';
import { baseSchemaOptions } from '../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';
import { PAYMENT_GATEWAY, PAYMENT_GATEWAY_VALUES } from '../constants/payment-gateway.constant';
import { PAYMENT_STATUS, PAYMENT_STATUS_VALUES } from '../constants/payment-status.constant';
import type { PaymentRecord } from '../types/payment.types';

const PaymentSchema = new Schema<PaymentRecord>(
  {
    customerId: { type: Schema.Types.ObjectId, required: true, index: true },
    checkoutSessionId: { type: Schema.Types.ObjectId, required: true },
    orderId: { type: Schema.Types.ObjectId, default: null },
    storeId: { type: Schema.Types.ObjectId, default: null, index: true },
    vendorId: { type: Schema.Types.ObjectId, default: null, index: true },
    cityId: { type: Schema.Types.ObjectId, default: null, index: true },
    gateway: {
      type: String,
      enum: PAYMENT_GATEWAY_VALUES,
      default: PAYMENT_GATEWAY.RAZORPAY,
    },
    gatewayOrderId: { type: String, required: true, trim: true },
    gatewayPaymentId: { type: String, default: null, trim: true },
    gatewayStatus: { type: String, default: null, trim: true },
    paymentMethod: { type: String, default: null, trim: true },
    amount: { type: Number, required: true, min: 1 },
    payableAmount: { type: Number, default: null, min: 0 },
    currency: { type: String, required: true, trim: true, default: 'INR' },
    refundedAmount: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: PAYMENT_STATUS_VALUES,
      default: PAYMENT_STATUS.CREATED,
    },
    idempotencyKey: { type: String, required: true, trim: true },
    signatureVerified: { type: Boolean, default: false },
    webhookReceivedAt: { type: Date, default: null },
    webhookEventIds: { type: [String], default: [] },
    failureCode: { type: String, default: null, trim: true },
    paidAt: { type: Date, default: null },
    failedAt: { type: Date, default: null },
    metadata: { type: Schema.Types.Mixed, default: null },
  },
  baseSchemaOptions as SchemaOptions<PaymentRecord>,
);

PaymentSchema.index({ gatewayOrderId: 1 }, { unique: true });
PaymentSchema.index({ idempotencyKey: 1 }, { unique: true, sparse: true });
PaymentSchema.index({ customerId: 1, createdAt: -1 });
PaymentSchema.index({ status: 1, createdAt: -1 });
PaymentSchema.index({ gatewayPaymentId: 1 }, { unique: true, sparse: true });

export const PaymentModel = model<PaymentRecord>(COLLECTION_NAMES.PAYMENTS, PaymentSchema);
