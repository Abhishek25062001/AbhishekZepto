import { env } from '../../../config/env';

const DEFAULT_CHECKOUT_RESERVATION_TTL_SECONDS = 900;

export const getCheckoutReservationTtlSeconds = (): number =>
  env.CHECKOUT_RESERVATION_TTL_SECONDS ?? DEFAULT_CHECKOUT_RESERVATION_TTL_SECONDS;

export const getCheckoutReservationExpiresAt = (fromDate: Date = new Date()): Date =>
  new Date(fromDate.getTime() + getCheckoutReservationTtlSeconds() * 1000);
