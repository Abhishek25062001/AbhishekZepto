import { Types } from 'mongoose';
import { writeAuditLog } from '../../audit';
import { setCheckoutSessionPaymentId } from '../../checkout/repositories/checkout-session.repository';
import { PAYMENT_AUDIT_EVENTS } from '../constants/payment-audit-events.constant';
import { PAYMENT_GATEWAY } from '../constants/payment-gateway.constant';
import { PAYMENT_STATUS } from '../constants/payment-status.constant';
import { createRazorpayOrder, getRazorpayPublicKeyId } from '../gateways/razorpay.gateway';
import {
  createPayment,
  findPaymentByIdempotencyKey,
  findPaymentByIdForCustomer,
  updatePaymentById,
} from '../repositories/payment.repository';
import type {
  CreatePaymentOrderInput,
  CreatePaymentOrderResponse,
  PaymentAuditContext,
  VerifyPaymentInput,
  VerifyPaymentResponse,
} from '../types/payment.types';
import { toPaise } from '../utils/payment-amount.util';
import {
  assertPaymentAmountMatchesCheckout,
  loadPayableCheckoutSession,
} from '../utils/payment-checkout-validation.util';
import { compensateFailedPayment } from '../utils/payment-failure-compensation.util';
import {
  paymentAmountMismatchError,
  paymentNotFoundError,
  paymentVerificationFailedError,
} from '../utils/payment-error.mapper';
import {
  toCreatePaymentOrderResponse,
  toVerifyPaymentResponse,
} from '../utils/payment-response.mapper';
import { verifyRazorpayPaymentSignature } from '../utils/razorpay-signature.util';
import { getRazorpayKeySecret } from '../../../config/env';
import { placeOrderFromPayment } from '../../orders/services/order.service';

export const createPaymentOrderForCustomer = async (
  customerId: string,
  input: CreatePaymentOrderInput,
  audit?: PaymentAuditContext,
): Promise<CreatePaymentOrderResponse> => {
  const existing = await findPaymentByIdempotencyKey(customerId, input.idempotencyKey);

  if (existing) {
    return toCreatePaymentOrderResponse(existing, getRazorpayPublicKeyId());
  }

  const session = await loadPayableCheckoutSession(input.checkoutSessionId, customerId);
  const amountPaise = toPaise(session.summarySnapshot.grandTotal);

  const razorpayOrder = await createRazorpayOrder({
    amountPaise,
    currency: session.summarySnapshot.currency,
    receipt: session._id.toString(),
    notes: {
      checkoutSessionId: session._id.toString(),
      customerId,
    },
  });

  if (razorpayOrder.amount !== amountPaise) {
    throw paymentAmountMismatchError();
  }

  assertPaymentAmountMatchesCheckout(amountPaise, session);

  const payment = await createPayment({
    customerId: new Types.ObjectId(customerId),
    checkoutSessionId: new Types.ObjectId(session._id.toString()),
    orderId: null,
    gateway: PAYMENT_GATEWAY.RAZORPAY,
    gatewayOrderId: razorpayOrder.id,
    gatewayPaymentId: null,
    amount: amountPaise,
    currency: razorpayOrder.currency,
    status: PAYMENT_STATUS.CREATED,
    idempotencyKey: input.idempotencyKey,
    signatureVerified: false,
    webhookReceivedAt: null,
    failureCode: null,
    metadata: null,
  });

  await setCheckoutSessionPaymentId(
    session._id.toString(),
    customerId,
    payment._id.toString(),
  );

  await writeAuditLog({
    eventType: PAYMENT_AUDIT_EVENTS.ORDER_CREATED,
    actorId: new Types.ObjectId(customerId),
    actorRole: null,
    actorSurface: 'customer_app',
    entityType: 'payment',
    entityId: payment._id,
    vendorId: null,
    storeId: null,
    cityId: null,
    requestId: audit?.requestId ?? null,
    traceId: audit?.traceId ?? null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      paymentId: payment._id.toString(),
      checkoutSessionId: session._id.toString(),
      gatewayOrderId: payment.gatewayOrderId,
    },
    status: 'success',
  });

  return toCreatePaymentOrderResponse(payment, getRazorpayPublicKeyId());
};

export const verifyPaymentForCustomer = async (
  customerId: string,
  input: VerifyPaymentInput,
  audit?: PaymentAuditContext,
): Promise<VerifyPaymentResponse> => {
  const payment = await findPaymentByIdForCustomer(input.paymentId, customerId);

  if (!payment) {
    throw paymentNotFoundError();
  }

  if (payment.status === PAYMENT_STATUS.PAID && payment.signatureVerified) {
    const placement = await placeOrderFromPayment(customerId, {
      paymentId: payment._id.toString(),
    });
    return toVerifyPaymentResponse(payment, placement.orderId);
  }

  if (payment.gatewayOrderId !== input.razorpayOrderId) {
    throw paymentVerificationFailedError();
  }

  const session = await loadPayableCheckoutSession(
    payment.checkoutSessionId.toString(),
    customerId,
  );

  const signatureValid = verifyRazorpayPaymentSignature({
    orderId: input.razorpayOrderId,
    paymentId: input.razorpayPaymentId,
    signature: input.razorpaySignature,
    secret: getRazorpayKeySecret(),
  });

  if (!signatureValid) {
    await compensateFailedPayment({
      checkoutSession: session,
      payment,
      reason: 'payment_verification_failed',
      actorUserId: customerId,
      failureCode: PAYMENT_STATUS.FAILED,
    });

    await writeAuditLog({
      eventType: PAYMENT_AUDIT_EVENTS.FAILED,
      actorId: new Types.ObjectId(customerId),
      actorRole: null,
      actorSurface: 'customer_app',
      entityType: 'payment',
      entityId: payment._id,
      vendorId: null,
      storeId: null,
      cityId: null,
      requestId: audit?.requestId ?? null,
      traceId: audit?.traceId ?? null,
      ipAddress: null,
      userAgent: null,
      metadata: { paymentId: payment._id.toString(), reason: 'invalid_signature' },
      status: 'failed',
    });

    throw paymentVerificationFailedError();
  }

  const updated = await updatePaymentById(payment._id.toString(), customerId, {
    status: PAYMENT_STATUS.PAID,
    gatewayPaymentId: input.razorpayPaymentId,
    signatureVerified: true,
    failureCode: null,
  });

  if (!updated) {
    throw paymentNotFoundError();
  }

  await writeAuditLog({
    eventType: PAYMENT_AUDIT_EVENTS.VERIFIED,
    actorId: new Types.ObjectId(customerId),
    actorRole: null,
    actorSurface: 'customer_app',
    entityType: 'payment',
    entityId: payment._id,
    vendorId: null,
    storeId: null,
    cityId: null,
    requestId: audit?.requestId ?? null,
    traceId: audit?.traceId ?? null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      paymentId: payment._id.toString(),
      gatewayPaymentId: input.razorpayPaymentId,
    },
    status: 'success',
  });

  const placement = await placeOrderFromPayment(
    customerId,
    { paymentId: updated._id.toString() },
    audit,
  );

  return toVerifyPaymentResponse(updated, placement.orderId);
};
