import { Types } from 'mongoose';
import { writeAuditLog } from '../../audit';
import { findCheckoutSessionByIdForCustomer } from '../../checkout/repositories/checkout-session.repository';
import { PAYMENT_AUDIT_EVENTS } from '../constants/payment-audit-events.constant';
import { PAYMENT_STATUS } from '../constants/payment-status.constant';
import {
  findPaymentByGatewayOrderId,
  updatePaymentByGatewayOrderId,
} from '../repositories/payment.repository';
import { placeOrderFromPayment } from '../../orders/services/order.service';
import { compensateFailedPayment } from '../utils/payment-failure-compensation.util';

type RazorpayWebhookPayload = {
  payment?: {
    entity?: {
      id?: string;
      order_id?: string;
    };
  };
};

type RazorpayWebhookEvent = {
  event: string;
  payload?: RazorpayWebhookPayload;
};

export const handleRazorpayWebhookEvent = async (event: RazorpayWebhookEvent): Promise<void> => {
  const orderId = event.payload?.payment?.entity?.order_id;
  const paymentId = event.payload?.payment?.entity?.id;

  if (!orderId) {
    return;
  }

  const payment = await findPaymentByGatewayOrderId(orderId);

  if (!payment) {
    return;
  }

  const customerId = payment.customerId.toString();
  const session = await findCheckoutSessionByIdForCustomer(
    payment.checkoutSessionId.toString(),
    customerId,
  );

  if (!session) {
    return;
  }

  await writeAuditLog({
    eventType: PAYMENT_AUDIT_EVENTS.WEBHOOK_RECEIVED,
    actorId: new Types.ObjectId(customerId),
    actorRole: null,
    actorSurface: 'backend',
    entityType: 'payment',
    entityId: payment._id,
    vendorId: null,
    storeId: null,
    cityId: null,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: { event: event.event, gatewayOrderId: orderId },
    status: 'success',
  });

  if (event.event === 'payment.captured') {
    if (payment.status === PAYMENT_STATUS.PAID && payment.signatureVerified && payment.orderId) {
      return;
    }

    if (payment.status !== PAYMENT_STATUS.PAID || !payment.signatureVerified) {
      await updatePaymentByGatewayOrderId(orderId, {
        status: PAYMENT_STATUS.PAID,
        gatewayPaymentId: paymentId ?? payment.gatewayPaymentId,
        signatureVerified: true,
        webhookReceivedAt: new Date(),
        failureCode: null,
      });
    }

    try {
      await placeOrderFromPayment(customerId, {
        paymentId: payment._id.toString(),
      });
    } catch {
      // Webhook acknowledges receipt; placement may be retried via POST /orders
    }

    return;
  }

  if (event.event === 'payment.failed') {
    if (payment.status === PAYMENT_STATUS.FAILED) {
      return;
    }

    await compensateFailedPayment({
      checkoutSession: session,
      payment,
      reason: 'payment_webhook_failed',
      actorUserId: customerId,
      failureCode: 'webhook_failed',
    });

    await updatePaymentByGatewayOrderId(orderId, {
      webhookReceivedAt: new Date(),
    });
  }
};
