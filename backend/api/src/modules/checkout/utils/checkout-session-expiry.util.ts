import type { CheckoutSessionRecord } from '../types/checkout.types';
import { releaseCheckoutLocks } from './checkout-inventory-lock.util';

export const isCheckoutSessionExpired = (session: CheckoutSessionRecord): boolean =>
  session.reservationExpiresAt.getTime() <= Date.now();

export const expireCheckoutSessionRecord = async (
  session: CheckoutSessionRecord & { _id: { toString(): string } },
  actorUserId: string,
): Promise<void> => {
  if (session.lockTokens.length > 0) {
    await releaseCheckoutLocks(session.lockTokens, 'checkout_session_expired', actorUserId);
  }
};
