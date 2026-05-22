import { Types } from 'mongoose';
import { CHECKOUT_SESSION_STATUS } from '../constants/checkout-session-status.constant';
import { CheckoutSessionModel } from '../models/checkout-session.model';
import type { CheckoutSessionRecord } from '../types/checkout.types';

export const findActiveCheckoutSessionByCustomer = async (
  customerId: string,
): Promise<(CheckoutSessionRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(customerId)) {
    return null;
  }

  const now = new Date();

  return CheckoutSessionModel.findOne({
    customerId: new Types.ObjectId(customerId),
    status: CHECKOUT_SESSION_STATUS.INITIATED,
    reservationExpiresAt: { $gt: now },
  })
    .sort({ createdAt: -1 })
    .lean();
};

export const findCheckoutSessionByIdForCustomer = async (
  sessionId: string,
  customerId: string,
): Promise<(CheckoutSessionRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(sessionId) || !Types.ObjectId.isValid(customerId)) {
    return null;
  }

  return CheckoutSessionModel.findOne({
    _id: new Types.ObjectId(sessionId),
    customerId: new Types.ObjectId(customerId),
  }).lean();
};

export const findCheckoutSessionByIdempotencyKey = async (
  customerId: string,
  idempotencyKey: string,
): Promise<(CheckoutSessionRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(customerId) || !idempotencyKey) {
    return null;
  }

  const now = new Date();

  return CheckoutSessionModel.findOne({
    customerId: new Types.ObjectId(customerId),
    idempotencyKey,
    status: CHECKOUT_SESSION_STATUS.INITIATED,
    reservationExpiresAt: { $gt: now },
  }).lean();
};

export const createCheckoutSession = async (
  payload: Partial<CheckoutSessionRecord>,
): Promise<CheckoutSessionRecord & { _id: Types.ObjectId }> => {
  const created = await CheckoutSessionModel.create(payload);
  return created.toObject() as CheckoutSessionRecord & { _id: Types.ObjectId };
};

export const updateCheckoutSessionById = async (
  sessionId: string,
  customerId: string,
  payload: Partial<CheckoutSessionRecord>,
): Promise<(CheckoutSessionRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(sessionId) || !Types.ObjectId.isValid(customerId)) {
    return null;
  }

  return CheckoutSessionModel.findOneAndUpdate(
    {
      _id: new Types.ObjectId(sessionId),
      customerId: new Types.ObjectId(customerId),
    },
    { $set: payload },
    { new: true },
  ).lean();
};

export const setCheckoutSessionPaymentId = async (
  sessionId: string,
  customerId: string,
  paymentId: string,
): Promise<(CheckoutSessionRecord & { _id: Types.ObjectId }) | null> => {
  if (
    !Types.ObjectId.isValid(sessionId) ||
    !Types.ObjectId.isValid(customerId) ||
    !Types.ObjectId.isValid(paymentId)
  ) {
    return null;
  }

  return updateCheckoutSessionById(sessionId, customerId, {
    paymentId: new Types.ObjectId(paymentId),
  });
};

export const findExpiredInitiatedSessions = async (
  limit = 100,
): Promise<(CheckoutSessionRecord & { _id: Types.ObjectId })[]> => {
  const now = new Date();

  return CheckoutSessionModel.find({
    status: CHECKOUT_SESSION_STATUS.INITIATED,
    reservationExpiresAt: { $lte: now },
  })
    .limit(limit)
    .lean();
};
