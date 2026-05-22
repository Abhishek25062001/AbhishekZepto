import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { afterEach, beforeEach, test } from 'node:test';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { CHECKOUT_SESSION_STATUS } from '../../checkout/constants/checkout-session-status.constant';
import type { CheckoutSessionRecord } from '../../checkout/types/checkout.types';
import { PAYMENT_STATUS } from '../../payment/constants/payment-status.constant';
import type { PaymentRecord } from '../../payment/types/payment.types';
import * as checkoutRepositoryModule from '../../checkout/repositories/checkout-session.repository';
import * as checkoutLockModule from '../../checkout/utils/checkout-inventory-lock.util';
import * as cartClearModule from '../utils/order-cart-clear.util';
import * as lockConfirmModule from '../utils/order-inventory-lock.util';
import * as paymentRepositoryModule from '../../payment/repositories/payment.repository';
import * as orderRepositoryModule from '../repositories/order.repository';
import * as auditModule from '../../audit/services/audit-log.service';
import * as inventoryAdjustmentModule from './order-inventory-adjustment.service';
import * as cancellationInventoryModule from './order-cancellation-inventory.service';
import * as notificationPlaceholderModule from './order-notification-placeholder.service';
import type { PublishOrderNotificationPlaceholderInput } from './order-notification-placeholder.service';
import * as deliveryAssignmentModule from '../../delivery/services/delivery-assignment.service';
import {
  acceptStoreOrder,
  cancelAdminOrder,
  cancelCustomerOrder,
  cancelStoreOrder,
  completeStoreOrderPacking,
  completeStoreOrderPicking,
  getOrderForAdmin,
  getOrderLifecycleForCustomer,
  getOrderStateForCustomer,
  getOrderForStore,
  getOrderTimelineForAdmin,
  listOrdersForAdmin,
  listOrdersForStore,
  markStoreOrderItemMissing,
  markStoreOrderItemPicked,
  markStoreOrderReadyForPickup,
  placeOrderFromPayment,
  rejectStoreOrder,
  startStoreOrderPacking,
  startStoreOrderPicking,
  updateAdminOrderStatus,
} from './order.service';

const checkoutRepository = checkoutRepositoryModule as unknown as {
  findCheckoutSessionByIdForCustomer: typeof checkoutRepositoryModule.findCheckoutSessionByIdForCustomer;
  updateCheckoutSessionById: typeof checkoutRepositoryModule.updateCheckoutSessionById;
};

const paymentRepository = paymentRepositoryModule as unknown as {
  findPaymentByIdForCustomer: typeof paymentRepositoryModule.findPaymentByIdForCustomer;
  updatePaymentById: typeof paymentRepositoryModule.updatePaymentById;
};

const orderRepository = orderRepositoryModule as unknown as {
  findOrderByPaymentId: typeof orderRepositoryModule.findOrderByPaymentId;
  findOrderById: typeof orderRepositoryModule.findOrderById;
  findOrderByIdForCustomer: typeof orderRepositoryModule.findOrderByIdForCustomer;
  findOrderByIdForStore: typeof orderRepositoryModule.findOrderByIdForStore;
  listOrdersByAdmin: typeof orderRepositoryModule.listOrdersByAdmin;
  listOrdersByStore: typeof orderRepositoryModule.listOrdersByStore;
  createOrder: typeof orderRepositoryModule.createOrder;
  updateOrderById: typeof orderRepositoryModule.updateOrderById;
  transitionOrderById: typeof orderRepositoryModule.transitionOrderById;
  transitionOrderByIdForCustomer: typeof orderRepositoryModule.transitionOrderByIdForCustomer;
  transitionOrderByIdForStore: typeof orderRepositoryModule.transitionOrderByIdForStore;
};

const lockConfirm = lockConfirmModule as unknown as {
  confirmCheckoutLocksForOrder: typeof lockConfirmModule.confirmCheckoutLocksForOrder;
};

const cartClear = cartClearModule as unknown as {
  clearCartAfterOrderPlacement: typeof cartClearModule.clearCartAfterOrderPlacement;
};

const checkoutLock = checkoutLockModule as unknown as {
  releaseCheckoutLocks: typeof checkoutLockModule.releaseCheckoutLocks;
};

const auditLogService = auditModule as unknown as {
  writeAuditLog: typeof auditModule.writeAuditLog;
};

const inventoryAdjustmentService = inventoryAdjustmentModule as unknown as {
  adjustOrderInventoryForMissingItems: typeof inventoryAdjustmentModule.adjustOrderInventoryForMissingItems;
};

const cancellationInventoryService = cancellationInventoryModule as unknown as {
  applyCancellationInventoryImpact: typeof cancellationInventoryModule.applyCancellationInventoryImpact;
};

const notificationPlaceholderService = notificationPlaceholderModule as unknown as {
  publishOrderNotificationPlaceholders: typeof notificationPlaceholderModule.publishOrderNotificationPlaceholders;
};

const deliveryAssignmentService = deliveryAssignmentModule as unknown as {
  initializeDeliveryForOrder: typeof deliveryAssignmentModule.initializeDeliveryForOrder;
  runDispatchEngineForOrder: typeof deliveryAssignmentModule.runDispatchEngineForOrder;
};

const customerId = new Types.ObjectId().toString();
const paymentId = new Types.ObjectId();
const sessionId = new Types.ObjectId();
const orderId = new Types.ObjectId();
const storeId = new Types.ObjectId();
const storeProductId = new Types.ObjectId();

const buildSession = (): CheckoutSessionRecord & { _id: Types.ObjectId } => ({
  _id: sessionId,
  customerId: new Types.ObjectId(customerId),
  cartId: new Types.ObjectId(),
  storeId,
  addressId: new Types.ObjectId(),
  addressSnapshot: {
    label: 'Home',
    line1: 'Line 1',
    line2: null,
    landmark: null,
    city: 'City',
    state: null,
    postalCode: null,
    country: 'IN',
    latitude: 0,
    longitude: 0,
  },
  status: CHECKOUT_SESSION_STATUS.INITIATED,
  lockTokens: ['lk_1'],
  reservationExpiresAt: new Date(Date.now() + 60_000),
  summarySnapshot: {
    currency: 'INR',
    itemCount: 1,
    subtotal: 250,
    discountAmount: 0,
    taxAmount: 0,
    deliveryFeeAmount: 0,
    grandTotal: 250,
    items: [
      {
        itemId: new Types.ObjectId().toString(),
        productId: new Types.ObjectId().toString(),
        variantId: new Types.ObjectId().toString(),
        storeProductId: storeProductId.toString(),
        productName: 'Item',
        quantity: 1,
        unitPrice: 250,
        lineTotal: 250,
      },
    ],
  },
  paymentId: paymentId,
  orderId: null,
  idempotencyKey: null,
  failureReason: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const buildPayment = (): PaymentRecord & { _id: Types.ObjectId } => ({
  _id: paymentId,
  customerId: new Types.ObjectId(customerId),
  checkoutSessionId: sessionId,
  orderId: null,
  gateway: 'razorpay',
  gatewayOrderId: 'order_test',
  gatewayPaymentId: 'pay_test',
  amount: 25000,
  currency: 'INR',
  status: PAYMENT_STATUS.PAID,
  idempotencyKey: 'idem',
  signatureVerified: true,
  webhookReceivedAt: null,
  failureCode: null,
  metadata: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const buildOrder = () => ({
  _id: orderId,
  orderNumber: 'ORD-TEST',
  customerId: new Types.ObjectId(customerId),
  storeId,
  checkoutSessionId: sessionId,
  paymentId: paymentId,
  cartId: new Types.ObjectId(),
  addressSnapshot: buildSession().addressSnapshot,
  items: [],
  subtotal: 250,
  taxAmount: 0,
  deliveryFeeAmount: 0,
  discountAmount: 0,
  grandTotal: 250,
  currency: 'INR',
  paymentStatus: 'paid' as const,
  orderStatus: 'placed' as const,
  storeStatus: 'pending_acceptance' as const,
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
  slaStatus: 'on_track' as const,
  slaBreachedStage: null,
  timeline: [],
  inventoryConfirmed: true,
  placedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
});

const buildOrderItem = (quantity = 2) => ({
  productId: new Types.ObjectId(),
  variantId: new Types.ObjectId(),
  storeProductId,
  quantity,
  unitPrice: 125,
  lineTotal: 250,
  productName: 'Item',
  pickedQuantity: 0,
  missingQuantity: 0,
  pickingStatus: 'pending' as const,
});

beforeEach(() => {
  auditLogService.writeAuditLog = async () => undefined;
  cancellationInventoryService.applyCancellationInventoryImpact = async () => ({
    movementCount: 1,
    restockedQuantity: 1,
    reconciledMissingItems: false,
  });
  lockConfirm.confirmCheckoutLocksForOrder = async () => undefined;
  cartClear.clearCartAfterOrderPlacement = async () => undefined;
  checkoutLock.releaseCheckoutLocks = async () => undefined;
  notificationPlaceholderService.publishOrderNotificationPlaceholders = async () => [];
  deliveryAssignmentService.initializeDeliveryForOrder = async () => null;
  deliveryAssignmentService.runDispatchEngineForOrder = async () => null;
});

afterEach(() => {
  auditLogService.writeAuditLog = auditModule.writeAuditLog;
  inventoryAdjustmentService.adjustOrderInventoryForMissingItems = inventoryAdjustmentModule.adjustOrderInventoryForMissingItems;
  cancellationInventoryService.applyCancellationInventoryImpact = cancellationInventoryModule.applyCancellationInventoryImpact;
  notificationPlaceholderService.publishOrderNotificationPlaceholders =
    notificationPlaceholderModule.publishOrderNotificationPlaceholders;
  deliveryAssignmentService.initializeDeliveryForOrder = deliveryAssignmentModule.initializeDeliveryForOrder;
  deliveryAssignmentService.runDispatchEngineForOrder = deliveryAssignmentModule.runDispatchEngineForOrder;
});

test('placeOrderFromPayment creates order and completes checkout', async () => {
  paymentRepository.findPaymentByIdForCustomer = async () => buildPayment();
  orderRepository.findOrderByPaymentId = async () => null;
  checkoutRepository.findCheckoutSessionByIdForCustomer = async () => buildSession();
  orderRepository.createOrder = async () => buildOrder() as never;
  orderRepository.updateOrderById = async () => buildOrder() as never;
  orderRepository.findOrderByIdForCustomer = async () => buildOrder() as never;
  checkoutRepository.updateCheckoutSessionById = async () => buildSession();
  paymentRepository.updatePaymentById = async () => buildPayment();

  const result = await placeOrderFromPayment(customerId, { paymentId: paymentId.toString() });

  assert.equal(result.orderId, orderId.toString());
  assert.equal(result.orderStatus, 'placed');
});

test('placeOrderFromPayment returns existing order for paymentId', async () => {
  const existing = buildOrder();
  paymentRepository.findPaymentByIdForCustomer = async () => buildPayment();
  orderRepository.findOrderByPaymentId = async () => existing as never;

  const result = await placeOrderFromPayment(customerId, { paymentId: paymentId.toString() });

  assert.equal(result.orderId, orderId.toString());
});

test('placeOrderFromPayment rejects unpaid payment', async () => {
  paymentRepository.findPaymentByIdForCustomer = async () => ({
    ...buildPayment(),
    status: PAYMENT_STATUS.CREATED,
    signatureVerified: false,
  });
  orderRepository.findOrderByPaymentId = async () => null;

  await assert.rejects(
    () => placeOrderFromPayment(customerId, { paymentId: paymentId.toString() }),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.errorCode, ERROR_CODES.PAYMENT_VERIFICATION_FAILED);
      return true;
    },
  );
});

test('getOrderStateForCustomer returns customer-safe current state', async () => {
  orderRepository.findOrderByIdForCustomer = async () => ({
    ...buildOrder(),
    acceptedAt: new Date('2026-05-21T10:00:00.000Z'),
    orderStatus: 'accepted',
    storeStatus: 'accepted',
  }) as never;

  const result = await getOrderStateForCustomer(customerId, orderId.toString());

  assert.equal(result.orderStatus, 'accepted');
  assert.equal(result.storeStatus, 'accepted');
  assert.equal(result.acceptedAt, '2026-05-21T10:00:00.000Z');
  assert.equal(result.canCustomerCancel, false);
});

test('getOrderLifecycleForCustomer returns chronological customer-safe timeline', async () => {
  orderRepository.findOrderByIdForCustomer = async () => ({
    ...buildOrder(),
    timeline: [
      {
        event: 'order.picking.started',
        fromStatus: 'accepted',
        toStatus: 'picking',
        actorId: new Types.ObjectId(),
        actorType: 'store',
        actorRole: 'store_manager',
        reason: null,
        createdAt: new Date('2026-05-21T10:02:00.000Z'),
      },
      {
        event: 'order.store.accepted',
        fromStatus: 'placed',
        toStatus: 'accepted',
        actorId: new Types.ObjectId(),
        actorType: 'store',
        actorRole: 'store_manager',
        reason: null,
        createdAt: new Date('2026-05-21T10:01:00.000Z'),
      },
    ],
  }) as never;

  const result = await getOrderLifecycleForCustomer(customerId, orderId.toString());

  assert.deepEqual(result, [
    {
      event: 'order.store.accepted',
      fromStatus: 'placed',
      toStatus: 'accepted',
      reason: null,
      createdAt: '2026-05-21T10:01:00.000Z',
    },
    {
      event: 'order.picking.started',
      fromStatus: 'accepted',
      toStatus: 'picking',
      reason: null,
      createdAt: '2026-05-21T10:02:00.000Z',
    },
  ]);
});

test('placeOrderFromPayment releases locks on failure', async () => {
  let released = false;

  paymentRepository.findPaymentByIdForCustomer = async () => buildPayment();
  orderRepository.findOrderByPaymentId = async () => null;
  checkoutRepository.findCheckoutSessionByIdForCustomer = async () => buildSession();
  orderRepository.createOrder = async () => {
    throw new Error('create failed');
  };
  checkoutLock.releaseCheckoutLocks = async () => {
    released = true;
  };

  await assert.rejects(
    () => placeOrderFromPayment(customerId, { paymentId: paymentId.toString() }),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.errorCode, ERROR_CODES.ORDER_CREATION_FAILED);
      return true;
    },
  );

  assert.equal(released, true);
});

test('cancelCustomerOrder cancels own placed order', async () => {
  const cancelledAt = new Date();
  let inventoryCalled = false;
  let capturedTimelineEvent: unknown = null;
  let capturedPayload: unknown = null;

  orderRepository.findOrderByIdForCustomer = async () => buildOrder() as never;
  cancellationInventoryService.applyCancellationInventoryImpact = async () => {
    inventoryCalled = true;
    return {
      movementCount: 1,
      restockedQuantity: 1,
      reconciledMissingItems: false,
    };
  };
  orderRepository.transitionOrderByIdForCustomer = async (_orderId, _customerId, payload, timelineEvent) => {
    capturedPayload = payload;
    capturedTimelineEvent = timelineEvent;
    return {
      ...buildOrder(),
      orderStatus: 'cancelled',
      cancellationReason: 'Changed plans',
      cancelledAt,
      cancelledBy: payload.cancelledBy,
      refundReviewRequired: true,
      timeline: [timelineEvent],
    } as never;
  };

  const result = await cancelCustomerOrder(
    orderId.toString(),
    customerId,
    { reason: 'Changed plans' },
    { requestId: null, traceId: null },
  );

  assert.equal(result.orderStatus, 'cancelled');
  assert.equal(result.cancellationReason, 'Changed plans');
  assert.equal(result.cancelledBy?.actorType, 'customer');
  assert.equal(result.refundReviewRequired, true);
  assert.equal(inventoryCalled, true);
  assert.equal((capturedPayload as { orderStatus: string }).orderStatus, 'cancelled');
  assert.equal((capturedTimelineEvent as { event: string }).event, 'order.cancelled');
  assert.equal((capturedTimelineEvent as { reason: string }).reason, 'Changed plans');
});

test('cancelCustomerOrder rejects accepted orders', async () => {
  orderRepository.findOrderByIdForCustomer = async () =>
    ({
      ...buildOrder(),
      orderStatus: 'accepted',
    }) as never;

  await assert.rejects(
    () =>
      cancelCustomerOrder(
        orderId.toString(),
        customerId,
        { reason: 'Changed plans' },
        { requestId: null, traceId: null },
      ),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.errorCode, ERROR_CODES.ORDER_CANCELLATION_NOT_ALLOWED);
      return true;
    },
  );
});

test('cancelStoreOrder cancels assigned active preparation order', async () => {
  let inventoryCalled = false;
  let capturedTimelineEvent: unknown = null;

  orderRepository.findOrderByIdForStore = async () =>
    ({
      ...buildOrder(),
      orderStatus: 'picking',
      storeStatus: 'accepted',
      pickerStatus: 'in_progress',
    }) as never;
  cancellationInventoryService.applyCancellationInventoryImpact = async () => {
    inventoryCalled = true;
    return {
      movementCount: 1,
      restockedQuantity: 1,
      reconciledMissingItems: true,
    };
  };
  orderRepository.transitionOrderByIdForStore = async (_orderId, _storeId, payload, timelineEvent) => {
    capturedTimelineEvent = timelineEvent;
    return {
      ...buildOrder(),
      orderStatus: 'cancelled',
      storeStatus: 'accepted',
      pickerStatus: 'in_progress',
      cancellationReason: payload.cancellationReason,
      cancelledAt: payload.cancelledAt,
      cancelledBy: payload.cancelledBy,
      refundReviewRequired: payload.refundReviewRequired,
      timeline: [timelineEvent],
    } as never;
  };

  const result = await cancelStoreOrder(
    orderId.toString(),
    { reason: 'Store cannot fulfill' },
    {
      requestId: null,
      traceId: null,
      userId: new Types.ObjectId().toString(),
      role: 'store_manager',
      storeId: storeId.toString(),
    },
  );

  assert.equal(result.orderStatus, 'cancelled');
  assert.equal(result.cancellationReason, 'Store cannot fulfill');
  assert.equal(result.cancelledBy?.actorType, 'store');
  assert.equal(inventoryCalled, true);
  assert.equal((capturedTimelineEvent as { event: string }).event, 'order.cancelled');
});

test('cancelStoreOrder rejects ready-for-pickup orders', async () => {
  orderRepository.findOrderByIdForStore = async () =>
    ({
      ...buildOrder(),
      orderStatus: 'ready_for_pickup',
    }) as never;

  await assert.rejects(
    () =>
      cancelStoreOrder(
        orderId.toString(),
        { reason: 'Store cannot fulfill' },
        {
          requestId: null,
          traceId: null,
          userId: new Types.ObjectId().toString(),
          role: 'store_manager',
          storeId: storeId.toString(),
        },
      ),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.errorCode, ERROR_CODES.ORDER_CANCELLATION_NOT_ALLOWED);
      return true;
    },
  );
});

test('cancelStoreOrder denies orders outside actor store scope', async () => {
  orderRepository.findOrderByIdForStore = async () => null;

  await assert.rejects(
    () =>
      cancelStoreOrder(
        orderId.toString(),
        { reason: 'Store cannot fulfill' },
        {
          requestId: null,
          traceId: null,
          userId: new Types.ObjectId().toString(),
          role: 'store_manager',
          storeId: new Types.ObjectId().toString(),
        },
      ),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.errorCode, ERROR_CODES.ORDER_ACCESS_FORBIDDEN);
      return true;
    },
  );
});

test('listOrdersForStore returns store-scoped order summaries', async () => {
  let capturedStoreId: string | null = null;
  let capturedOptions: unknown = null;

  orderRepository.listOrdersByStore = async (storeIdArg, options) => {
    capturedStoreId = storeIdArg;
    capturedOptions = options;
    return {
      orders: [buildOrder() as never],
      total: 1,
    };
  };

  const result = await listOrdersForStore(
    {
      page: 2,
      limit: 10,
      status: 'placed',
      storeStatus: 'pending_acceptance',
      paymentStatus: 'paid',
    },
    {
      requestId: null,
      traceId: null,
      userId: new Types.ObjectId().toString(),
      role: 'store_manager',
      storeId: storeId.toString(),
    },
  );

  assert.equal(capturedStoreId, storeId.toString());
  assert.deepEqual(capturedOptions, {
    page: 2,
    limit: 10,
    status: 'placed',
    storeStatus: 'pending_acceptance',
    paymentStatus: 'paid',
  });
  assert.equal(result.total, 1);
  const [firstOrder] = result.orders;
  assert.ok(firstOrder);
  assert.equal(firstOrder.storeId, storeId.toString());
  assert.equal(firstOrder.paymentStatus, 'paid');
});

test('listOrdersForStore requires actor store scope', async () => {
  await assert.rejects(
    () =>
      listOrdersForStore(
        {},
        {
          requestId: null,
          traceId: null,
          userId: new Types.ObjectId().toString(),
          role: 'store_manager',
          storeId: null,
        },
      ),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.errorCode, ERROR_CODES.ORDER_SCOPE_REQUIRED);
      return true;
    },
  );
});

test('listOrdersForAdmin returns filtered admin order summaries', async () => {
  let capturedOptions: unknown = null;

  orderRepository.listOrdersByAdmin = async (options) => {
    capturedOptions = options;
    return {
      orders: [buildOrder() as never],
      total: 1,
    };
  };

  const fromDate = new Date('2026-05-01T00:00:00.000Z');
  const toDate = new Date('2026-05-21T00:00:00.000Z');
  const result = await listOrdersForAdmin({
    page: 3,
    limit: 15,
    status: 'accepted',
    storeStatus: 'accepted',
    paymentStatus: 'paid',
    storeId: storeId.toString(),
    customerId,
    fromDate,
    toDate,
    sort: 'createdAt_asc',
  });

  assert.deepEqual(capturedOptions, {
    page: 3,
    limit: 15,
    status: 'accepted',
    storeStatus: 'accepted',
    paymentStatus: 'paid',
    storeId: storeId.toString(),
    customerId,
    fromDate,
    toDate,
    sort: 'createdAt_asc',
  });
  assert.equal(result.total, 1);
  const [firstOrder] = result.orders;
  assert.ok(firstOrder);
  assert.equal(firstOrder.customerId, customerId);
  assert.equal(firstOrder.cityId, null);
});

test('getOrderForStore returns store-scoped order detail', async () => {
  orderRepository.findOrderByIdForStore = async () => buildOrder() as never;

  const result = await getOrderForStore(orderId.toString(), {
    requestId: null,
    traceId: null,
    userId: new Types.ObjectId().toString(),
    role: 'store_manager',
    storeId: storeId.toString(),
  });

  assert.equal(result.orderId, orderId.toString());
  assert.equal(result.storeId, storeId.toString());
  assert.equal(result.customerId, customerId);
  assert.deepEqual(result.timeline, []);
});

test('getOrderForAdmin returns admin order detail', async () => {
  orderRepository.findOrderById = async () => buildOrder() as never;

  const result = await getOrderForAdmin(orderId.toString());

  assert.equal(result.orderId, orderId.toString());
  assert.equal(result.customerId, customerId);
  assert.equal(result.storeId, storeId.toString());
  assert.equal(result.cityId, null);
  assert.deepEqual(result.timeline, []);
});

test('getOrderTimelineForAdmin returns chronological admin timeline', async () => {
  orderRepository.findOrderById = async () =>
    ({
      ...buildOrder(),
      timeline: [
        {
          event: 'order.packing.started',
          fromStatus: 'picking',
          toStatus: 'packing',
          actorId: null,
          actorType: 'store',
          actorRole: 'store_manager',
          reason: null,
          createdAt: new Date('2026-05-21T10:00:00.000Z'),
        },
        {
          event: 'order.store.accepted',
          fromStatus: 'placed',
          toStatus: 'accepted',
          actorId: null,
          actorType: 'store',
          actorRole: 'store_manager',
          reason: null,
          createdAt: new Date('2026-05-21T09:00:00.000Z'),
        },
      ],
    }) as never;

  const result = await getOrderTimelineForAdmin(orderId.toString());

  assert.equal(result.length, 2);
  assert.equal(result[0]?.event, 'order.store.accepted');
  assert.equal(result[1]?.event, 'order.packing.started');
});

test('updateAdminOrderStatus updates allowed admin transition and writes audit', async () => {
  const adminUserId = new Types.ObjectId().toString();
  let capturedPayload: unknown = null;
  let capturedTimelineEvent: unknown = null;
  let auditCalled = false;

  orderRepository.findOrderById = async () => buildOrder() as never;
  orderRepository.transitionOrderById = async (_orderId, payload, timelineEvent) => {
    capturedPayload = payload;
    capturedTimelineEvent = timelineEvent;

    return {
      ...buildOrder(),
      ...payload,
      timeline: [timelineEvent],
    } as never;
  };
  auditLogService.writeAuditLog = async () => {
    auditCalled = true;
  };

  const result = await updateAdminOrderStatus(
    orderId.toString(),
    { status: 'accepted', reason: 'Manual acceptance' },
    {
      requestId: null,
      traceId: null,
      userId: adminUserId,
      role: 'operations_admin',
    },
  );

  assert.equal(result.orderStatus, 'accepted');
  assert.equal(result.storeStatus, 'accepted');
  assert.equal((capturedPayload as { orderStatus: string }).orderStatus, 'accepted');
  assert.equal((capturedTimelineEvent as { event: string }).event, 'order.status.updated');
  assert.equal((capturedTimelineEvent as { reason: string }).reason, 'Manual acceptance');
  assert.equal(auditCalled, true);
});

test('updateAdminOrderStatus rejects invalid admin transition', async () => {
  orderRepository.findOrderById = async () =>
    ({
      ...buildOrder(),
      orderStatus: 'ready_for_pickup',
    }) as never;

  await assert.rejects(
    () =>
      updateAdminOrderStatus(
        orderId.toString(),
        { status: 'accepted' },
        {
          requestId: null,
          traceId: null,
          userId: new Types.ObjectId().toString(),
          role: 'operations_admin',
        },
      ),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.errorCode, ERROR_CODES.ORDER_STATUS_UPDATE_NOT_ALLOWED);
      return true;
    },
  );
});

test('getOrderForStore denies orders outside actor store scope', async () => {
  orderRepository.findOrderByIdForStore = async () => null;

  await assert.rejects(
    () =>
      getOrderForStore(orderId.toString(), {
        requestId: null,
        traceId: null,
        userId: new Types.ObjectId().toString(),
        role: 'store_manager',
        storeId: new Types.ObjectId().toString(),
      }),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.errorCode, ERROR_CODES.ORDER_ACCESS_FORBIDDEN);
      return true;
    },
  );
});

test('cancelAdminOrder cancels eligible active order', async () => {
  const adminUserId = new Types.ObjectId().toString();
  let inventoryCalled = false;
  let capturedTimelineEvent: unknown = null;

  orderRepository.findOrderById = async () =>
    ({
      ...buildOrder(),
      orderStatus: 'packing',
      storeStatus: 'accepted',
      packingStatus: 'in_progress',
    }) as never;
  cancellationInventoryService.applyCancellationInventoryImpact = async () => {
    inventoryCalled = true;
    return {
      movementCount: 1,
      restockedQuantity: 1,
      reconciledMissingItems: true,
    };
  };
  orderRepository.transitionOrderById = async (_orderId, payload, timelineEvent) => {
    capturedTimelineEvent = timelineEvent;
    return {
      ...buildOrder(),
      orderStatus: 'cancelled',
      storeStatus: 'accepted',
      packingStatus: 'in_progress',
      cancellationReason: payload.cancellationReason,
      cancelledAt: payload.cancelledAt,
      cancelledBy: payload.cancelledBy,
      refundReviewRequired: payload.refundReviewRequired,
      timeline: [timelineEvent],
    } as never;
  };

  const result = await cancelAdminOrder(
    orderId.toString(),
    { reason: 'Admin support cancellation' },
    {
      requestId: null,
      traceId: null,
      userId: adminUserId,
      role: 'operations_admin',
    },
  );

  assert.equal(result.orderStatus, 'cancelled');
  assert.equal(result.cancellationReason, 'Admin support cancellation');
  assert.equal(result.cancelledBy?.actorType, 'admin');
  assert.equal(result.refundReviewRequired, true);
  assert.equal(inventoryCalled, true);
  assert.equal((capturedTimelineEvent as { event: string }).event, 'order.cancelled');
  assert.equal((capturedTimelineEvent as { actorType: string }).actorType, 'admin');
});

test('cancelAdminOrder rejects ready-for-pickup orders', async () => {
  orderRepository.findOrderById = async () =>
    ({
      ...buildOrder(),
      orderStatus: 'ready_for_pickup',
    }) as never;

  await assert.rejects(
    () =>
      cancelAdminOrder(
        orderId.toString(),
        { reason: 'Admin support cancellation' },
        {
          requestId: null,
          traceId: null,
          userId: new Types.ObjectId().toString(),
          role: 'operations_admin',
        },
      ),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.errorCode, ERROR_CODES.ORDER_CANCELLATION_NOT_ALLOWED);
      return true;
    },
  );
});

test('acceptStoreOrder accepts a placed store-scoped order', async () => {
  const actorUserId = new Types.ObjectId().toString();
  let capturedTimelineEvent: unknown = null;
  const capturedNotifications: PublishOrderNotificationPlaceholderInput[] = [];

  orderRepository.findOrderByIdForStore = async () => buildOrder() as never;
  notificationPlaceholderService.publishOrderNotificationPlaceholders = async (input) => {
    capturedNotifications.push(input);
    return [];
  };
  orderRepository.transitionOrderByIdForStore = async (_orderId, _storeId, payload, timelineEvent) => {
    capturedTimelineEvent = timelineEvent;
    return {
      ...buildOrder(),
      orderStatus: 'accepted',
      storeStatus: 'accepted',
      acceptedAt: payload.acceptedAt,
      timeline: [timelineEvent],
    } as never;
  };

  const result = await acceptStoreOrder(orderId.toString(), {
    requestId: null,
    traceId: null,
    userId: actorUserId,
    role: 'store_manager',
    storeId: storeId.toString(),
  });

  assert.equal(result.orderStatus, 'accepted');
  assert.equal(result.storeStatus, 'accepted');
  assert.equal(result.autoAcceptEnabled, false);
  assert.equal((capturedTimelineEvent as { event: string }).event, 'order.store.accepted');
  assert.equal((capturedTimelineEvent as { fromStatus: string }).fromStatus, 'placed');
  assert.equal((capturedTimelineEvent as { toStatus: string }).toStatus, 'accepted');
  assert.equal((capturedTimelineEvent as { actorId: Types.ObjectId }).actorId.toString(), actorUserId);
  assert.equal((capturedTimelineEvent as { actorType: string }).actorType, 'store');
  assert.equal((capturedTimelineEvent as { actorRole: string }).actorRole, 'store_manager');
  assert.equal((capturedTimelineEvent as { reason: string | null }).reason, null);
  assert.equal((capturedTimelineEvent as { createdAt: Date }).createdAt.getTime(), new Date(result.acceptedAt ?? '').getTime());
  const [capturedNotification] = capturedNotifications;
  assert.ok(capturedNotification);
  assert.equal(capturedNotification.event, 'order.store.accepted');
  assert.equal(capturedNotification.order._id.toString(), orderId.toString());
  assert.equal(capturedNotification.metadata?.toStatus, 'accepted');
  assert.equal(capturedNotification.timelineEvent?.actorType, 'store');
});

test('acceptStoreOrder rejects non-placed orders', async () => {
  orderRepository.findOrderByIdForStore = async () =>
    ({
      ...buildOrder(),
      orderStatus: 'accepted',
      storeStatus: 'accepted',
    }) as never;

  await assert.rejects(
    () =>
      acceptStoreOrder(orderId.toString(), {
        requestId: null,
        traceId: null,
        userId: new Types.ObjectId().toString(),
        role: 'store_manager',
        storeId: storeId.toString(),
      }),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.errorCode, ERROR_CODES.ORDER_ACCEPTANCE_NOT_ALLOWED);
      return true;
    },
  );
});

test('acceptStoreOrder does not block acceptance when notification placeholder publishing fails', async () => {
  orderRepository.findOrderByIdForStore = async () => buildOrder() as never;
  notificationPlaceholderService.publishOrderNotificationPlaceholders = async () => {
    throw new Error('placeholder failed');
  };
  orderRepository.transitionOrderByIdForStore = async (_orderId, _storeId, payload, timelineEvent) =>
    ({
      ...buildOrder(),
      orderStatus: 'accepted',
      storeStatus: 'accepted',
      acceptedAt: payload.acceptedAt,
      timeline: [timelineEvent],
    }) as never;

  const result = await acceptStoreOrder(orderId.toString(), {
    requestId: null,
    traceId: null,
    userId: new Types.ObjectId().toString(),
    role: 'store_manager',
    storeId: storeId.toString(),
  });

  assert.equal(result.orderStatus, 'accepted');
  assert.equal(result.storeStatus, 'accepted');
});

test('acceptStoreOrder rejects orders outside pending store acceptance', async () => {
  orderRepository.findOrderByIdForStore = async () =>
    ({
      ...buildOrder(),
      storeStatus: 'accepted',
    }) as never;

  await assert.rejects(
    () =>
      acceptStoreOrder(orderId.toString(), {
        requestId: null,
        traceId: null,
        userId: new Types.ObjectId().toString(),
        role: 'store_manager',
        storeId: storeId.toString(),
      }),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.errorCode, ERROR_CODES.ORDER_ACCEPTANCE_NOT_ALLOWED);
      return true;
    },
  );
});

test('acceptStoreOrder requires actor store scope', async () => {
  await assert.rejects(
    () =>
      acceptStoreOrder(orderId.toString(), {
        requestId: null,
        traceId: null,
        userId: new Types.ObjectId().toString(),
        role: 'store_manager',
        storeId: null,
      }),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.errorCode, ERROR_CODES.ORDER_SCOPE_REQUIRED);
      return true;
    },
  );
});

test('acceptStoreOrder denies orders outside actor store scope', async () => {
  orderRepository.findOrderByIdForStore = async () => null;

  await assert.rejects(
    () =>
      acceptStoreOrder(orderId.toString(), {
        requestId: null,
        traceId: null,
        userId: new Types.ObjectId().toString(),
        role: 'store_manager',
        storeId: new Types.ObjectId().toString(),
      }),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.errorCode, ERROR_CODES.ORDER_ACCESS_FORBIDDEN);
      return true;
    },
  );
});

test('rejectStoreOrder records rejection reason and cancels order', async () => {
  const rejectedAt = new Date();
  let capturedTimelineEvent: unknown = null;

  orderRepository.findOrderByIdForStore = async () => buildOrder() as never;
  orderRepository.transitionOrderByIdForStore = async (_orderId, _storeId, _payload, timelineEvent) => {
    capturedTimelineEvent = timelineEvent;
    return {
      ...buildOrder(),
      orderStatus: 'cancelled',
      storeStatus: 'rejected',
      rejectedAt,
      rejectionReason: 'Out of stock',
      timeline: [timelineEvent],
    } as never;
  };

  const result = await rejectStoreOrder(
    orderId.toString(),
    { reason: 'Out of stock' },
    {
      requestId: null,
      traceId: null,
      userId: new Types.ObjectId().toString(),
      role: 'store_manager',
      storeId: storeId.toString(),
    },
  );

  assert.equal(result.orderStatus, 'cancelled');
  assert.equal(result.storeStatus, 'rejected');
  assert.equal(result.rejectionReason, 'Out of stock');
  assert.equal((capturedTimelineEvent as { event: string }).event, 'order.store.rejected');
  assert.equal((capturedTimelineEvent as { fromStatus: string }).fromStatus, 'placed');
  assert.equal((capturedTimelineEvent as { toStatus: string }).toStatus, 'cancelled');
  assert.equal((capturedTimelineEvent as { actorType: string }).actorType, 'store');
  assert.equal((capturedTimelineEvent as { reason: string }).reason, 'Out of stock');
});

test('startStoreOrderPicking starts picking for accepted store order', async () => {
  const actorUserId = new Types.ObjectId().toString();
  let capturedTimelineEvent: unknown = null;

  orderRepository.findOrderByIdForStore = async () =>
    ({
      ...buildOrder(),
      orderStatus: 'accepted',
      storeStatus: 'accepted',
    }) as never;
  orderRepository.transitionOrderByIdForStore = async (_orderId, _storeId, payload, timelineEvent) => {
    capturedTimelineEvent = timelineEvent;
    return {
      ...buildOrder(),
      orderStatus: 'picking',
      storeStatus: 'accepted',
      pickerStatus: payload.pickerStatus,
      assignedPickerId: payload.assignedPickerId,
      timeline: [timelineEvent],
    } as never;
  };

  const result = await startStoreOrderPicking(orderId.toString(), {
    requestId: null,
    traceId: null,
    userId: actorUserId,
    role: 'store_manager',
    storeId: storeId.toString(),
  });

  assert.equal(result.orderStatus, 'picking');
  assert.equal(result.storeStatus, 'accepted');
  assert.equal(result.pickerStatus, 'in_progress');
  assert.equal(result.assignedPickerId, actorUserId);
  assert.equal((capturedTimelineEvent as { event: string }).event, 'order.picking.started');
  assert.equal((capturedTimelineEvent as { fromStatus: string }).fromStatus, 'accepted');
  assert.equal((capturedTimelineEvent as { toStatus: string }).toStatus, 'picking');
  assert.equal((capturedTimelineEvent as { actorId: Types.ObjectId }).actorId.toString(), actorUserId);
});

test('startStoreOrderPicking rejects non-accepted orders', async () => {
  orderRepository.findOrderByIdForStore = async () => buildOrder() as never;

  await assert.rejects(
    () =>
      startStoreOrderPicking(orderId.toString(), {
        requestId: null,
        traceId: null,
        userId: new Types.ObjectId().toString(),
        role: 'store_manager',
        storeId: storeId.toString(),
      }),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.errorCode, ERROR_CODES.ORDER_PICKING_NOT_ALLOWED);
      return true;
    },
  );
});

test('startStoreOrderPicking denies orders outside actor store scope', async () => {
  orderRepository.findOrderByIdForStore = async () => null;

  await assert.rejects(
    () =>
      startStoreOrderPicking(orderId.toString(), {
        requestId: null,
        traceId: null,
        userId: new Types.ObjectId().toString(),
        role: 'store_manager',
        storeId: new Types.ObjectId().toString(),
      }),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.errorCode, ERROR_CODES.ORDER_ACCESS_FORBIDDEN);
      return true;
    },
  );
});

test('markStoreOrderItemPicked marks item picked during active picking', async () => {
  let capturedItems: unknown = null;
  let capturedTimelineEvent: unknown = null;

  orderRepository.findOrderByIdForStore = async () =>
    ({
      ...buildOrder(),
      orderStatus: 'picking',
      storeStatus: 'accepted',
      pickerStatus: 'in_progress',
      items: [buildOrderItem()],
    }) as never;
  orderRepository.transitionOrderByIdForStore = async (_orderId, _storeId, payload, timelineEvent) => {
    capturedItems = payload.items;
    capturedTimelineEvent = timelineEvent;
    return {
      ...buildOrder(),
      orderStatus: 'picking',
      storeStatus: 'accepted',
      pickerStatus: 'in_progress',
      assignedPickerId: new Types.ObjectId(),
      items: payload.items,
      timeline: [timelineEvent],
    } as never;
  };

  const result = await markStoreOrderItemPicked(
    orderId.toString(),
    storeProductId.toString(),
    { quantity: 2 },
    {
      requestId: null,
      traceId: null,
      userId: new Types.ObjectId().toString(),
      role: 'store_manager',
      storeId: storeId.toString(),
    },
  );

  const [item] = capturedItems as Array<{ pickedQuantity: number; pickingStatus: string }>;
  assert.ok(item);
  assert.equal(result.orderStatus, 'picking');
  assert.equal(result.pickerStatus, 'in_progress');
  assert.equal(item.pickedQuantity, 2);
  assert.equal(item.pickingStatus, 'picked');
  assert.equal((capturedTimelineEvent as { event: string }).event, 'order.item.picked');
  assert.equal((capturedTimelineEvent as { itemId: string }).itemId, storeProductId.toString());
  assert.equal((capturedTimelineEvent as { quantity: number }).quantity, 2);
});

test('markStoreOrderItemPicked rejects invalid picked quantity', async () => {
  orderRepository.findOrderByIdForStore = async () =>
    ({
      ...buildOrder(),
      orderStatus: 'picking',
      storeStatus: 'accepted',
      pickerStatus: 'in_progress',
      items: [buildOrderItem()],
    }) as never;

  await assert.rejects(
    () =>
      markStoreOrderItemPicked(
        orderId.toString(),
        storeProductId.toString(),
        { quantity: 3 },
        {
          requestId: null,
          traceId: null,
          userId: new Types.ObjectId().toString(),
          role: 'store_manager',
          storeId: storeId.toString(),
        },
      ),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.errorCode, ERROR_CODES.ORDER_ITEM_OPERATION_INVALID);
      return true;
    },
  );
});

test('markStoreOrderItemPicked rejects non-picking orders', async () => {
  orderRepository.findOrderByIdForStore = async () =>
    ({
      ...buildOrder(),
      orderStatus: 'accepted',
      storeStatus: 'accepted',
      pickerStatus: null,
      items: [buildOrderItem()],
    }) as never;

  await assert.rejects(
    () =>
      markStoreOrderItemPicked(
        orderId.toString(),
        storeProductId.toString(),
        { quantity: 1 },
        {
          requestId: null,
          traceId: null,
          userId: new Types.ObjectId().toString(),
          role: 'store_manager',
          storeId: storeId.toString(),
        },
      ),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.errorCode, ERROR_CODES.ORDER_PICKING_NOT_ALLOWED);
      return true;
    },
  );
});

test('markStoreOrderItemMissing marks item missing during active picking', async () => {
  let capturedItems: unknown = null;
  let capturedTimelineEvent: unknown = null;

  orderRepository.findOrderByIdForStore = async () =>
    ({
      ...buildOrder(),
      orderStatus: 'picking',
      storeStatus: 'accepted',
      pickerStatus: 'in_progress',
      items: [buildOrderItem()],
    }) as never;
  orderRepository.transitionOrderByIdForStore = async (_orderId, _storeId, payload, timelineEvent) => {
    capturedItems = payload.items;
    capturedTimelineEvent = timelineEvent;
    return {
      ...buildOrder(),
      orderStatus: 'picking',
      storeStatus: 'accepted',
      pickerStatus: 'in_progress',
      assignedPickerId: new Types.ObjectId(),
      items: payload.items,
      timeline: [timelineEvent],
    } as never;
  };

  const result = await markStoreOrderItemMissing(
    orderId.toString(),
    storeProductId.toString(),
    { quantity: 2 },
    {
      requestId: null,
      traceId: null,
      userId: new Types.ObjectId().toString(),
      role: 'store_manager',
      storeId: storeId.toString(),
    },
  );

  const [item] = capturedItems as Array<{ missingQuantity: number; pickingStatus: string }>;
  assert.ok(item);
  assert.equal(result.orderStatus, 'picking');
  assert.equal(result.pickerStatus, 'in_progress');
  assert.equal(item.missingQuantity, 2);
  assert.equal(item.pickingStatus, 'missing');
  assert.equal((capturedTimelineEvent as { event: string }).event, 'order.item.missing');
  assert.equal((capturedTimelineEvent as { itemId: string }).itemId, storeProductId.toString());
  assert.equal((capturedTimelineEvent as { quantity: number }).quantity, 2);
});

test('markStoreOrderItemMissing rejects invalid missing quantity', async () => {
  orderRepository.findOrderByIdForStore = async () =>
    ({
      ...buildOrder(),
      orderStatus: 'picking',
      storeStatus: 'accepted',
      pickerStatus: 'in_progress',
      items: [{ ...buildOrderItem(), pickedQuantity: 1 }],
    }) as never;

  await assert.rejects(
    () =>
      markStoreOrderItemMissing(
        orderId.toString(),
        storeProductId.toString(),
        { quantity: 2 },
        {
          requestId: null,
          traceId: null,
          userId: new Types.ObjectId().toString(),
          role: 'store_manager',
          storeId: storeId.toString(),
        },
      ),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.errorCode, ERROR_CODES.ORDER_ITEM_OPERATION_INVALID);
      return true;
    },
  );
});

test('completeStoreOrderPicking completes picking when all items are resolved', async () => {
  let capturedTimelineEvent: unknown = null;

  orderRepository.findOrderByIdForStore = async () =>
    ({
      ...buildOrder(),
      orderStatus: 'picking',
      storeStatus: 'accepted',
      pickerStatus: 'in_progress',
      items: [
        {
          ...buildOrderItem(),
          pickedQuantity: 2,
          pickingStatus: 'picked',
        },
      ],
    }) as never;
  orderRepository.transitionOrderByIdForStore = async (_orderId, _storeId, payload, timelineEvent) => {
    capturedTimelineEvent = timelineEvent;
    return {
      ...buildOrder(),
      orderStatus: 'picking',
      storeStatus: 'accepted',
      pickerStatus: payload.pickerStatus,
      assignedPickerId: new Types.ObjectId(),
      items: [
        {
          ...buildOrderItem(),
          pickedQuantity: 2,
          pickingStatus: 'picked',
        },
      ],
      timeline: [timelineEvent],
    } as never;
  };

  const result = await completeStoreOrderPicking(orderId.toString(), {
    requestId: null,
    traceId: null,
    userId: new Types.ObjectId().toString(),
    role: 'store_manager',
    storeId: storeId.toString(),
  });

  assert.equal(result.orderStatus, 'picking');
  assert.equal(result.pickerStatus, 'completed');
  assert.equal((capturedTimelineEvent as { event: string }).event, 'order.picking.completed');
  assert.equal((capturedTimelineEvent as { fromStatus: string }).fromStatus, 'picking');
  assert.equal((capturedTimelineEvent as { toStatus: string }).toStatus, 'picking');
});

test('completeStoreOrderPicking records inventory adjustment timeline for missing items', async () => {
  let capturedTimelineEvent: unknown = null;
  let adjustmentCalled = false;

  orderRepository.findOrderByIdForStore = async () =>
    ({
      ...buildOrder(),
      orderStatus: 'picking',
      storeStatus: 'accepted',
      pickerStatus: 'in_progress',
      items: [
        {
          ...buildOrderItem(),
          pickedQuantity: 1,
          missingQuantity: 1,
          pickingStatus: 'partial',
        },
      ],
    }) as never;
  inventoryAdjustmentService.adjustOrderInventoryForMissingItems = async (input) => {
    adjustmentCalled = true;
    return {
      adjusted: true,
      adjustedItemCount: 1,
      items: [
        {
          storeProductId: storeProductId.toString(),
          productId: input.items[0]?.productId.toString() ?? '',
          variantId: input.items[0]?.variantId.toString() ?? '',
          orderedQuantity: 2,
          pickedQuantity: 1,
          missingQuantity: 1,
          adjustmentQuantity: 1,
          reason: 'missing_item',
          movementId: new Types.ObjectId().toString(),
        },
      ],
      auditMetadata: {},
    };
  };
  orderRepository.transitionOrderByIdForStore = async (_orderId, _storeId, payload, timelineEvent) => {
    capturedTimelineEvent = timelineEvent;
    return {
      ...buildOrder(),
      orderStatus: 'picking',
      storeStatus: 'accepted',
      pickerStatus: payload.pickerStatus,
      assignedPickerId: new Types.ObjectId(),
      items: [
        {
          ...buildOrderItem(),
          pickedQuantity: 1,
          missingQuantity: 1,
          pickingStatus: 'partial',
        },
      ],
      timeline: Array.isArray(timelineEvent) ? timelineEvent : [timelineEvent],
    } as never;
  };

  const result = await completeStoreOrderPicking(orderId.toString(), {
    requestId: null,
    traceId: null,
    userId: new Types.ObjectId().toString(),
    role: 'store_manager',
    storeId: storeId.toString(),
  });

  const timelineEvents = capturedTimelineEvent as Array<{ event: string; quantity?: number; reason?: string | null }>;
  assert.equal(result.pickerStatus, 'completed');
  assert.equal(adjustmentCalled, true);
  assert.equal(Array.isArray(capturedTimelineEvent), true);
  assert.equal(timelineEvents[0]?.event, 'order.picking.completed');
  assert.equal(timelineEvents[1]?.event, 'order.inventory.adjusted');
  assert.equal(timelineEvents[1]?.quantity, 1);
  assert.equal(timelineEvents[1]?.reason, 'missing_item_reconciliation');
});

test('completeStoreOrderPicking rejects unresolved items', async () => {
  orderRepository.findOrderByIdForStore = async () =>
    ({
      ...buildOrder(),
      orderStatus: 'picking',
      storeStatus: 'accepted',
      pickerStatus: 'in_progress',
      items: [buildOrderItem()],
    }) as never;

  await assert.rejects(
    () =>
      completeStoreOrderPicking(orderId.toString(), {
        requestId: null,
        traceId: null,
        userId: new Types.ObjectId().toString(),
        role: 'store_manager',
        storeId: storeId.toString(),
      }),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.errorCode, ERROR_CODES.ORDER_PICKING_NOT_ALLOWED);
      return true;
    },
  );
});

test('startStoreOrderPacking starts packing after picking completion', async () => {
  let capturedTimelineEvent: unknown = null;

  orderRepository.findOrderByIdForStore = async () =>
    ({
      ...buildOrder(),
      orderStatus: 'picking',
      storeStatus: 'accepted',
      pickerStatus: 'completed',
      packingStatus: null,
    }) as never;
  orderRepository.transitionOrderByIdForStore = async (_orderId, _storeId, payload, timelineEvent) => {
    capturedTimelineEvent = timelineEvent;
    return {
      ...buildOrder(),
      orderStatus: 'packing',
      storeStatus: 'accepted',
      pickerStatus: 'completed',
      packingStatus: payload.packingStatus,
      timeline: [timelineEvent],
    } as never;
  };

  const result = await startStoreOrderPacking(orderId.toString(), {
    requestId: null,
    traceId: null,
    userId: new Types.ObjectId().toString(),
    role: 'store_manager',
    storeId: storeId.toString(),
  });

  assert.equal(result.orderStatus, 'packing');
  assert.equal(result.pickerStatus, 'completed');
  assert.equal(result.packingStatus, 'in_progress');
  assert.equal((capturedTimelineEvent as { event: string }).event, 'order.packing.started');
  assert.equal((capturedTimelineEvent as { fromStatus: string }).fromStatus, 'picking');
  assert.equal((capturedTimelineEvent as { toStatus: string }).toStatus, 'packing');
});

test('startStoreOrderPacking rejects orders before picking completion', async () => {
  orderRepository.findOrderByIdForStore = async () =>
    ({
      ...buildOrder(),
      orderStatus: 'picking',
      storeStatus: 'accepted',
      pickerStatus: 'in_progress',
      packingStatus: null,
    }) as never;

  await assert.rejects(
    () =>
      startStoreOrderPacking(orderId.toString(), {
        requestId: null,
        traceId: null,
        userId: new Types.ObjectId().toString(),
        role: 'store_manager',
        storeId: storeId.toString(),
      }),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.errorCode, ERROR_CODES.ORDER_PACKING_NOT_ALLOWED);
      return true;
    },
  );
});

test('startStoreOrderPacking denies orders outside actor store scope', async () => {
  orderRepository.findOrderByIdForStore = async () => null;

  await assert.rejects(
    () =>
      startStoreOrderPacking(orderId.toString(), {
        requestId: null,
        traceId: null,
        userId: new Types.ObjectId().toString(),
        role: 'store_manager',
        storeId: new Types.ObjectId().toString(),
      }),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.errorCode, ERROR_CODES.ORDER_ACCESS_FORBIDDEN);
      return true;
    },
  );
});

test('completeStoreOrderPacking completes active packing', async () => {
  let capturedTimelineEvent: unknown = null;

  orderRepository.findOrderByIdForStore = async () =>
    ({
      ...buildOrder(),
      orderStatus: 'packing',
      storeStatus: 'accepted',
      pickerStatus: 'completed',
      packingStatus: 'in_progress',
    }) as never;
  orderRepository.transitionOrderByIdForStore = async (_orderId, _storeId, payload, timelineEvent) => {
    capturedTimelineEvent = timelineEvent;
    return {
      ...buildOrder(),
      orderStatus: 'packing',
      storeStatus: 'accepted',
      pickerStatus: 'completed',
      packingStatus: payload.packingStatus,
      readyForPickupAt: null,
      timeline: [timelineEvent],
    } as never;
  };

  const result = await completeStoreOrderPacking(orderId.toString(), {
    requestId: null,
    traceId: null,
    userId: new Types.ObjectId().toString(),
    role: 'store_manager',
    storeId: storeId.toString(),
  });

  assert.equal(result.orderStatus, 'packing');
  assert.equal(result.packingStatus, 'completed');
  assert.equal(result.readyForPickupAt, null);
  assert.equal((capturedTimelineEvent as { event: string }).event, 'order.packing.completed');
  assert.equal((capturedTimelineEvent as { fromStatus: string }).fromStatus, 'packing');
  assert.equal((capturedTimelineEvent as { toStatus: string }).toStatus, 'packing');
});

test('completeStoreOrderPacking rejects orders before packing start', async () => {
  orderRepository.findOrderByIdForStore = async () =>
    ({
      ...buildOrder(),
      orderStatus: 'picking',
      storeStatus: 'accepted',
      pickerStatus: 'completed',
      packingStatus: null,
    }) as never;

  await assert.rejects(
    () =>
      completeStoreOrderPacking(orderId.toString(), {
        requestId: null,
        traceId: null,
        userId: new Types.ObjectId().toString(),
        role: 'store_manager',
        storeId: storeId.toString(),
      }),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.errorCode, ERROR_CODES.ORDER_PACKING_NOT_ALLOWED);
      return true;
    },
  );
});

test('markStoreOrderReadyForPickup marks packed order ready', async () => {
  const readyForPickupAt = new Date();
  let capturedTimelineEvent: unknown = null;

  orderRepository.findOrderByIdForStore = async () =>
    ({
      ...buildOrder(),
      orderStatus: 'packing',
      storeStatus: 'accepted',
      pickerStatus: 'completed',
      packingStatus: 'completed',
      readyForPickupAt: null,
    }) as never;
  orderRepository.transitionOrderByIdForStore = async (_orderId, _storeId, payload, timelineEvent) => {
    capturedTimelineEvent = timelineEvent;
    return {
      ...buildOrder(),
      orderStatus: 'ready_for_pickup',
      storeStatus: 'accepted',
      pickerStatus: 'completed',
      packingStatus: payload.packingStatus,
      readyForPickupAt,
      timeline: [timelineEvent],
    } as never;
  };

  const result = await markStoreOrderReadyForPickup(orderId.toString(), {
    requestId: null,
    traceId: null,
    userId: new Types.ObjectId().toString(),
    role: 'store_manager',
    storeId: storeId.toString(),
  });

  assert.equal(result.orderStatus, 'ready_for_pickup');
  assert.equal(result.packingStatus, 'ready_for_pickup');
  assert.equal(result.readyForPickupAt, readyForPickupAt.toISOString());
  assert.equal((capturedTimelineEvent as { event: string }).event, 'order.ready_for_pickup');
  assert.equal((capturedTimelineEvent as { fromStatus: string }).fromStatus, 'packing');
  assert.equal((capturedTimelineEvent as { toStatus: string }).toStatus, 'ready_for_pickup');
});

test('markStoreOrderReadyForPickup rejects incomplete packing', async () => {
  orderRepository.findOrderByIdForStore = async () =>
    ({
      ...buildOrder(),
      orderStatus: 'packing',
      storeStatus: 'accepted',
      pickerStatus: 'completed',
      packingStatus: 'in_progress',
      readyForPickupAt: null,
    }) as never;

  await assert.rejects(
    () =>
      markStoreOrderReadyForPickup(orderId.toString(), {
        requestId: null,
        traceId: null,
        userId: new Types.ObjectId().toString(),
        role: 'store_manager',
        storeId: storeId.toString(),
      }),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.errorCode, ERROR_CODES.ORDER_PACKING_NOT_ALLOWED);
      return true;
    },
  );
});
