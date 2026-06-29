import { Types } from 'mongoose';
import { writeAuditLog } from '../../audit';
import { setCheckoutSessionPaymentId } from '../../checkout/repositories/checkout-session.repository';
import { PAYMENT_AUDIT_EVENTS } from '../constants/payment-audit-events.constant';
import { PAYMENT_GATEWAY } from '../constants/payment-gateway.constant';
import { PAYMENT_STATUS } from '../constants/payment-status.constant';
import { createRazorpayOrder, getRazorpayPublicKeyId } from '../gateways/razorpay.gateway';
import {
  createPayment,
  findPaymentById,
  findPaymentByIdempotencyKey,
  findPaymentByIdForCustomer,
  listPaymentRecords,
  updatePaymentById,
} from '../repositories/payment.repository';
import type {
  AdminPaymentActor,
  AdminPaymentResponse,
  CreatePaymentOrderInput,
  CreatePaymentOrderResponse,
  CustomerPaymentResponse,
  PaymentAuditContext,
  PaymentListQuery,
  VerifyPaymentByIdBody,
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
  paymentAdminScopeInvalidError,
  paymentCustomerScopeInvalidError,
  paymentNotFoundError,
  paymentRecordNotFoundError,
  paymentVerificationFailedError,
} from '../utils/payment-error.mapper';
import {
  toAdminPaymentResponse,
  toCreatePaymentOrderResponse,
  toCustomerPaymentResponse,
  toVerifyPaymentResponse,
} from '../utils/payment-response.mapper';
import { verifyRazorpayPaymentSignature } from '../utils/razorpay-signature.util';
import { getRazorpayKeySecret } from '../../../config/env';
import { placeOrderFromPayment } from '../../orders/services/order.service';
import { markOrderPaymentPaid } from './order-payment-sync.service';
import { WILDCARD_PERMISSION } from '../../auth/constants/auth-permission.constants';
import { postPaymentReceived } from '../../finance/ledger/services/ledger-posting.service';
import { updatePaymentLedgerMetadata } from '../repositories/payment.repository';

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
    storeId: session.storeId ?? null,
    vendorId: null,
    cityId: null,
    gateway: PAYMENT_GATEWAY.RAZORPAY,
    gatewayOrderId: razorpayOrder.id,
    gatewayPaymentId: null,
    amount: amountPaise,
    payableAmount: amountPaise,
    currency: razorpayOrder.currency,
    refundedAmount: 0,
    webhookEventIds: [],
    status: PAYMENT_STATUS.CREATED,
    idempotencyKey: input.idempotencyKey,
    signatureVerified: false,
    webhookReceivedAt: null,
    failureCode: null,
    paidAt: null,
    failedAt: null,
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
    paidAt: new Date(),
    failedAt: null,
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

  if (placement.orderId) {
    await markOrderPaymentPaid({
      orderId: placement.orderId,
      paymentId: updated._id.toString(),
      paymentGateway: updated.gateway,
      payableAmount: updated.payableAmount ?? updated.amount,
    });
  }

  const ledgerPosting = await postPaymentReceived({
    paymentId: updated._id.toString(),
    actorId: customerId,
    audit,
  });

  if (ledgerPosting.success && ledgerPosting.journalId) {
    await updatePaymentLedgerMetadata(updated._id.toString(), ledgerPosting.journalId);
  }

  return toVerifyPaymentResponse(updated, placement.orderId);
};

const assertAdminPaymentScope = (
  payment: { storeId?: Types.ObjectId | null; cityId?: Types.ObjectId | null },
  actor: AdminPaymentActor,
): void => {
  if (actor.permissions.includes(WILDCARD_PERMISSION)) {
    return;
  }

  if (actor.cityId && payment.cityId && actor.cityId !== payment.cityId.toString()) {
    throw paymentAdminScopeInvalidError();
  }

  if (actor.storeId && payment.storeId && actor.storeId !== payment.storeId.toString()) {
    throw paymentAdminScopeInvalidError();
  }
};

const applyAdminScopeToQuery = (
  query: PaymentListQuery,
  actor: AdminPaymentActor,
): PaymentListQuery => {
  if (actor.permissions.includes(WILDCARD_PERMISSION)) {
    return query;
  }

  return {
    ...query,
    cityId: actor.cityId ?? query.cityId,
    storeId: actor.storeId ?? query.storeId,
  };
};

export const getCustomerPaymentById = async (
  customerId: string,
  paymentId: string,
): Promise<CustomerPaymentResponse> => {
  const payment = await findPaymentByIdForCustomer(paymentId, customerId);

  if (!payment) {
    const exists = await findPaymentById(paymentId);
    if (exists) {
      throw paymentCustomerScopeInvalidError();
    }
    throw paymentRecordNotFoundError();
  }

  return toCustomerPaymentResponse(payment);
};

export const verifyPaymentByIdForCustomer = async (
  customerId: string,
  paymentId: string,
  body: VerifyPaymentByIdBody,
  audit?: PaymentAuditContext,
): Promise<VerifyPaymentResponse> => {
  return verifyPaymentForCustomer(
    customerId,
    {
      paymentId,
      razorpayOrderId: body.gatewayOrderId ?? body.razorpayOrderId ?? '',
      razorpayPaymentId: body.gatewayPaymentId ?? body.razorpayPaymentId ?? '',
      razorpaySignature: body.gatewaySignature ?? body.razorpaySignature ?? '',
    },
    audit,
  );
};

export const listAdminPayments = async (
  query: PaymentListQuery,
  actor: AdminPaymentActor,
): Promise<{
  payments: AdminPaymentResponse[];
  total: number;
  page: number;
  limit: number;
}> => {
  const scopedQuery = applyAdminScopeToQuery(query, actor);
  const result = await listPaymentRecords(scopedQuery);

  return {
    payments: result.payments.map(toAdminPaymentResponse),
    total: result.total,
    page: result.page,
    limit: result.limit,
  };
};

export const getAdminPaymentById = async (
  paymentId: string,
  actor: AdminPaymentActor,
): Promise<AdminPaymentResponse> => {
  const payment = await findPaymentById(paymentId);

  if (!payment) {
    throw paymentRecordNotFoundError();
  }

  assertAdminPaymentScope(payment, actor);

  return toAdminPaymentResponse(payment);
};
