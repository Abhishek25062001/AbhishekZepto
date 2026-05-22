import { CHECKOUT_SESSION_STATUS } from '../../checkout/constants/checkout-session-status.constant';
import { findCheckoutSessionByIdForCustomer } from '../../checkout/repositories/checkout-session.repository';
import {
  checkoutSessionExpiredError,
  checkoutSessionNotFoundError,
} from '../../checkout/utils/checkout-error.mapper';
import { isCheckoutSessionExpired } from '../../checkout/utils/checkout-session-expiry.util';
import type { CheckoutSessionRecord } from '../../checkout/types/checkout.types';
import { paymentAmountMismatchError } from './payment-error.mapper';
import { toPaise } from './payment-amount.util';

export const loadPayableCheckoutSession = async (
  checkoutSessionId: string,
  customerId: string,
): Promise<CheckoutSessionRecord & { _id: { toString(): string } }> => {
  const session = await findCheckoutSessionByIdForCustomer(checkoutSessionId, customerId);

  if (!session) {
    throw checkoutSessionNotFoundError();
  }

  if (session.status !== CHECKOUT_SESSION_STATUS.INITIATED) {
    throw checkoutSessionNotFoundError();
  }

  if (isCheckoutSessionExpired(session)) {
    throw checkoutSessionExpiredError();
  }

  return session;
};

export const assertPaymentAmountMatchesCheckout = (
  amountPaise: number,
  session: CheckoutSessionRecord,
): void => {
  const expectedPaise = toPaise(session.summarySnapshot.grandTotal);

  if (amountPaise !== expectedPaise) {
    throw paymentAmountMismatchError();
  }
};
