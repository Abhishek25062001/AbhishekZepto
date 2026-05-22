import { Types } from 'mongoose';
import { writeAuditLog } from '../../audit';
import { addressNotFoundError } from '../../customer-addresses/utils/customer-address-error.mapper';
import { findAddressByIdForCustomer } from '../../customer-addresses/repositories/customer-address.repository';
import { findSelectedStoreByCustomerId } from '../../customer-addresses/repositories/customer-store-selection.repository';
import { findActiveCartByCustomerAndStore } from '../../cart/repositories/cart.repository';
import { cartNotFoundError } from '../../cart/utils/cart-error.mapper';
import { CHECKOUT_AUDIT_EVENTS } from '../constants/checkout-audit-events.constant';
import { getCheckoutReservationExpiresAt } from '../constants/checkout-reservation-config.constant';
import { CHECKOUT_SESSION_STATUS } from '../constants/checkout-session-status.constant';
import {
  createCheckoutSession,
  findActiveCheckoutSessionByCustomer,
  findCheckoutSessionByIdempotencyKey,
  findCheckoutSessionByIdForCustomer,
  updateCheckoutSessionById,
} from '../repositories/checkout-session.repository';
import type {
  CancelCheckoutInput,
  CheckoutAuditContext,
  CheckoutSessionResponse,
  GetCheckoutSummaryQuery,
  InitiateCheckoutInput,
  InitiateCheckoutResponse,
} from '../types/checkout.types';
import {
  createCheckoutLocksForCart,
  releaseCheckoutLocks,
} from '../utils/checkout-inventory-lock.util';
import {
  checkoutSessionExpiredError,
  checkoutSessionNotFoundError,
} from '../utils/checkout-error.mapper';
import {
  toCheckoutSessionResponse,
  toInitiateCheckoutResponse,
} from '../utils/checkout-response.mapper';
import {
  buildAddressSnapshot,
  buildCheckoutSummarySnapshot,
} from '../utils/checkout-summary.util';
import {
  assertAddressServiceableForStore,
  assertCartPricingCurrentForCheckout,
  assertCartReadyForCheckout,
  assertCartStockAvailableForCheckout,
  assertStoreOpenForCheckout,
} from '../utils/checkout-validation.util';
import { isCheckoutSessionExpired } from '../utils/checkout-session-expiry.util';

const cancelCheckoutSessionInternal = async (
  session: { _id: Types.ObjectId; customerId: Types.ObjectId; lockTokens: string[]; status: string },
  customerId: string,
  actorUserId: string,
  reason?: string,
  audit?: CheckoutAuditContext,
): Promise<void> => {
  if (
    session.status === CHECKOUT_SESSION_STATUS.CANCELLED ||
    session.status === CHECKOUT_SESSION_STATUS.EXPIRED ||
    session.status === CHECKOUT_SESSION_STATUS.COMPLETED
  ) {
    return;
  }

  await releaseCheckoutLocks(
    session.lockTokens,
    reason ?? 'checkout_cancelled',
    actorUserId,
  );

  await updateCheckoutSessionById(session._id.toString(), customerId, {
    status: CHECKOUT_SESSION_STATUS.CANCELLED,
    failureReason: reason ?? null,
    lockTokens: [],
  });

  await writeAuditLog({
    eventType: CHECKOUT_AUDIT_EVENTS.CANCELLED,
    actorId: new Types.ObjectId(actorUserId),
    actorRole: null,
    actorSurface: 'customer_app',
    entityType: 'checkout_session',
    entityId: session._id,
    vendorId: null,
    storeId: null,
    cityId: null,
    requestId: audit?.requestId ?? null,
    traceId: audit?.traceId ?? null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      checkoutSessionId: session._id.toString(),
      reason: reason ?? null,
    },
    status: 'success',
  });
};

export const initiateCheckoutForCustomer = async (
  customerId: string,
  input: InitiateCheckoutInput,
  audit: CheckoutAuditContext,
): Promise<InitiateCheckoutResponse> => {
  if (input.idempotencyKey) {
    const existing = await findCheckoutSessionByIdempotencyKey(
      customerId,
      input.idempotencyKey,
    );

    if (existing) {
      return toInitiateCheckoutResponse(existing);
    }
  }

  const activeSession = await findActiveCheckoutSessionByCustomer(customerId);

  if (activeSession) {
    await cancelCheckoutSessionInternal(
      activeSession,
      customerId,
      audit.actorId,
      'superseded_by_new_initiate',
      audit,
    );
  }

  const address = await findAddressByIdForCustomer(input.addressId, customerId);

  if (!address) {
    throw addressNotFoundError();
  }

  const selectedStore = await findSelectedStoreByCustomerId(customerId);
  const resolvedStoreIdFromInput = input.storeId ?? selectedStore?.storeId.toString();

  if (!resolvedStoreIdFromInput) {
    throw cartNotFoundError();
  }

  const cart = await findActiveCartByCustomerAndStore(
    customerId,
    resolvedStoreIdFromInput,
  );

  if (!cart) {
    throw cartNotFoundError();
  }

  const resolvedStoreId = cart.storeId.toString();

  if (input.storeId && input.storeId !== resolvedStoreId) {
    throw cartNotFoundError();
  }

  assertCartReadyForCheckout(cart);
  await assertStoreOpenForCheckout(resolvedStoreId);
  await assertAddressServiceableForStore(resolvedStoreId, address);
  await assertCartPricingCurrentForCheckout(cart, resolvedStoreId);
  await assertCartStockAvailableForCheckout(cart, resolvedStoreId);

  const reservationExpiresAt = getCheckoutReservationExpiresAt();
  const addressSnapshot = buildAddressSnapshot(address);
  const summarySnapshot = buildCheckoutSummarySnapshot(cart);

  const lockTokens = await createCheckoutLocksForCart({
    cart,
    customerId,
    storeId: resolvedStoreId,
    reservationExpiresAt,
    actorUserId: audit.actorId,
  });

  const session = await createCheckoutSession({
    customerId: new Types.ObjectId(customerId),
    cartId: cart._id,
    storeId: cart.storeId,
    addressId: address._id,
    addressSnapshot,
    status: CHECKOUT_SESSION_STATUS.INITIATED,
    lockTokens,
    reservationExpiresAt,
    summarySnapshot,
    idempotencyKey: input.idempotencyKey ?? null,
    paymentId: null,
    orderId: null,
    failureReason: null,
  });

  await writeAuditLog({
    eventType: CHECKOUT_AUDIT_EVENTS.INITIATED,
    actorId: new Types.ObjectId(audit.actorId),
    actorRole: null,
    actorSurface: 'customer_app',
    entityType: 'checkout_session',
    entityId: session._id,
    vendorId: null,
    storeId: session.storeId,
    cityId: null,
    requestId: audit.requestId,
    traceId: audit.traceId,
    ipAddress: null,
    userAgent: null,
    metadata: {
      checkoutSessionId: session._id.toString(),
      cartId: cart._id.toString(),
      lockTokenCount: lockTokens.length,
      grandTotal: summarySnapshot.grandTotal,
    },
    status: 'success',
  });

  return toInitiateCheckoutResponse(session);
};

const resolveCheckoutSessionForCustomer = async (
  customerId: string,
  checkoutSessionId?: string,
) => {
  const session = checkoutSessionId
    ? await findCheckoutSessionByIdForCustomer(checkoutSessionId, customerId)
    : await findActiveCheckoutSessionByCustomer(customerId);

  if (!session) {
    throw checkoutSessionNotFoundError();
  }

  if (isCheckoutSessionExpired(session)) {
    throw checkoutSessionExpiredError();
  }

  if (session.status !== CHECKOUT_SESSION_STATUS.INITIATED) {
    throw checkoutSessionNotFoundError();
  }

  return session;
};

export const getCheckoutSummaryForCustomer = async (
  customerId: string,
  query: GetCheckoutSummaryQuery,
): Promise<CheckoutSessionResponse> => {
  const session = await resolveCheckoutSessionForCustomer(
    customerId,
    query.checkoutSessionId,
  );

  return toCheckoutSessionResponse(session);
};

export const cancelCheckoutForCustomer = async (
  customerId: string,
  input: CancelCheckoutInput,
  audit: CheckoutAuditContext,
): Promise<CheckoutSessionResponse> => {
  const session = await findCheckoutSessionByIdForCustomer(
    input.checkoutSessionId,
    customerId,
  );

  if (!session) {
    throw checkoutSessionNotFoundError();
  }

  await cancelCheckoutSessionInternal(
    session,
    customerId,
    audit.actorId,
    input.reason,
    audit,
  );

  const updated = await findCheckoutSessionByIdForCustomer(
    input.checkoutSessionId,
    customerId,
  );

  if (!updated) {
    throw checkoutSessionNotFoundError();
  }

  return toCheckoutSessionResponse(updated);
};
