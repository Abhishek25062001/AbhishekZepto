import { Types } from 'mongoose';
import { PAYMENT_STATUS } from '../constants/payment-status.constant';
import { PaymentModel } from '../models/payment.model';
import type { PaymentRecord } from '../types/payment.types';

export const findPaymentByIdForCustomer = async (
  paymentId: string,
  customerId: string,
): Promise<(PaymentRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(paymentId) || !Types.ObjectId.isValid(customerId)) {
    return null;
  }

  return PaymentModel.findOne({
    _id: new Types.ObjectId(paymentId),
    customerId: new Types.ObjectId(customerId),
  }).lean();
};

export const findPaymentByIdempotencyKey = async (
  customerId: string,
  idempotencyKey: string,
): Promise<(PaymentRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(customerId) || !idempotencyKey) {
    return null;
  }

  return PaymentModel.findOne({
    customerId: new Types.ObjectId(customerId),
    idempotencyKey,
    status: { $ne: PAYMENT_STATUS.FAILED },
  }).lean();
};

export const findPaymentByGatewayOrderId = async (
  gatewayOrderId: string,
): Promise<(PaymentRecord & { _id: Types.ObjectId }) | null> => {
  if (!gatewayOrderId) {
    return null;
  }

  return PaymentModel.findOne({ gatewayOrderId }).lean();
};

export const createPayment = async (
  payload: Partial<PaymentRecord>,
): Promise<PaymentRecord & { _id: Types.ObjectId }> => {
  const created = await PaymentModel.create(payload);
  return created.toObject() as PaymentRecord & { _id: Types.ObjectId };
};

export const updatePaymentById = async (
  paymentId: string,
  customerId: string,
  payload: Partial<PaymentRecord>,
): Promise<(PaymentRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(paymentId) || !Types.ObjectId.isValid(customerId)) {
    return null;
  }

  return PaymentModel.findOneAndUpdate(
    {
      _id: new Types.ObjectId(paymentId),
      customerId: new Types.ObjectId(customerId),
    },
    { $set: payload },
    { new: true },
  ).lean();
};

export const updatePaymentByGatewayOrderId = async (
  gatewayOrderId: string,
  payload: Partial<PaymentRecord>,
): Promise<(PaymentRecord & { _id: Types.ObjectId }) | null> => {
  if (!gatewayOrderId) {
    return null;
  }

  return PaymentModel.findOneAndUpdate({ gatewayOrderId }, { $set: payload }, { new: true }).lean();
};
