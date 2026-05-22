import type { Types } from 'mongoose';
import type { CheckoutSessionStatus } from '../constants/checkout-session-status.constant';

export type CheckoutAddressSnapshot = {
  label: string;
  line1: string;
  line2: string | null;
  landmark: string | null;
  city: string;
  state: string | null;
  postalCode: string | null;
  country: string;
  latitude: number;
  longitude: number;
};

export type CheckoutSummaryItemSnapshot = {
  itemId: string;
  productId: string;
  variantId: string;
  storeProductId: string;
  productName: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type CheckoutSummarySnapshot = {
  currency: string;
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  deliveryFeeAmount: number;
  grandTotal: number;
  items: CheckoutSummaryItemSnapshot[];
};

export type CheckoutSessionRecord = {
  customerId: Types.ObjectId;
  cartId: Types.ObjectId;
  storeId: Types.ObjectId;
  addressId: Types.ObjectId;
  addressSnapshot: CheckoutAddressSnapshot;
  status: CheckoutSessionStatus;
  lockTokens: string[];
  reservationExpiresAt: Date;
  summarySnapshot: CheckoutSummarySnapshot;
  paymentId: Types.ObjectId | null;
  orderId: Types.ObjectId | null;
  idempotencyKey: string | null;
  failureReason: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type InitiateCheckoutInput = {
  addressId: string;
  storeId?: string;
  idempotencyKey?: string;
};

export type CancelCheckoutInput = {
  checkoutSessionId: string;
  reason?: string;
};

export type GetCheckoutSummaryQuery = {
  checkoutSessionId?: string;
};

export type CheckoutSummaryResponse = CheckoutSummarySnapshot;

export type InitiateCheckoutResponse = {
  checkoutSessionId: string;
  reservationExpiresAt: string;
  lockTokens: string[];
  summary: CheckoutSummaryResponse;
};

export type CheckoutSessionResponse = {
  checkoutSessionId: string;
  status: CheckoutSessionStatus;
  reservationExpiresAt: string;
  storeId: string;
  addressId: string;
  lockTokens: string[];
  summary: CheckoutSummaryResponse;
};

export type CheckoutAuditContext = {
  actorId: string;
  requestId: string | null;
  traceId: string | null;
};
