import { Types, type FilterQuery } from 'mongoose';
import { PAYMENT_STATUS } from '../constants/payment-status.constant';
import { PaymentModel } from '../models/payment.model';
import type { PaymentListQuery, PaymentRecord } from '../types/payment.types';

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

export const findPaymentById = async (
  paymentId: string,
): Promise<(PaymentRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(paymentId)) {
    return null;
  }

  return PaymentModel.findById(paymentId).lean();
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

export const hasWebhookEventId = async (
  paymentId: string,
  eventId: string,
): Promise<boolean> => {
  if (!Types.ObjectId.isValid(paymentId) || !eventId) {
    return false;
  }

  const payment = await PaymentModel.findOne({
    _id: new Types.ObjectId(paymentId),
    webhookEventIds: eventId,
  })
    .select('_id')
    .lean();

  return Boolean(payment);
};

export const appendWebhookEventId = async (
  paymentId: string,
  eventId: string,
): Promise<void> => {
  if (!Types.ObjectId.isValid(paymentId) || !eventId) {
    return;
  }

  await PaymentModel.updateOne(
    { _id: new Types.ObjectId(paymentId) },
    { $addToSet: { webhookEventIds: eventId } },
  );
};

export const updatePaymentLedgerMetadata = async (
  paymentId: string,
  ledgerJournalId: string,
): Promise<void> => {
  if (!Types.ObjectId.isValid(paymentId) || !ledgerJournalId) {
    return;
  }

  const payment = await PaymentModel.findById(paymentId).select('metadata').lean();
  const existingMetadata =
    payment?.metadata && typeof payment.metadata === 'object' && !Array.isArray(payment.metadata)
      ? payment.metadata
      : {};

  await PaymentModel.updateOne(
    { _id: new Types.ObjectId(paymentId) },
    {
      $set: {
        metadata: {
          ...existingMetadata,
          ledgerJournalId,
          ledgerPostedAt: new Date().toISOString(),
        },
      },
    },
  );
};

const buildListFilter = (query: PaymentListQuery): FilterQuery<PaymentRecord> => {
  const filter: FilterQuery<PaymentRecord> = {};

  if (query.customerId && Types.ObjectId.isValid(query.customerId)) {
    filter.customerId = new Types.ObjectId(query.customerId);
  }

  if (query.orderId && Types.ObjectId.isValid(query.orderId)) {
    filter.orderId = new Types.ObjectId(query.orderId);
  }

  if (query.storeId && Types.ObjectId.isValid(query.storeId)) {
    filter.storeId = new Types.ObjectId(query.storeId);
  }

  if (query.vendorId && Types.ObjectId.isValid(query.vendorId)) {
    filter.vendorId = new Types.ObjectId(query.vendorId);
  }

  if (query.cityId && Types.ObjectId.isValid(query.cityId)) {
    filter.cityId = new Types.ObjectId(query.cityId);
  }

  if (query.paymentStatus) {
    filter.status = query.paymentStatus;
  }

  if (query.gateway) {
    filter.gateway = query.gateway;
  }

  if (query.paymentMethod) {
    filter.paymentMethod = query.paymentMethod;
  }

  if (query.dateFrom || query.dateTo) {
    filter.createdAt = {};
    if (query.dateFrom) {
      filter.createdAt.$gte = new Date(query.dateFrom);
    }
    if (query.dateTo) {
      filter.createdAt.$lte = new Date(query.dateTo);
    }
  }

  if (query.search?.trim()) {
    const search = query.search.trim();
    filter.$or = [
      { gatewayOrderId: search },
      { gatewayPaymentId: search },
    ];
    if (Types.ObjectId.isValid(search)) {
      filter.$or.push({ _id: new Types.ObjectId(search) });
    }
  }

  return filter;
};

export const listPaymentRecords = async (
  query: PaymentListQuery,
): Promise<{
  payments: Array<PaymentRecord & { _id: Types.ObjectId }>;
  total: number;
  page: number;
  limit: number;
}> => {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const filter = buildListFilter(query);
  const skip = (page - 1) * limit;

  const [payments, total] = await Promise.all([
    PaymentModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    PaymentModel.countDocuments(filter),
  ]);

  return {
    payments: payments as Array<PaymentRecord & { _id: Types.ObjectId }>,
    total,
    page,
    limit,
  };
};
