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
    gateway: {
      type: String,
      enum: PAYMENT_GATEWAY_VALUES,
      default: PAYMENT_GATEWAY.RAZORPAY,
    },
    gatewayOrderId: { type: String, required: true, trim: true },
    gatewayPaymentId: { type: String, default: null, trim: true },
    amount: { type: Number, required: true, min: 1 },
    currency: { type: String, required: true, trim: true, default: 'INR' },
    status: {
      type: String,
      enum: PAYMENT_STATUS_VALUES,
      default: PAYMENT_STATUS.CREATED,
    },
    idempotencyKey: { type: String, required: true, trim: true },
    signatureVerified: { type: Boolean, default: false },
    webhookReceivedAt: { type: Date, default: null },
    failureCode: { type: String, default: null, trim: true },
    metadata: { type: Schema.Types.Mixed, default: null },
  },
  baseSchemaOptions as SchemaOptions<PaymentRecord>,
);

PaymentSchema.index({ gatewayOrderId: 1 }, { unique: true });
PaymentSchema.index({ idempotencyKey: 1 }, { unique: true, sparse: true });
PaymentSchema.index({ checkoutSessionId: 1 });

export const PaymentModel = model<PaymentRecord>(COLLECTION_NAMES.PAYMENTS, PaymentSchema);
