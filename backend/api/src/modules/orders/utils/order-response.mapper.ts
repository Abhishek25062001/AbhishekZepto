import type {
  CustomerOrderLifecycleResponse,
  CustomerOrderStateResponse,
  OrderDetailResponse,
  OrderListItemResponse,
  OrderRecord,
  PlaceOrderResponse,
  AdminOrderDetailResponse,
  AdminOrderListItemResponse,
  AdminOrderTimelineResponse,
  StoreOrderDetailResponse,
  StoreOrderListItemResponse,
} from '../types/order.types';
import { ORDER_STATUS } from '../constants/order-status.constant';

export const toPlaceOrderResponse = (
  order: OrderRecord & { _id: { toString(): string } },
): PlaceOrderResponse => ({
  orderId: order._id.toString(),
  orderNumber: order.orderNumber,
  orderStatus: order.orderStatus,
  grandTotal: order.grandTotal,
  currency: order.currency,
  placedAt: order.placedAt.toISOString(),
});

export const toOrderDetailResponse = (
  order: OrderRecord & { _id: { toString(): string } },
): OrderDetailResponse => ({
  ...toPlaceOrderResponse(order),
  paymentId: order.paymentId.toString(),
  checkoutSessionId: order.checkoutSessionId.toString(),
  storeId: order.storeId.toString(),
  addressSnapshot: order.addressSnapshot,
  items: order.items.map((item) => ({
    productId: item.productId.toString(),
    variantId: item.variantId.toString(),
    storeProductId: item.storeProductId.toString(),
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    lineTotal: item.lineTotal,
    productName: item.productName,
    pickedQuantity: item.pickedQuantity,
    missingQuantity: item.missingQuantity,
    pickingStatus: item.pickingStatus,
  })),
  subtotal: order.subtotal,
  taxAmount: order.taxAmount,
  deliveryFeeAmount: order.deliveryFeeAmount,
  discountAmount: order.discountAmount,
  paymentStatus: order.paymentStatus,
  storeStatus: order.storeStatus,
  pickerStatus: order.pickerStatus,
  packingStatus: order.packingStatus,
  assignedPickerId: order.assignedPickerId?.toString() ?? null,
  readyForPickupAt: order.readyForPickupAt?.toISOString() ?? null,
  acceptedAt: order.acceptedAt?.toISOString() ?? null,
  rejectedAt: order.rejectedAt?.toISOString() ?? null,
  rejectionReason: order.rejectionReason,
  cancellationReason: order.cancellationReason,
  cancelledAt: order.cancelledAt?.toISOString() ?? null,
  cancelledBy: order.cancelledBy
    ? {
        actorId: order.cancelledBy.actorId?.toString() ?? null,
        actorType: order.cancelledBy.actorType,
        actorRole: order.cancelledBy.actorRole,
      }
    : null,
  refundReviewRequired: order.refundReviewRequired,
  inventoryConfirmed: order.inventoryConfirmed,
  slaStatus: order.slaStatus,
  slaBreachedStage: order.slaBreachedStage,
});

export const toOrderListItemResponse = (
  order: OrderRecord & { _id: { toString(): string } },
): OrderListItemResponse => ({
  orderId: order._id.toString(),
  orderNumber: order.orderNumber,
  orderStatus: order.orderStatus,
  storeStatus: order.storeStatus,
  pickerStatus: order.pickerStatus,
  packingStatus: order.packingStatus,
  grandTotal: order.grandTotal,
  currency: order.currency,
  placedAt: order.placedAt.toISOString(),
  itemCount: order.items.length,
});

export const toCustomerOrderStateResponse = (
  order: OrderRecord & { _id: { toString(): string } },
): CustomerOrderStateResponse => ({
  orderId: order._id.toString(),
  orderNumber: order.orderNumber,
  orderStatus: order.orderStatus,
  storeStatus: order.storeStatus,
  pickerStatus: order.pickerStatus,
  packingStatus: order.packingStatus,
  readyForPickupAt: order.readyForPickupAt?.toISOString() ?? null,
  acceptedAt: order.acceptedAt?.toISOString() ?? null,
  cancelledAt: order.cancelledAt?.toISOString() ?? null,
  cancellationReason: order.cancellationReason,
  refundReviewRequired: order.refundReviewRequired,
  canCustomerCancel: order.orderStatus === ORDER_STATUS.PLACED,
});

export const toCustomerOrderLifecycleResponse = (
  order: Pick<OrderRecord, 'timeline'>,
): CustomerOrderLifecycleResponse =>
  [...order.timeline]
    .sort((left, right) => left.createdAt.getTime() - right.createdAt.getTime())
    .map((event) => ({
      event: event.event,
      fromStatus: event.fromStatus,
      toStatus: event.toStatus,
      reason: event.reason,
      createdAt: event.createdAt.toISOString(),
    }));

export const toStoreOrderListItemResponse = (
  order: OrderRecord & { _id: { toString(): string } },
): StoreOrderListItemResponse => ({
  ...toOrderListItemResponse(order),
  customerId: order.customerId.toString(),
  storeId: order.storeId.toString(),
  paymentStatus: order.paymentStatus,
  createdAt: order.createdAt.toISOString(),
  acceptedAt: order.acceptedAt?.toISOString() ?? null,
  slaStatus: order.slaStatus,
  slaBreachedStage: order.slaBreachedStage,
});

export const toAdminOrderListItemResponse = (
  order: OrderRecord & { _id: { toString(): string } },
): AdminOrderListItemResponse => ({
  ...toStoreOrderListItemResponse(order),
  cityId: null,
});

export const toStoreOrderDetailResponse = (
  order: OrderRecord & { _id: { toString(): string } },
): StoreOrderDetailResponse => ({
  ...toOrderDetailResponse(order),
  customerId: order.customerId.toString(),
  itemCount: order.items.length,
  createdAt: order.createdAt.toISOString(),
  updatedAt: order.updatedAt.toISOString(),
  timeline: order.timeline.map((event) => ({
    event: event.event,
    fromStatus: event.fromStatus,
    toStatus: event.toStatus,
    itemId: event.itemId,
    quantity: event.quantity,
    actorType: event.actorType,
    actorRole: event.actorRole,
    reason: event.reason,
    createdAt: event.createdAt.toISOString(),
  })),
  slaStatus: order.slaStatus,
  slaBreachedStage: order.slaBreachedStage,
});

export const toAdminOrderDetailResponse = (
  order: OrderRecord & { _id: { toString(): string } },
): AdminOrderDetailResponse => ({
  ...toStoreOrderDetailResponse(order),
  cityId: null,
});

export const toAdminOrderTimelineResponse = (
  order: Pick<OrderRecord, 'timeline'>,
): AdminOrderTimelineResponse =>
  [...order.timeline]
    .sort((left, right) => left.createdAt.getTime() - right.createdAt.getTime())
    .map((event) => ({
      event: event.event,
      fromStatus: event.fromStatus,
      toStatus: event.toStatus,
      itemId: event.itemId,
      quantity: event.quantity,
      actorType: event.actorType,
      actorRole: event.actorRole,
      reason: event.reason,
      createdAt: event.createdAt.toISOString(),
    }));
