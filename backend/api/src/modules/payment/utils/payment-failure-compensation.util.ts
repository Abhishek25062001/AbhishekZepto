import { CHECKOUT_SESSION_STATUS } from '../../checkout/constants/checkout-session-status.constant';
import { updateCheckoutSessionById } from '../../checkout/repositories/checkout-session.repository';
import type { CheckoutSessionRecord } from '../../checkout/types/checkout.types';
import { releaseCheckoutLocks } from '../../checkout/utils/checkout-inventory-lock.util';
import { PAYMENT_STATUS } from '../constants/payment-status.constant';
import { updatePaymentById } from '../repositories/payment.repository';
import type { PaymentRecord } from '../types/payment.types';

export const compensateFailedPayment = async (input: {
  checkoutSession: CheckoutSessionRecord & { _id: { toString(): string } };
  payment: PaymentRecord & { _id: { toString(): string } };
  reason: string;
  actorUserId: string;
  failureCode?: string;
}): Promise<void> => {
  const customerId = input.checkoutSession.customerId.toString();

  if (input.checkoutSession.lockTokens.length > 0) {
    await releaseCheckoutLocks(
      input.checkoutSession.lockTokens,
      input.reason,
      input.actorUserId,
    );
  }

  if (input.payment.status !== PAYMENT_STATUS.FAILED) {
    await updatePaymentById(input.payment._id.toString(), customerId, {
      status: PAYMENT_STATUS.FAILED,
      failureCode: input.failureCode ?? 'verification_failed',
    });
  }

  if (input.checkoutSession.status !== CHECKOUT_SESSION_STATUS.FAILED) {
    await updateCheckoutSessionById(input.checkoutSession._id.toString(), customerId, {
      status: CHECKOUT_SESSION_STATUS.FAILED,
      failureReason: input.reason,
      lockTokens: [],
    });
  }
};
