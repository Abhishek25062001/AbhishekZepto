import type { CheckoutSessionRecord } from '../types/checkout.types';
import type {
  CheckoutSessionResponse,
  CheckoutSummaryResponse,
  InitiateCheckoutResponse,
} from '../types/checkout.types';

export const toCheckoutSummaryResponse = (
  summary: CheckoutSessionRecord['summarySnapshot'],
): CheckoutSummaryResponse => summary;

export const toCheckoutSessionResponse = (
  session: CheckoutSessionRecord & { _id: { toString(): string } },
): CheckoutSessionResponse => ({
  checkoutSessionId: session._id.toString(),
  status: session.status,
  reservationExpiresAt: session.reservationExpiresAt.toISOString(),
  storeId: session.storeId.toString(),
  addressId: session.addressId.toString(),
  lockTokens: session.lockTokens,
  summary: toCheckoutSummaryResponse(session.summarySnapshot),
});

export const toInitiateCheckoutResponse = (
  session: CheckoutSessionRecord & { _id: { toString(): string } },
): InitiateCheckoutResponse => ({
  checkoutSessionId: session._id.toString(),
  reservationExpiresAt: session.reservationExpiresAt.toISOString(),
  lockTokens: session.lockTokens,
  summary: toCheckoutSummaryResponse(session.summarySnapshot),
});
