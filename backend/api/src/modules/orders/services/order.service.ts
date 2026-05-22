import { Types } from 'mongoose';
import { writeAuditLog } from '../../audit';
import { CHECKOUT_SESSION_STATUS } from '../../checkout/constants/checkout-session-status.constant';
import {
  findCheckoutSessionByIdForCustomer,
  updateCheckoutSessionById,
} from '../../checkout/repositories/checkout-session.repository';
import { releaseCheckoutLocks } from '../../checkout/utils/checkout-inventory-lock.util';
import { PAYMENT_STATUS } from '../../payment/constants/payment-status.constant';
import { findPaymentByIdForCustomer, updatePaymentById } from '../../payment/repositories/payment.repository';
import { ORDER_AUDIT_EVENTS } from '../constants/order-audit-events.constant';
import { ORDER_ITEM_PICKING_STATUS } from '../constants/order-item-picking-status.constant';
import { ORDER_NOTIFICATION_EVENTS } from '../constants/order-notification-events.constant';
import { ORDER_PACKING_STATUS } from '../constants/order-packing-status.constant';
import { ORDER_PICKER_STATUS } from '../constants/order-picker-status.constant';
import { STORE_ACCEPTANCE_AUTO_ACCEPT_ENABLED } from '../constants/order-store-acceptance.constant';
import { ORDER_STATUS } from '../constants/order-status.constant';
import { ORDER_STORE_STATUS } from '../constants/order-store-status.constant';
import {
  createOrder,
  findOrderById,
  findOrderByIdForCustomer,
  findOrderByIdForStore,
  findOrderByPaymentId,
  listOrdersByAdmin,
  listOrdersByCustomer,
  listOrdersByStore,
  transitionOrderById,
  transitionOrderByIdForCustomer,
  transitionOrderByIdForStore,
  updateOrderById,
} from '../repositories/order.repository';
import {
  initializeDeliveryForOrder,
  runDispatchEngineForOrder,
} from '../../delivery/services/delivery-assignment.service';
import type {
  AdminOrderActorContext,
  AdminOrderDetailResponse,
  AdminOrderListItemResponse,
  AdminOrderStatusUpdateInput,
  AdminOrderTimelineResponse,
  CancelOrderInput,
  CustomerOrderLifecycleResponse,
  CustomerOrderStateResponse,
  ListAdminOrdersQuery,
  ListOrdersQuery,
  ListStoreOrdersQuery,
  OrderAuditContext,
  OrderDetailResponse,
  OrderLineItem,
  OrderListItemResponse,
  OrderRecord,
  OrderTimelineEvent,
  PlaceOrderInput,
  PlaceOrderResponse,
  RejectStoreOrderInput,
  StoreOrderAcceptanceResponse,
  StoreOrderActorContext,
  StoreOrderDetailResponse,
  StoreOrderItemPickingInput,
  StoreOrderListItemResponse,
  StoreOrderPackingResponse,
  StoreOrderPickingResponse,
} from '../types/order.types';
import { clearCartAfterOrderPlacement } from '../utils/order-cart-clear.util';
import {
  orderAcceptanceNotAllowedError,
  orderAccessForbiddenError,
  orderCancellationNotAllowedError,
  orderCancellationReasonRequiredError,
  orderCreationFailedError,
  orderItemOperationInvalidError,
  orderNotFoundError,
  orderPackingNotAllowedError,
  orderPickingNotAllowedError,
  orderRejectionReasonRequiredError,
  orderScopeRequiredError,
  orderStatusUpdateNotAllowedError,
  paymentNotFoundError,
  paymentNotReadyForOrderError,
} from '../utils/order-error.mapper';
import { confirmCheckoutLocksForOrder } from '../utils/order-inventory-lock.util';
import { generateOrderNumber } from '../utils/order-number.util';
import {
  toCustomerOrderLifecycleResponse,
  toCustomerOrderStateResponse,
  toOrderDetailResponse,
  toOrderListItemResponse,
  toPlaceOrderResponse,
  toAdminOrderDetailResponse,
  toAdminOrderListItemResponse,
  toAdminOrderTimelineResponse,
  toStoreOrderDetailResponse,
  toStoreOrderListItemResponse,
} from '../utils/order-response.mapper';
import { buildOrderPayloadFromCheckoutSession } from '../utils/order-snapshot.util';
import { applyCancellationInventoryImpact } from './order-cancellation-inventory.service';
import { adjustOrderInventoryForMissingItems } from './order-inventory-adjustment.service';
import { publishOrderNotificationPlaceholders } from './order-notification-placeholder.service';

const toObjectIdOrNull = (value?: string | null): Types.ObjectId | null => {
  if (!value || !Types.ObjectId.isValid(value)) {
    return null;
  }

  return new Types.ObjectId(value);
};

const isAutoAcceptEnabled = (): boolean => STORE_ACCEPTANCE_AUTO_ACCEPT_ENABLED;

const toStoreOrderAcceptanceResponse = (
  order: { _id: { toString(): string } } & Pick<
    StoreOrderAcceptanceResponse,
    'orderNumber' | 'orderStatus' | 'storeStatus' | 'rejectionReason'
  > & {
    acceptedAt: Date | null;
    rejectedAt: Date | null;
  },
): StoreOrderAcceptanceResponse => ({
  orderId: order._id.toString(),
  orderNumber: order.orderNumber,
  orderStatus: order.orderStatus,
  storeStatus: order.storeStatus,
  acceptedAt: order.acceptedAt?.toISOString() ?? null,
  rejectedAt: order.rejectedAt?.toISOString() ?? null,
  rejectionReason: order.rejectionReason,
  autoAcceptEnabled: isAutoAcceptEnabled(),
});

const assertStoreScope = (actor: StoreOrderActorContext): string => {
  if (!actor.storeId) {
    throw orderScopeRequiredError();
  }

  return actor.storeId;
};

const isStoreAcceptanceEligible = (order: {
  orderStatus: string;
  storeStatus: string;
}): boolean =>
  order.orderStatus === ORDER_STATUS.PLACED &&
  order.storeStatus === ORDER_STORE_STATUS.PENDING_ACCEPTANCE;

const isStartPickingEligible = (order: {
  orderStatus: string;
  storeStatus: string;
  pickerStatus?: string | null;
}): boolean =>
  order.orderStatus === ORDER_STATUS.ACCEPTED &&
  order.storeStatus === ORDER_STORE_STATUS.ACCEPTED &&
  !order.pickerStatus;

const isActivePickingOrder = (order: {
  orderStatus: string;
  pickerStatus?: string | null;
}): boolean =>
  order.orderStatus === ORDER_STATUS.PICKING &&
  order.pickerStatus === ORDER_PICKER_STATUS.IN_PROGRESS;

const isStartPackingEligible = (order: {
  orderStatus: string;
  pickerStatus?: string | null;
  packingStatus?: string | null;
}): boolean =>
  order.orderStatus === ORDER_STATUS.PICKING &&
  order.pickerStatus === ORDER_PICKER_STATUS.COMPLETED &&
  !order.packingStatus;

const isActivePackingOrder = (order: {
  orderStatus: string;
  packingStatus?: string | null;
}): boolean =>
  order.orderStatus === ORDER_STATUS.PACKING &&
  order.packingStatus === ORDER_PACKING_STATUS.IN_PROGRESS;

const isReadyForPickupEligible = (order: {
  orderStatus: string;
  packingStatus?: string | null;
}): boolean =>
  order.orderStatus === ORDER_STATUS.PACKING &&
  order.packingStatus === ORDER_PACKING_STATUS.COMPLETED;

const ADMIN_STATUS_TRANSITIONS: Partial<Record<string, string[]>> = {
  [ORDER_STATUS.PLACED]: [ORDER_STATUS.ACCEPTED],
  [ORDER_STATUS.ACCEPTED]: [ORDER_STATUS.PICKING],
  [ORDER_STATUS.PICKING]: [ORDER_STATUS.PACKING],
  [ORDER_STATUS.PACKING]: [ORDER_STATUS.READY_FOR_PICKUP],
};

const isAdminStatusTransitionAllowed = (fromStatus: string, toStatus: string): boolean =>
  ADMIN_STATUS_TRANSITIONS[fromStatus]?.includes(toStatus) ?? false;

const buildAdminStatusPayload = (
  order: OrderRecord,
  targetStatus: string,
  timestamp: Date,
): Partial<OrderRecord> => {
  const payload: Partial<OrderRecord> = {
    orderStatus: targetStatus as OrderRecord['orderStatus'],
  };

  if (targetStatus === ORDER_STATUS.ACCEPTED) {
    payload.storeStatus = ORDER_STORE_STATUS.ACCEPTED;
    payload.acceptedAt = order.acceptedAt ?? timestamp;
    payload.rejectedAt = null;
    payload.rejectionReason = null;
  }

  if (targetStatus === ORDER_STATUS.PICKING) {
    payload.pickerStatus = ORDER_PICKER_STATUS.IN_PROGRESS;
  }

  if (targetStatus === ORDER_STATUS.PACKING) {
    payload.pickerStatus = ORDER_PICKER_STATUS.COMPLETED;
    payload.packingStatus = ORDER_PACKING_STATUS.IN_PROGRESS;
  }

  if (targetStatus === ORDER_STATUS.READY_FOR_PICKUP) {
    payload.packingStatus = ORDER_PACKING_STATUS.READY_FOR_PICKUP;
    payload.readyForPickupAt = order.readyForPickupAt ?? timestamp;
  }

  return payload;
};

const resolvePickingStatus = (item: Pick<OrderLineItem, 'quantity' | 'pickedQuantity' | 'missingQuantity'>) => {
  const pickedQuantity = item.pickedQuantity ?? 0;
  const missingQuantity = item.missingQuantity ?? 0;

  if (pickedQuantity === item.quantity && missingQuantity === 0) {
    return ORDER_ITEM_PICKING_STATUS.PICKED;
  }

  if (missingQuantity === item.quantity && pickedQuantity === 0) {
    return ORDER_ITEM_PICKING_STATUS.MISSING;
  }

  return ORDER_ITEM_PICKING_STATUS.PARTIAL;
};

const applyPickedQuantityToItems = (
  items: OrderLineItem[],
  itemId: string,
  pickedQuantity: number,
): OrderLineItem[] => {
  let found = false;

  const updatedItems = items.map((item) => {
    if (item.storeProductId.toString() !== itemId) {
      return item;
    }

    found = true;
    const missingQuantity = item.missingQuantity ?? 0;

    if (pickedQuantity + missingQuantity > item.quantity) {
      throw orderItemOperationInvalidError({
        itemId,
        pickedQuantity,
        missingQuantity,
        orderedQuantity: item.quantity,
      });
    }

    const updatedItem = {
      ...item,
      pickedQuantity,
      missingQuantity,
    };

    return {
      ...updatedItem,
      pickingStatus: resolvePickingStatus(updatedItem),
    };
  });

  if (!found) {
    throw orderItemOperationInvalidError({ itemId, reason: 'item_not_found' });
  }

  return updatedItems;
};

const applyMissingQuantityToItems = (
  items: OrderLineItem[],
  itemId: string,
  missingQuantity: number,
): OrderLineItem[] => {
  let found = false;

  const updatedItems = items.map((item) => {
    if (item.storeProductId.toString() !== itemId) {
      return item;
    }

    found = true;
    const pickedQuantity = item.pickedQuantity ?? 0;

    if (pickedQuantity + missingQuantity > item.quantity) {
      throw orderItemOperationInvalidError({
        itemId,
        pickedQuantity,
        missingQuantity,
        orderedQuantity: item.quantity,
      });
    }

    const updatedItem = {
      ...item,
      pickedQuantity,
      missingQuantity,
    };

    return {
      ...updatedItem,
      pickingStatus: resolvePickingStatus(updatedItem),
    };
  });

  if (!found) {
    throw orderItemOperationInvalidError({ itemId, reason: 'item_not_found' });
  }

  return updatedItems;
};

const areAllItemsResolvedForPicking = (items: OrderLineItem[]): boolean =>
  items.length > 0 &&
  items.every((item) =>
    item.pickingStatus === ORDER_ITEM_PICKING_STATUS.PICKED ||
    item.pickingStatus === ORDER_ITEM_PICKING_STATUS.MISSING ||
    item.pickingStatus === ORDER_ITEM_PICKING_STATUS.PARTIAL,
  );

const writeStoreAcceptanceAudit = async ({
  eventType,
  actor,
  order,
  metadata,
  status,
}: {
  eventType: string;
  actor: StoreOrderActorContext;
  order: { _id: Types.ObjectId; storeId: Types.ObjectId };
  metadata: Record<string, unknown>;
  status: 'success' | 'failed';
}): Promise<void> => {
  await writeAuditLog({
    eventType,
    actorId: toObjectIdOrNull(actor.userId),
    actorRole: actor.role,
    actorSurface: 'vendor_panel',
    entityType: 'order',
    entityId: order._id,
    vendorId: toObjectIdOrNull(actor.vendorId),
    storeId: order.storeId,
    cityId: null,
    requestId: actor.requestId,
    traceId: actor.traceId,
    ipAddress: actor.ipAddress ?? null,
    userAgent: actor.userAgent ?? null,
    metadata,
    status,
  });
};

const buildStoreTimelineEvent = ({
  actor,
  event,
  fromStatus,
  itemId = null,
  quantity = null,
  reason = null,
  timestamp,
  toStatus,
}: {
  actor: StoreOrderActorContext;
  event: string;
  fromStatus: OrderTimelineEvent['fromStatus'];
  itemId?: string | null;
  quantity?: number | null;
  reason?: string | null;
  timestamp: Date;
  toStatus: OrderTimelineEvent['toStatus'];
}): OrderTimelineEvent => ({
  event,
  fromStatus,
  toStatus,
  itemId,
  quantity,
  actorId: toObjectIdOrNull(actor.userId),
  actorType: 'store',
  actorRole: actor.role,
  reason,
  createdAt: timestamp,
});

const buildCancellationTimelineEvent = ({
  actorId,
  actorRole,
  actorType,
  fromStatus,
  reason,
  timestamp,
}: {
  actorId: Types.ObjectId | null;
  actorRole: string | null;
  actorType: OrderTimelineEvent['actorType'];
  fromStatus: OrderTimelineEvent['fromStatus'];
  reason: string;
  timestamp: Date;
}): OrderTimelineEvent => ({
  event: ORDER_AUDIT_EVENTS.CANCELLED,
  fromStatus,
  toStatus: ORDER_STATUS.CANCELLED,
  itemId: null,
  quantity: null,
  actorId,
  actorType,
  actorRole,
  reason,
  createdAt: timestamp,
});

const publishOrderNotificationPlaceholderSafely = async ({
  event,
  metadata,
  order,
  timelineEvent,
}: {
  event: (typeof ORDER_NOTIFICATION_EVENTS)[keyof typeof ORDER_NOTIFICATION_EVENTS];
  metadata?: Record<string, unknown>;
  order: Pick<OrderRecord, 'customerId' | 'orderNumber' | 'storeId'> & { _id: Types.ObjectId };
  timelineEvent: Pick<OrderTimelineEvent, 'actorId' | 'actorType' | 'reason'>;
}): Promise<void> => {
  try {
    await publishOrderNotificationPlaceholders({
      event,
      metadata,
      order,
      timelineEvent,
    });
  } catch {
    return;
  }
};

const buildAdminStatusTimelineEvent = ({
  actor,
  fromStatus,
  reason,
  timestamp,
  toStatus,
}: {
  actor: AdminOrderActorContext;
  fromStatus: OrderTimelineEvent['fromStatus'];
  reason: string | null;
  timestamp: Date;
  toStatus: OrderTimelineEvent['toStatus'];
}): OrderTimelineEvent => ({
  event: ORDER_AUDIT_EVENTS.STATUS_UPDATED,
  fromStatus,
  toStatus,
  itemId: null,
  quantity: null,
  actorId: toObjectIdOrNull(actor.userId),
  actorType: 'admin',
  actorRole: actor.role,
  reason,
  createdAt: timestamp,
});

const toStoreOrderPickingResponse = (
  order: { _id: { toString(): string } } & Pick<
    StoreOrderPickingResponse,
    'orderNumber' | 'orderStatus' | 'storeStatus' | 'pickerStatus'
  > & {
    assignedPickerId: { toString(): string } | null;
  },
): StoreOrderPickingResponse => ({
  orderId: order._id.toString(),
  orderNumber: order.orderNumber,
  orderStatus: order.orderStatus,
  storeStatus: order.storeStatus,
  pickerStatus: order.pickerStatus,
  assignedPickerId: order.assignedPickerId?.toString() ?? null,
});

const toStoreOrderPackingResponse = (
  order: { _id: { toString(): string } } & Pick<
    StoreOrderPackingResponse,
    'orderNumber' | 'orderStatus' | 'storeStatus' | 'pickerStatus' | 'packingStatus'
  > & {
    readyForPickupAt: Date | null;
  },
): StoreOrderPackingResponse => ({
  orderId: order._id.toString(),
  orderNumber: order.orderNumber,
  orderStatus: order.orderStatus,
  storeStatus: order.storeStatus,
  pickerStatus: order.pickerStatus,
  packingStatus: order.packingStatus,
  readyForPickupAt: order.readyForPickupAt?.toISOString() ?? null,
});

export const placeOrderFromPayment = async (
  customerId: string,
  input: PlaceOrderInput,
  audit?: OrderAuditContext,
): Promise<PlaceOrderResponse> => {
  const payment = await findPaymentByIdForCustomer(input.paymentId, customerId);

  if (!payment) {
    throw paymentNotFoundError();
  }

  if (payment.status !== PAYMENT_STATUS.PAID || !payment.signatureVerified) {
    throw paymentNotReadyForOrderError();
  }

  const existingOrder = await findOrderByPaymentId(payment._id.toString());

  if (existingOrder) {
    return toPlaceOrderResponse(existingOrder);
  }

  const session = await findCheckoutSessionByIdForCustomer(
    payment.checkoutSessionId.toString(),
    customerId,
  );

  if (!session) {
    throw orderCreationFailedError({ reason: 'checkout_session_not_found' });
  }

  if (session.status === CHECKOUT_SESSION_STATUS.COMPLETED && session.orderId) {
    const completedOrder = await findOrderByIdForCustomer(
      session.orderId.toString(),
      customerId,
    );

    if (completedOrder) {
      return toPlaceOrderResponse(completedOrder);
    }
  }

  if (session.status !== CHECKOUT_SESSION_STATUS.INITIATED) {
    throw orderCreationFailedError({
      reason: 'invalid_checkout_status',
      status: session.status,
    });
  }

  let createdOrderId: string | null = null;

  try {
    const orderNumber = generateOrderNumber();
    const payload = buildOrderPayloadFromCheckoutSession({
      session,
      payment,
      orderNumber,
    });
    const created = await createOrder(payload);
    createdOrderId = created._id.toString();

    await confirmCheckoutLocksForOrder({
      lockTokens: session.lockTokens,
      orderId: createdOrderId,
      actorUserId: customerId,
    });

    await updateOrderById(createdOrderId, customerId, { inventoryConfirmed: true });

    await clearCartAfterOrderPlacement({
      cartId: session.cartId.toString(),
      customerId,
    });

    await updateCheckoutSessionById(session._id.toString(), customerId, {
      status: CHECKOUT_SESSION_STATUS.COMPLETED,
      orderId: new Types.ObjectId(createdOrderId),
      lockTokens: [],
    });

    await updatePaymentById(payment._id.toString(), customerId, {
      orderId: new Types.ObjectId(createdOrderId),
    });

    const finalized = await findOrderByIdForCustomer(createdOrderId, customerId);

    if (!finalized) {
      throw orderCreationFailedError({ reason: 'order_not_found_after_create' });
    }

    await writeAuditLog({
      eventType: ORDER_AUDIT_EVENTS.PLACED,
      actorId: new Types.ObjectId(customerId),
      actorRole: null,
      actorSurface: 'customer_app',
      entityType: 'order',
      entityId: finalized._id,
      vendorId: null,
      storeId: finalized.storeId,
      cityId: null,
      requestId: audit?.requestId ?? null,
      traceId: audit?.traceId ?? null,
      ipAddress: null,
      userAgent: null,
      metadata: {
        orderId: createdOrderId,
        paymentId: payment._id.toString(),
        checkoutSessionId: session._id.toString(),
      },
      status: 'success',
    });

    return toPlaceOrderResponse(finalized);
  } catch (error) {
    if (session.lockTokens.length > 0) {
      await releaseCheckoutLocks(
        session.lockTokens,
        'order_placement_failed',
        customerId,
      );
    }

    await writeAuditLog({
      eventType: ORDER_AUDIT_EVENTS.PLACEMENT_FAILED,
      actorId: new Types.ObjectId(customerId),
      actorRole: null,
      actorSurface: 'backend',
      entityType: 'order',
      entityId: createdOrderId ? new Types.ObjectId(createdOrderId) : null,
      vendorId: null,
      storeId: session.storeId,
      cityId: null,
      requestId: audit?.requestId ?? null,
      traceId: audit?.traceId ?? null,
      ipAddress: null,
      userAgent: null,
      metadata: {
        paymentId: payment._id.toString(),
        message: error instanceof Error ? error.message : 'unknown',
      },
      status: 'failed',
    });

    throw orderCreationFailedError({
      message: error instanceof Error ? error.message : 'unknown',
    });
  }
};

export const getOrderForCustomer = async (
  customerId: string,
  orderId: string,
): Promise<OrderDetailResponse> => {
  const order = await findOrderByIdForCustomer(orderId, customerId);

  if (!order) {
    throw orderNotFoundError();
  }

  return toOrderDetailResponse(order);
};

export const getOrderStateForCustomer = async (
  customerId: string,
  orderId: string,
): Promise<CustomerOrderStateResponse> => {
  const order = await findOrderByIdForCustomer(orderId, customerId);

  if (!order) {
    throw orderNotFoundError();
  }

  return toCustomerOrderStateResponse(order);
};

export const getOrderLifecycleForCustomer = async (
  customerId: string,
  orderId: string,
): Promise<CustomerOrderLifecycleResponse> => {
  const order = await findOrderByIdForCustomer(orderId, customerId);

  if (!order) {
    throw orderNotFoundError();
  }

  return toCustomerOrderLifecycleResponse(order);
};

export const listOrdersForCustomer = async (
  customerId: string,
  query: ListOrdersQuery,
): Promise<{ orders: OrderListItemResponse[]; total: number; page: number; limit: number }> => {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;

  const { orders, total } = await listOrdersByCustomer(customerId, {
    page,
    limit,
    status: query.status,
  });

  return {
    orders: orders.map(toOrderListItemResponse),
    total,
    page,
    limit,
  };
};

export const listOrdersForStore = async (
  query: ListStoreOrdersQuery,
  actor: StoreOrderActorContext,
): Promise<{ orders: StoreOrderListItemResponse[]; total: number; page: number; limit: number }> => {
  const storeId = assertStoreScope(actor);
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;

  const { orders, total } = await listOrdersByStore(storeId, {
    page,
    limit,
    status: query.status,
    storeStatus: query.storeStatus,
    paymentStatus: query.paymentStatus,
    ...(query.slaStatus ? { slaStatus: query.slaStatus } : {}),
    ...(query.slaBreachedStage ? { slaBreachedStage: query.slaBreachedStage } : {}),
  });

  return {
    orders: orders.map(toStoreOrderListItemResponse),
    total,
    page,
    limit,
  };
};

export const getOrderForStore = async (
  orderId: string,
  actor: StoreOrderActorContext,
): Promise<StoreOrderDetailResponse> => {
  const storeId = assertStoreScope(actor);
  const order = await findOrderByIdForStore(orderId, storeId);

  if (!order) {
    throw orderAccessForbiddenError();
  }

  return toStoreOrderDetailResponse(order);
};

export const listOrdersForAdmin = async (
  query: ListAdminOrdersQuery,
): Promise<{ orders: AdminOrderListItemResponse[]; total: number; page: number; limit: number }> => {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;

  const { orders, total } = await listOrdersByAdmin({
    page,
    limit,
    status: query.status,
    storeStatus: query.storeStatus,
    paymentStatus: query.paymentStatus,
    storeId: query.storeId,
    customerId: query.customerId,
    ...(query.slaStatus ? { slaStatus: query.slaStatus } : {}),
    ...(query.slaBreachedStage ? { slaBreachedStage: query.slaBreachedStage } : {}),
    fromDate: query.fromDate,
    toDate: query.toDate,
    sort: query.sort,
  });

  return {
    orders: orders.map(toAdminOrderListItemResponse),
    total,
    page,
    limit,
  };
};

export const getOrderForAdmin = async (
  orderId: string,
): Promise<AdminOrderDetailResponse> => {
  const order = await findOrderById(orderId);

  if (!order) {
    throw orderNotFoundError();
  }

  return toAdminOrderDetailResponse(order);
};

export const getOrderTimelineForAdmin = async (
  orderId: string,
): Promise<AdminOrderTimelineResponse> => {
  const order = await findOrderById(orderId);

  if (!order) {
    throw orderNotFoundError();
  }

  return toAdminOrderTimelineResponse(order);
};

export const updateAdminOrderStatus = async (
  orderId: string,
  input: AdminOrderStatusUpdateInput,
  actor: AdminOrderActorContext,
): Promise<AdminOrderDetailResponse> => {
  const order = await findOrderById(orderId);

  if (!order) {
    throw orderNotFoundError();
  }

  if (!isAdminStatusTransitionAllowed(order.orderStatus, input.status)) {
    throw orderStatusUpdateNotAllowedError({
      fromStatus: order.orderStatus,
      toStatus: input.status,
    });
  }

  const timestamp = new Date();
  const reason = input.reason?.trim() ?? null;
  const updated = await transitionOrderById(
    orderId,
    buildAdminStatusPayload(order, input.status, timestamp),
    buildAdminStatusTimelineEvent({
      actor,
      fromStatus: order.orderStatus,
      reason,
      timestamp,
      toStatus: input.status,
    }),
  );

  if (!updated) {
    throw orderNotFoundError();
  }

  await writeAuditLog({
    eventType: ORDER_AUDIT_EVENTS.STATUS_UPDATED,
    actorId: toObjectIdOrNull(actor.userId),
    actorRole: actor.role,
    actorSurface: 'admin_dashboard',
    entityType: 'order',
    entityId: updated._id,
    vendorId: null,
    storeId: updated.storeId,
    cityId: null,
    requestId: actor.requestId,
    traceId: actor.traceId,
    ipAddress: actor.ipAddress ?? null,
    userAgent: actor.userAgent ?? null,
    metadata: {
      orderId,
      fromStatus: order.orderStatus,
      toStatus: input.status,
      reason,
    },
    status: 'success',
  });

  return toAdminOrderDetailResponse(updated);
};

export const cancelCustomerOrder = async (
  orderId: string,
  customerId: string,
  input: CancelOrderInput,
  audit?: OrderAuditContext,
): Promise<OrderDetailResponse> => {
  const reason = input.reason.trim();

  if (!reason) {
    throw orderCancellationReasonRequiredError();
  }

  const order = await findOrderByIdForCustomer(orderId, customerId);

  if (!order) {
    throw orderNotFoundError();
  }

  if (order.orderStatus !== ORDER_STATUS.PLACED) {
    throw orderCancellationNotAllowedError({
      orderStatus: order.orderStatus,
      actorType: 'customer',
    });
  }

  const inventoryImpact = await applyCancellationInventoryImpact(order, {
    requestId: audit?.requestId ?? null,
    traceId: audit?.traceId ?? null,
    userId: customerId,
    role: 'customer',
    storeId: order.storeId.toString(),
  });
  const cancelledAt = new Date();
  const actorId = new Types.ObjectId(customerId);
  const timelineEvent = buildCancellationTimelineEvent({
    actorId,
    actorRole: 'customer',
    actorType: 'customer',
    fromStatus: order.orderStatus,
    reason,
    timestamp: cancelledAt,
  });
  const updated = await transitionOrderByIdForCustomer(
    orderId,
    customerId,
    {
      orderStatus: ORDER_STATUS.CANCELLED,
      cancellationReason: reason,
      cancelledAt,
      cancelledBy: {
        actorId,
        actorType: 'customer',
        actorRole: 'customer',
      },
      refundReviewRequired: true,
    },
    timelineEvent,
  );

  if (!updated) {
    throw orderNotFoundError();
  }

  await writeAuditLog({
    eventType: ORDER_AUDIT_EVENTS.CANCELLED,
    actorId,
    actorRole: 'customer',
    actorSurface: 'customer_app',
    entityType: 'order',
    entityId: updated._id,
    vendorId: null,
    storeId: updated.storeId,
    cityId: null,
    requestId: audit?.requestId ?? null,
    traceId: audit?.traceId ?? null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      orderId,
      fromStatus: order.orderStatus,
      toStatus: ORDER_STATUS.CANCELLED,
      reason,
      inventoryImpact,
      refundReviewRequired: true,
    },
    status: 'success',
  });

  await publishOrderNotificationPlaceholderSafely({
    event: ORDER_NOTIFICATION_EVENTS.CANCELLED,
    metadata: {
      fromStatus: order.orderStatus,
      inventoryImpact,
      orderId,
      refundReviewRequired: true,
      toStatus: ORDER_STATUS.CANCELLED,
    },
    order: updated,
    timelineEvent,
  });

  return toOrderDetailResponse(updated);
};

const STORE_CANCELLABLE_STATUSES = new Set<string>([
  ORDER_STATUS.PLACED,
  ORDER_STATUS.ACCEPTED,
  ORDER_STATUS.PICKING,
  ORDER_STATUS.PACKING,
]);

const ADMIN_CANCELLABLE_STATUSES = STORE_CANCELLABLE_STATUSES;

export const cancelStoreOrder = async (
  orderId: string,
  input: CancelOrderInput,
  actor: StoreOrderActorContext,
): Promise<OrderDetailResponse> => {
  const reason = input.reason.trim();

  if (!reason) {
    throw orderCancellationReasonRequiredError();
  }

  const storeId = assertStoreScope(actor);
  const order = await findOrderByIdForStore(orderId, storeId);

  if (!order) {
    throw orderAccessForbiddenError();
  }

  if (!STORE_CANCELLABLE_STATUSES.has(order.orderStatus)) {
    throw orderCancellationNotAllowedError({
      orderStatus: order.orderStatus,
      actorType: 'store',
    });
  }

  const inventoryImpact = await applyCancellationInventoryImpact(order, actor);
  const cancelledAt = new Date();
  const actorId = toObjectIdOrNull(actor.userId);
  const timelineEvent = buildCancellationTimelineEvent({
    actorId,
    actorRole: actor.role,
    actorType: 'store',
    fromStatus: order.orderStatus,
    reason,
    timestamp: cancelledAt,
  });
  const updated = await transitionOrderByIdForStore(
    orderId,
    storeId,
    {
      orderStatus: ORDER_STATUS.CANCELLED,
      cancellationReason: reason,
      cancelledAt,
      cancelledBy: {
        actorId,
        actorType: 'store',
        actorRole: actor.role,
      },
      refundReviewRequired: true,
    },
    timelineEvent,
  );

  if (!updated) {
    throw orderNotFoundError();
  }

  await writeStoreAcceptanceAudit({
    eventType: ORDER_AUDIT_EVENTS.CANCELLED,
    actor,
    order: updated,
    metadata: {
      orderId,
      fromStatus: order.orderStatus,
      toStatus: ORDER_STATUS.CANCELLED,
      reason,
      inventoryImpact,
      refundReviewRequired: true,
    },
    status: 'success',
  });

  await publishOrderNotificationPlaceholderSafely({
    event: ORDER_NOTIFICATION_EVENTS.CANCELLED,
    metadata: {
      fromStatus: order.orderStatus,
      inventoryImpact,
      orderId,
      refundReviewRequired: true,
      toStatus: ORDER_STATUS.CANCELLED,
    },
    order: updated,
    timelineEvent,
  });

  return toOrderDetailResponse(updated);
};

export const cancelAdminOrder = async (
  orderId: string,
  input: CancelOrderInput,
  actor: AdminOrderActorContext,
): Promise<OrderDetailResponse> => {
  const reason = input.reason.trim();

  if (!reason) {
    throw orderCancellationReasonRequiredError();
  }

  const order = await findOrderById(orderId);

  if (!order) {
    throw orderNotFoundError();
  }

  if (!ADMIN_CANCELLABLE_STATUSES.has(order.orderStatus)) {
    throw orderCancellationNotAllowedError({
      orderStatus: order.orderStatus,
      actorType: 'admin',
    });
  }

  const inventoryImpact = await applyCancellationInventoryImpact(order, {
    requestId: actor.requestId,
    traceId: actor.traceId,
    userId: actor.userId,
    role: actor.role,
    storeId: order.storeId.toString(),
    ipAddress: actor.ipAddress ?? null,
    userAgent: actor.userAgent ?? null,
  });
  const cancelledAt = new Date();
  const actorId = toObjectIdOrNull(actor.userId);
  const timelineEvent = buildCancellationTimelineEvent({
    actorId,
    actorRole: actor.role,
    actorType: 'admin',
    fromStatus: order.orderStatus,
    reason,
    timestamp: cancelledAt,
  });
  const updated = await transitionOrderById(
    orderId,
    {
      orderStatus: ORDER_STATUS.CANCELLED,
      cancellationReason: reason,
      cancelledAt,
      cancelledBy: {
        actorId,
        actorType: 'admin',
        actorRole: actor.role,
      },
      refundReviewRequired: true,
    },
    timelineEvent,
  );

  if (!updated) {
    throw orderNotFoundError();
  }

  await writeAuditLog({
    eventType: ORDER_AUDIT_EVENTS.CANCELLED,
    actorId,
    actorRole: actor.role,
    actorSurface: 'admin_dashboard',
    entityType: 'order',
    entityId: updated._id,
    vendorId: null,
    storeId: updated.storeId,
    cityId: null,
    requestId: actor.requestId,
    traceId: actor.traceId,
    ipAddress: actor.ipAddress ?? null,
    userAgent: actor.userAgent ?? null,
    metadata: {
      orderId,
      fromStatus: order.orderStatus,
      toStatus: ORDER_STATUS.CANCELLED,
      reason,
      inventoryImpact,
      refundReviewRequired: true,
    },
    status: 'success',
  });

  await publishOrderNotificationPlaceholderSafely({
    event: ORDER_NOTIFICATION_EVENTS.CANCELLED,
    metadata: {
      fromStatus: order.orderStatus,
      inventoryImpact,
      orderId,
      refundReviewRequired: true,
      toStatus: ORDER_STATUS.CANCELLED,
    },
    order: updated,
    timelineEvent,
  });

  return toOrderDetailResponse(updated);
};

export const acceptStoreOrder = async (
  orderId: string,
  actor: StoreOrderActorContext,
): Promise<StoreOrderAcceptanceResponse> => {
  const storeId = assertStoreScope(actor);
  const order = await findOrderByIdForStore(orderId, storeId);

  if (!order) {
    throw orderAccessForbiddenError();
  }

  if (!isStoreAcceptanceEligible(order)) {
    await writeStoreAcceptanceAudit({
      eventType: ORDER_AUDIT_EVENTS.STORE_ACCEPTED,
      actor,
      order,
      metadata: {
        orderId,
        previousStatus: order.orderStatus,
        previousStoreStatus: order.storeStatus,
        rejectedReason: 'invalid_transition',
      },
      status: 'failed',
    });

    throw orderAcceptanceNotAllowedError({
      orderStatus: order.orderStatus,
      storeStatus: order.storeStatus,
    });
  }

  const acceptedAt = new Date();
  const timelineEvent = buildStoreTimelineEvent({
    actor,
    event: ORDER_AUDIT_EVENTS.STORE_ACCEPTED,
    fromStatus: ORDER_STATUS.PLACED,
    timestamp: acceptedAt,
    toStatus: ORDER_STATUS.ACCEPTED,
  });
  const updated = await transitionOrderByIdForStore(
    orderId,
    storeId,
    {
      orderStatus: ORDER_STATUS.ACCEPTED,
      storeStatus: ORDER_STORE_STATUS.ACCEPTED,
      acceptedAt,
      rejectedAt: null,
      rejectionReason: null,
    },
    timelineEvent,
  );

  if (!updated) {
    throw orderNotFoundError();
  }

  await writeStoreAcceptanceAudit({
    eventType: ORDER_AUDIT_EVENTS.STORE_ACCEPTED,
    actor,
    order: updated,
    metadata: {
      orderId,
      fromStatus: ORDER_STATUS.PLACED,
      toStatus: ORDER_STATUS.ACCEPTED,
      autoAcceptEnabled: isAutoAcceptEnabled(),
    },
    status: 'success',
  });

  await publishOrderNotificationPlaceholderSafely({
    event: ORDER_NOTIFICATION_EVENTS.STORE_ACCEPTED,
    metadata: {
      autoAcceptEnabled: isAutoAcceptEnabled(),
      fromStatus: ORDER_STATUS.PLACED,
      orderId,
      toStatus: ORDER_STATUS.ACCEPTED,
    },
    order: updated,
    timelineEvent,
  });

  return toStoreOrderAcceptanceResponse(updated);
};

export const rejectStoreOrder = async (
  orderId: string,
  input: RejectStoreOrderInput,
  actor: StoreOrderActorContext,
): Promise<StoreOrderAcceptanceResponse> => {
  const reason = input.reason.trim();

  if (!reason) {
    throw orderRejectionReasonRequiredError();
  }

  const storeId = assertStoreScope(actor);
  const order = await findOrderByIdForStore(orderId, storeId);

  if (!order) {
    throw orderAccessForbiddenError();
  }

  if (!isStoreAcceptanceEligible(order)) {
    await writeStoreAcceptanceAudit({
      eventType: ORDER_AUDIT_EVENTS.STORE_REJECTED,
      actor,
      order,
      metadata: {
        orderId,
        previousStatus: order.orderStatus,
        previousStoreStatus: order.storeStatus,
        rejectedReason: 'invalid_transition',
      },
      status: 'failed',
    });

    throw orderAcceptanceNotAllowedError({
      orderStatus: order.orderStatus,
      storeStatus: order.storeStatus,
    });
  }

  const rejectedAt = new Date();
  const timelineEvent = buildStoreTimelineEvent({
    actor,
    event: ORDER_AUDIT_EVENTS.STORE_REJECTED,
    fromStatus: ORDER_STATUS.PLACED,
    reason,
    timestamp: rejectedAt,
    toStatus: ORDER_STATUS.CANCELLED,
  });
  const updated = await transitionOrderByIdForStore(
    orderId,
    storeId,
    {
      orderStatus: ORDER_STATUS.CANCELLED,
      storeStatus: ORDER_STORE_STATUS.REJECTED,
      rejectedAt,
      rejectionReason: reason,
    },
    timelineEvent,
  );

  if (!updated) {
    throw orderNotFoundError();
  }

  await writeStoreAcceptanceAudit({
    eventType: ORDER_AUDIT_EVENTS.STORE_REJECTED,
    actor,
    order: updated,
    metadata: {
      orderId,
      fromStatus: ORDER_STATUS.PLACED,
      toStatus: ORDER_STATUS.CANCELLED,
      reason,
      autoAcceptEnabled: isAutoAcceptEnabled(),
    },
    status: 'success',
  });

  await publishOrderNotificationPlaceholderSafely({
    event: ORDER_NOTIFICATION_EVENTS.STORE_REJECTED,
    metadata: {
      autoAcceptEnabled: isAutoAcceptEnabled(),
      fromStatus: ORDER_STATUS.PLACED,
      orderId,
      toStatus: ORDER_STATUS.CANCELLED,
    },
    order: updated,
    timelineEvent,
  });

  return toStoreOrderAcceptanceResponse(updated);
};

export const startStoreOrderPicking = async (
  orderId: string,
  actor: StoreOrderActorContext,
): Promise<StoreOrderPickingResponse> => {
  const storeId = assertStoreScope(actor);
  const order = await findOrderByIdForStore(orderId, storeId);

  if (!order) {
    throw orderAccessForbiddenError();
  }

  if (!isStartPickingEligible(order)) {
    await writeStoreAcceptanceAudit({
      eventType: ORDER_AUDIT_EVENTS.PICKING_STARTED,
      actor,
      order,
      metadata: {
        orderId,
        previousStatus: order.orderStatus,
        previousStoreStatus: order.storeStatus,
        previousPickerStatus: order.pickerStatus,
        rejectedReason: 'invalid_transition',
      },
      status: 'failed',
    });

    throw orderPickingNotAllowedError({
      orderStatus: order.orderStatus,
      storeStatus: order.storeStatus,
      pickerStatus: order.pickerStatus,
    });
  }

  const startedAt = new Date();
  const assignedPickerId = toObjectIdOrNull(actor.userId);
  const timelineEvent = buildStoreTimelineEvent({
    actor,
    event: ORDER_AUDIT_EVENTS.PICKING_STARTED,
    fromStatus: ORDER_STATUS.ACCEPTED,
    timestamp: startedAt,
    toStatus: ORDER_STATUS.PICKING,
  });
  const updated = await transitionOrderByIdForStore(
    orderId,
    storeId,
    {
      orderStatus: ORDER_STATUS.PICKING,
      pickerStatus: ORDER_PICKER_STATUS.IN_PROGRESS,
      assignedPickerId,
    },
    timelineEvent,
  );

  if (!updated) {
    throw orderNotFoundError();
  }

  await writeStoreAcceptanceAudit({
    eventType: ORDER_AUDIT_EVENTS.PICKING_STARTED,
    actor,
    order: updated,
    metadata: {
      orderId,
      fromStatus: ORDER_STATUS.ACCEPTED,
      toStatus: ORDER_STATUS.PICKING,
      pickerStatus: ORDER_PICKER_STATUS.IN_PROGRESS,
      assignedPickerId: assignedPickerId?.toString() ?? null,
    },
    status: 'success',
  });

  await publishOrderNotificationPlaceholderSafely({
    event: ORDER_NOTIFICATION_EVENTS.PICKING_STARTED,
    metadata: {
      assignedPickerId: assignedPickerId?.toString() ?? null,
      fromStatus: ORDER_STATUS.ACCEPTED,
      orderId,
      pickerStatus: ORDER_PICKER_STATUS.IN_PROGRESS,
      toStatus: ORDER_STATUS.PICKING,
    },
    order: updated,
    timelineEvent,
  });

  return toStoreOrderPickingResponse(updated);
};

export const markStoreOrderItemPicked = async (
  orderId: string,
  itemId: string,
  input: StoreOrderItemPickingInput,
  actor: StoreOrderActorContext,
): Promise<StoreOrderPickingResponse> => {
  const storeId = assertStoreScope(actor);
  const order = await findOrderByIdForStore(orderId, storeId);

  if (!order) {
    throw orderAccessForbiddenError();
  }

  if (!isActivePickingOrder(order)) {
    throw orderPickingNotAllowedError({
      orderStatus: order.orderStatus,
      pickerStatus: order.pickerStatus,
    });
  }

  const updatedItems = applyPickedQuantityToItems(order.items, itemId, input.quantity);
  const updated = await transitionOrderByIdForStore(
    orderId,
    storeId,
    {
      items: updatedItems,
    },
    buildStoreTimelineEvent({
      actor,
      event: ORDER_AUDIT_EVENTS.ITEM_PICKED,
      fromStatus: ORDER_STATUS.PICKING,
      itemId,
      quantity: input.quantity,
      timestamp: new Date(),
      toStatus: ORDER_STATUS.PICKING,
    }),
  );

  if (!updated) {
    throw orderNotFoundError();
  }

  await writeStoreAcceptanceAudit({
    eventType: ORDER_AUDIT_EVENTS.ITEM_PICKED,
    actor,
    order: updated,
    metadata: {
      orderId,
      itemId,
      pickedQuantity: input.quantity,
      orderStatus: ORDER_STATUS.PICKING,
    },
    status: 'success',
  });

  return toStoreOrderPickingResponse(updated);
};

export const markStoreOrderItemMissing = async (
  orderId: string,
  itemId: string,
  input: StoreOrderItemPickingInput,
  actor: StoreOrderActorContext,
): Promise<StoreOrderPickingResponse> => {
  const storeId = assertStoreScope(actor);
  const order = await findOrderByIdForStore(orderId, storeId);

  if (!order) {
    throw orderAccessForbiddenError();
  }

  if (!isActivePickingOrder(order)) {
    throw orderPickingNotAllowedError({
      orderStatus: order.orderStatus,
      pickerStatus: order.pickerStatus,
    });
  }

  const updatedItems = applyMissingQuantityToItems(order.items, itemId, input.quantity);
  const timelineEvent = buildStoreTimelineEvent({
    actor,
    event: ORDER_AUDIT_EVENTS.ITEM_MISSING,
    fromStatus: ORDER_STATUS.PICKING,
    itemId,
    quantity: input.quantity,
    timestamp: new Date(),
    toStatus: ORDER_STATUS.PICKING,
  });
  const updated = await transitionOrderByIdForStore(
    orderId,
    storeId,
    {
      items: updatedItems,
    },
    timelineEvent,
  );

  if (!updated) {
    throw orderNotFoundError();
  }

  await writeStoreAcceptanceAudit({
    eventType: ORDER_AUDIT_EVENTS.ITEM_MISSING,
    actor,
    order: updated,
    metadata: {
      orderId,
      itemId,
      missingQuantity: input.quantity,
      orderStatus: ORDER_STATUS.PICKING,
    },
    status: 'success',
  });

  await publishOrderNotificationPlaceholderSafely({
    event: ORDER_NOTIFICATION_EVENTS.ITEM_MISSING,
    metadata: {
      itemId,
      missingQuantity: input.quantity,
      orderId,
      orderStatus: ORDER_STATUS.PICKING,
    },
    order: updated,
    timelineEvent,
  });

  return toStoreOrderPickingResponse(updated);
};

export const completeStoreOrderPicking = async (
  orderId: string,
  actor: StoreOrderActorContext,
): Promise<StoreOrderPickingResponse> => {
  const storeId = assertStoreScope(actor);
  const order = await findOrderByIdForStore(orderId, storeId);

  if (!order) {
    throw orderAccessForbiddenError();
  }

  if (!isActivePickingOrder(order) || !areAllItemsResolvedForPicking(order.items)) {
    throw orderPickingNotAllowedError({
      orderStatus: order.orderStatus,
      pickerStatus: order.pickerStatus,
      unresolvedItems: order.items.filter((item) => item.pickingStatus === ORDER_ITEM_PICKING_STATUS.PENDING).length,
    });
  }

  const inventoryAdjustment = await adjustOrderInventoryForMissingItems({
    orderId,
    orderNumber: order.orderNumber,
    storeId: order.storeId,
    items: order.items,
    actor,
  });
  const completedAt = new Date();
  const pickingCompletedTimelineEvent = buildStoreTimelineEvent({
    actor,
    event: ORDER_AUDIT_EVENTS.PICKING_COMPLETED,
    fromStatus: ORDER_STATUS.PICKING,
    timestamp: completedAt,
    toStatus: ORDER_STATUS.PICKING,
  });
  const timelineEvent = inventoryAdjustment.adjusted
    ? [
        pickingCompletedTimelineEvent,
        buildStoreTimelineEvent({
          actor,
          event: ORDER_AUDIT_EVENTS.INVENTORY_ADJUSTED,
          fromStatus: ORDER_STATUS.PICKING,
          quantity: inventoryAdjustment.items.reduce((sum, item) => sum + item.missingQuantity, 0),
          reason: 'missing_item_reconciliation',
          timestamp: completedAt,
          toStatus: ORDER_STATUS.PICKING,
        }),
      ]
    : pickingCompletedTimelineEvent;

  const updated = await transitionOrderByIdForStore(
    orderId,
    storeId,
    {
      pickerStatus: ORDER_PICKER_STATUS.COMPLETED,
    },
    timelineEvent,
  );

  if (!updated) {
    throw orderNotFoundError();
  }

  await writeStoreAcceptanceAudit({
    eventType: ORDER_AUDIT_EVENTS.PICKING_COMPLETED,
    actor,
    order: updated,
    metadata: {
      orderId,
      orderStatus: ORDER_STATUS.PICKING,
      pickerStatus: ORDER_PICKER_STATUS.COMPLETED,
      inventoryAdjusted: inventoryAdjustment.adjusted,
      inventoryAdjustedItemCount: inventoryAdjustment.adjustedItemCount,
    },
    status: 'success',
  });

  await publishOrderNotificationPlaceholderSafely({
    event: ORDER_NOTIFICATION_EVENTS.PICKING_COMPLETED,
    metadata: {
      inventoryAdjusted: inventoryAdjustment.adjusted,
      inventoryAdjustedItemCount: inventoryAdjustment.adjustedItemCount,
      orderId,
      orderStatus: ORDER_STATUS.PICKING,
      pickerStatus: ORDER_PICKER_STATUS.COMPLETED,
    },
    order: updated,
    timelineEvent: pickingCompletedTimelineEvent,
  });

  return toStoreOrderPickingResponse(updated);
};

export const startStoreOrderPacking = async (
  orderId: string,
  actor: StoreOrderActorContext,
): Promise<StoreOrderPackingResponse> => {
  const storeId = assertStoreScope(actor);
  const order = await findOrderByIdForStore(orderId, storeId);

  if (!order) {
    throw orderAccessForbiddenError();
  }

  if (!isStartPackingEligible(order)) {
    throw orderPackingNotAllowedError({
      orderStatus: order.orderStatus,
      pickerStatus: order.pickerStatus,
      packingStatus: order.packingStatus,
    });
  }

  const startedAt = new Date();
  const timelineEvent = buildStoreTimelineEvent({
    actor,
    event: ORDER_AUDIT_EVENTS.PACKING_STARTED,
    fromStatus: ORDER_STATUS.PICKING,
    timestamp: startedAt,
    toStatus: ORDER_STATUS.PACKING,
  });
  const updated = await transitionOrderByIdForStore(
    orderId,
    storeId,
    {
      orderStatus: ORDER_STATUS.PACKING,
      packingStatus: ORDER_PACKING_STATUS.IN_PROGRESS,
    },
    timelineEvent,
  );

  if (!updated) {
    throw orderNotFoundError();
  }

  await writeStoreAcceptanceAudit({
    eventType: ORDER_AUDIT_EVENTS.PACKING_STARTED,
    actor,
    order: updated,
    metadata: {
      orderId,
      fromStatus: ORDER_STATUS.PICKING,
      toStatus: ORDER_STATUS.PACKING,
      packingStatus: ORDER_PACKING_STATUS.IN_PROGRESS,
    },
    status: 'success',
  });

  await publishOrderNotificationPlaceholderSafely({
    event: ORDER_NOTIFICATION_EVENTS.PACKING_STARTED,
    metadata: {
      fromStatus: ORDER_STATUS.PICKING,
      orderId,
      packingStatus: ORDER_PACKING_STATUS.IN_PROGRESS,
      toStatus: ORDER_STATUS.PACKING,
    },
    order: updated,
    timelineEvent,
  });

  return toStoreOrderPackingResponse(updated);
};

export const completeStoreOrderPacking = async (
  orderId: string,
  actor: StoreOrderActorContext,
): Promise<StoreOrderPackingResponse> => {
  const storeId = assertStoreScope(actor);
  const order = await findOrderByIdForStore(orderId, storeId);

  if (!order) {
    throw orderAccessForbiddenError();
  }

  if (!isActivePackingOrder(order)) {
    throw orderPackingNotAllowedError({
      orderStatus: order.orderStatus,
      packingStatus: order.packingStatus,
    });
  }

  const completedAt = new Date();
  const timelineEvent = buildStoreTimelineEvent({
    actor,
    event: ORDER_AUDIT_EVENTS.PACKING_COMPLETED,
    fromStatus: ORDER_STATUS.PACKING,
    timestamp: completedAt,
    toStatus: ORDER_STATUS.PACKING,
  });
  const updated = await transitionOrderByIdForStore(
    orderId,
    storeId,
    {
      packingStatus: ORDER_PACKING_STATUS.COMPLETED,
    },
    timelineEvent,
  );

  if (!updated) {
    throw orderNotFoundError();
  }

  await writeStoreAcceptanceAudit({
    eventType: ORDER_AUDIT_EVENTS.PACKING_COMPLETED,
    actor,
    order: updated,
    metadata: {
      orderId,
      orderStatus: ORDER_STATUS.PACKING,
      packingStatus: ORDER_PACKING_STATUS.COMPLETED,
    },
    status: 'success',
  });

  await publishOrderNotificationPlaceholderSafely({
    event: ORDER_NOTIFICATION_EVENTS.PACKING_COMPLETED,
    metadata: {
      orderId,
      orderStatus: ORDER_STATUS.PACKING,
      packingStatus: ORDER_PACKING_STATUS.COMPLETED,
    },
    order: updated,
    timelineEvent,
  });

  return toStoreOrderPackingResponse(updated);
};

export const markStoreOrderReadyForPickup = async (
  orderId: string,
  actor: StoreOrderActorContext,
): Promise<StoreOrderPackingResponse> => {
  const storeId = assertStoreScope(actor);
  const order = await findOrderByIdForStore(orderId, storeId);

  if (!order) {
    throw orderAccessForbiddenError();
  }

  if (!isReadyForPickupEligible(order)) {
    throw orderPackingNotAllowedError({
      orderStatus: order.orderStatus,
      packingStatus: order.packingStatus,
    });
  }

  const readyForPickupAt = new Date();
  const timelineEvent = buildStoreTimelineEvent({
    actor,
    event: ORDER_AUDIT_EVENTS.READY_FOR_PICKUP,
    fromStatus: ORDER_STATUS.PACKING,
    timestamp: readyForPickupAt,
    toStatus: ORDER_STATUS.READY_FOR_PICKUP,
  });
  const updated = await transitionOrderByIdForStore(
    orderId,
    storeId,
    {
      orderStatus: ORDER_STATUS.READY_FOR_PICKUP,
      packingStatus: ORDER_PACKING_STATUS.READY_FOR_PICKUP,
      readyForPickupAt,
    },
    timelineEvent,
  );

  if (!updated) {
    throw orderNotFoundError();
  }

  await writeStoreAcceptanceAudit({
    eventType: ORDER_AUDIT_EVENTS.READY_FOR_PICKUP,
    actor,
    order: updated,
    metadata: {
      orderId,
      fromStatus: ORDER_STATUS.PACKING,
      toStatus: ORDER_STATUS.READY_FOR_PICKUP,
      packingStatus: ORDER_PACKING_STATUS.READY_FOR_PICKUP,
      readyForPickupAt: readyForPickupAt.toISOString(),
    },
    status: 'success',
  });

  await publishOrderNotificationPlaceholderSafely({
    event: ORDER_NOTIFICATION_EVENTS.READY_FOR_PICKUP,
    metadata: {
      fromStatus: ORDER_STATUS.PACKING,
      orderId,
      packingStatus: ORDER_PACKING_STATUS.READY_FOR_PICKUP,
      readyForPickupAt: readyForPickupAt.toISOString(),
      toStatus: ORDER_STATUS.READY_FOR_PICKUP,
    },
    order: updated,
    timelineEvent,
  });

  // Try to initialize delivery and run matching engine dispatch
  try {
    const delivery = await initializeDeliveryForOrder(orderId);
    if (delivery) {
      // Fire match engine dispatch synchronously or asynchronously
      await runDispatchEngineForOrder(delivery._id);
    }
  } catch (error) {
    console.warn(`Failed to initialize or run dispatch for order ${orderId}:`, error);
  }

  return toStoreOrderPackingResponse(updated);
};
