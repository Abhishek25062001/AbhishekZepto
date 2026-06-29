import { Types } from 'mongoose';
import type { CheckoutSessionRecord } from '../../checkout/types/checkout.types';
import type { PaymentRecord } from '../../payment/types/payment.types';
import { fromPaise } from '../../payment/utils/payment-amount.util';
import type { OrderLineItem, OrderRecord } from '../types/order.types';
import { ORDER_FINANCE_STATUS } from '../constants/order-finance-status.constant';
import { ORDER_ITEM_PICKING_STATUS } from '../constants/order-item-picking-status.constant';
import { ORDER_PAYMENT_STATUS } from '../constants/order-payment-status.constant';
import { ORDER_SLA_STATUS } from '../constants/order-sla.constant';
import { ORDER_STATUS } from '../constants/order-status.constant';
import { ORDER_STORE_STATUS } from '../constants/order-store-status.constant';

export const buildOrderPayloadFromCheckoutSession = (input: {
  session: CheckoutSessionRecord & { _id: { toString(): string } };
  payment: PaymentRecord & { _id: { toString(): string } };
  orderNumber: string;
}): Omit<OrderRecord, 'createdAt' | 'updatedAt'> => {
  const { session, payment, orderNumber } = input;
  const summary = session.summarySnapshot;
  const placedAt = new Date();

  const items: OrderLineItem[] = summary.items.map((item) => ({
    productId: new Types.ObjectId(item.productId),
    variantId: new Types.ObjectId(item.variantId),
    storeProductId: new Types.ObjectId(item.storeProductId),
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    lineTotal: item.lineTotal,
    productName: item.productName,
    pickedQuantity: 0,
    missingQuantity: 0,
    pickingStatus: ORDER_ITEM_PICKING_STATUS.PENDING,
  }));

  const paymentGrandTotalRupees = fromPaise(payment.amount);

  if (Math.abs(paymentGrandTotalRupees - summary.grandTotal) > 0.01) {
    throw new Error('Payment amount does not match checkout grand total');
  }

  return {
    orderNumber,
    customerId: session.customerId,
    storeId: session.storeId,
    checkoutSessionId: new Types.ObjectId(session._id.toString()),
    paymentId: new Types.ObjectId(payment._id.toString()),
    paymentRecordId: new Types.ObjectId(payment._id.toString()),
    paymentMethod: payment.paymentMethod,
    paymentGateway: payment.gateway,
    platformFee: 0,
    payableAmount: summary.grandTotal,
    financeStatus: ORDER_FINANCE_STATUS.PAID,
    paidAt: placedAt,
    paymentFailedAt: null,
    refundCompletedAt: null,
    cartId: session.cartId,
    addressSnapshot: session.addressSnapshot,
    items,
    subtotal: summary.subtotal,
    taxAmount: summary.taxAmount,
    deliveryFeeAmount: summary.deliveryFeeAmount,
    discountAmount: summary.discountAmount,
    grandTotal: summary.grandTotal,
    currency: summary.currency,
    paymentStatus: ORDER_PAYMENT_STATUS.PAID,
    orderStatus: ORDER_STATUS.PLACED,
    storeStatus: ORDER_STORE_STATUS.PENDING_ACCEPTANCE,
    pickerStatus: null,
    packingStatus: null,
    assignedPickerId: null,
    readyForPickupAt: null,
    acceptedAt: null,
    rejectedAt: null,
    rejectionReason: null,
    cancellationReason: null,
    cancelledAt: null,
    cancelledBy: null,
    refundReviewRequired: false,
    slaStatus: ORDER_SLA_STATUS.ON_TRACK,
    slaBreachedStage: null,
    timeline: [],
    inventoryConfirmed: false,
    placedAt,
  };
};
