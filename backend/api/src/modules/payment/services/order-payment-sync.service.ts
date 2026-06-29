import { Types } from 'mongoose';
import { PAYMENT_GATEWAY } from '../constants/payment-gateway.constant';
import { OrderModel } from '../../orders/models/order.model';
import { ORDER_FINANCE_STATUS } from '../../orders/constants/order-finance-status.constant';
import { ORDER_PAYMENT_STATUS } from '../../orders/constants/order-payment-status.constant';

type OrderPaymentSyncInput = {
  orderId: string;
  paymentId: string;
  paymentGateway?: string;
  payableAmount?: number;
};

export const markOrderPaymentPaid = async (input: OrderPaymentSyncInput): Promise<void> => {
  if (!Types.ObjectId.isValid(input.orderId)) {
    return;
  }

  const paidAt = new Date();

  await OrderModel.updateOne(
    { _id: new Types.ObjectId(input.orderId) },
    {
      $set: {
        paymentRecordId: new Types.ObjectId(input.paymentId),
        paymentGateway: input.paymentGateway ?? PAYMENT_GATEWAY.RAZORPAY,
        payableAmount: input.payableAmount ?? null,
        financeStatus: ORDER_FINANCE_STATUS.PAID,
        paymentStatus: ORDER_PAYMENT_STATUS.PAID,
        paidAt,
        paymentFailedAt: null,
      },
    },
  );
};

export const markOrderPaymentFailed = async (orderId: string): Promise<void> => {
  if (!Types.ObjectId.isValid(orderId)) {
    return;
  }

  await OrderModel.updateOne(
    { _id: new Types.ObjectId(orderId) },
    {
      $set: {
        financeStatus: ORDER_FINANCE_STATUS.UNPAID,
        paymentFailedAt: new Date(),
      },
    },
  );
};

export const markOrderPaymentPending = async (orderId: string): Promise<void> => {
  if (!Types.ObjectId.isValid(orderId)) {
    return;
  }

  await OrderModel.updateOne(
    { _id: new Types.ObjectId(orderId) },
    {
      $set: {
        financeStatus: ORDER_FINANCE_STATUS.UNPAID,
      },
    },
  );
};
