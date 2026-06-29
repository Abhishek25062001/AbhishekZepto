import { Types } from 'mongoose';
import { writeAuditLog } from '../../audit';
import { findCheckoutSessionByIdForCustomer } from '../../checkout/repositories/checkout-session.repository';
import { PAYMENT_AUDIT_EVENTS } from '../constants/payment-audit-events.constant';
import { PAYMENT_STATUS } from '../constants/payment-status.constant';
import {
  appendWebhookEventId,
  findPaymentByGatewayOrderId,
  hasWebhookEventId,
  updatePaymentByGatewayOrderId,
} from '../repositories/payment.repository';
import { placeOrderFromPayment } from '../../orders/services/order.service';
import { compensateFailedPayment } from '../utils/payment-failure-compensation.util';
import { markOrderPaymentFailed, markOrderPaymentPaid } from './order-payment-sync.service';
import { postPaymentReceived } from '../../finance/ledger/services/ledger-posting.service';
import { updatePaymentLedgerMetadata } from '../repositories/payment.repository';

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
  id?: string;
};

const resolveWebhookEventId = (event: RazorpayWebhookEvent): string => {
  const paymentEntityId = event.payload?.payment?.entity?.id;
  return event.id ?? `${event.event}:${paymentEntityId ?? event.payload?.payment?.entity?.order_id ?? 'unknown'}`;
};

export const handleRazorpayWebhookEvent = async (event: RazorpayWebhookEvent): Promise<void> => {
  const orderId = event.payload?.payment?.entity?.order_id;
  const paymentId = event.payload?.payment?.entity?.id;
  const eventId = resolveWebhookEventId(event);

  if (!orderId) {
    return;
  }

  const payment = await findPaymentByGatewayOrderId(orderId);

  if (!payment) {
    return;
  }

  if (await hasWebhookEventId(payment._id.toString(), eventId)) {
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
    storeId: payment.storeId,
    cityId: payment.cityId,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: { event: event.event, gatewayOrderId: orderId, eventId },
    status: 'success',
  });

  if (event.event === 'payment.captured') {
    if (payment.status === PAYMENT_STATUS.PAID && payment.signatureVerified && payment.orderId) {
      await appendWebhookEventId(payment._id.toString(), eventId);
      return;
    }

    if (payment.status !== PAYMENT_STATUS.PAID || !payment.signatureVerified) {
      await updatePaymentByGatewayOrderId(orderId, {
        status: PAYMENT_STATUS.PAID,
        gatewayPaymentId: paymentId ?? payment.gatewayPaymentId,
        signatureVerified: true,
        webhookReceivedAt: new Date(),
        failureCode: null,
        paidAt: new Date(),
        failedAt: null,
      });
    }

    try {
      const placement = await placeOrderFromPayment(customerId, {
        paymentId: payment._id.toString(),
      });

      if (placement.orderId) {
        await markOrderPaymentPaid({
          orderId: placement.orderId,
          paymentId: payment._id.toString(),
          paymentGateway: payment.gateway,
          payableAmount: payment.payableAmount ?? payment.amount,
        });
      }

      const metadata = payment.metadata;
      const existingLedgerJournalId =
        metadata &&
        typeof metadata === 'object' &&
        !Array.isArray(metadata) &&
        typeof metadata.ledgerJournalId === 'string'
          ? metadata.ledgerJournalId
          : null;

      if (!existingLedgerJournalId) {
        const ledgerPosting = await postPaymentReceived({
          paymentId: payment._id.toString(),
          actorId: customerId,
        });

        if (ledgerPosting.success && ledgerPosting.journalId) {
          await updatePaymentLedgerMetadata(payment._id.toString(), ledgerPosting.journalId);
        }
      }
    } catch {
      // Webhook acknowledges receipt; placement may be retried via POST /orders
    }

    await appendWebhookEventId(payment._id.toString(), eventId);
    return;
  }

  if (event.event === 'payment.failed') {
    if (payment.status === PAYMENT_STATUS.FAILED) {
      await appendWebhookEventId(payment._id.toString(), eventId);
      return;
    }

    await compensateFailedPayment({
      checkoutSession: session,
      payment,
      reason: 'payment_webhook_failed',
      actorUserId: customerId,
      failureCode: PAYMENT_STATUS.FAILED,
    });

    await updatePaymentByGatewayOrderId(orderId, {
      webhookReceivedAt: new Date(),
      failedAt: new Date(),
    });

    if (payment.orderId) {
      await markOrderPaymentFailed(payment.orderId.toString());
    }

    await appendWebhookEventId(payment._id.toString(), eventId);
  }
};
