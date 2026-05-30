import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import { orderScopeRequiredError } from '../utils/order-error.mapper';
import {
  acceptStoreOrder,
  cancelAdminOrder,
  cancelCustomerOrder,
  cancelStoreOrder,
  completeStoreOrderPacking,
  completeStoreOrderPicking,
  getOrderForAdmin,
  getOrderDeliveryForCustomer,
  getOrderLifecycleForCustomer,
  getOrderTimelineForAdmin,
  getOrderStateForCustomer,
  listOrdersForAdmin,
  getOrderForCustomer,
  getOrderForStore,
  getOrderDeliveryForVendor,
  listOrdersForStore,
  markStoreOrderItemMissing,
  listOrdersForCustomer,
  markStoreOrderItemPicked,
  markStoreOrderReadyForPickup,
  placeOrderFromPayment,
  rejectStoreOrder,
  startStoreOrderPacking,
  startStoreOrderPicking,
  updateAdminOrderStatus,
} from '../services/order.service';
import type {
  AdminOrderStatusUpdateInput,
  CancelOrderInput,
  ListAdminOrdersQuery,
  ListOrdersQuery,
  ListStoreOrdersQuery,
  PlaceOrderInput,
  RejectStoreOrderInput,
  StoreOrderItemPickingInput,
} from '../types/order.types';

const requireCustomerId = (userId?: string): string => userId ?? '';

const auditFromRequest = (req: {
  requestId?: string;
  traceId?: string;
}) => ({
  requestId: req.requestId ?? null,
  traceId: req.traceId ?? null,
});

const storeActorFromRequest = (req: {
  requestId?: string;
  traceId?: string;
  ip?: string;
  get(name: string): string | undefined;
  user?: {
    userId: string;
    role: string;
    storeId?: string | null;
    vendorId?: string | null;
  };
}) => ({
  requestId: req.requestId ?? null,
  traceId: req.traceId ?? null,
  userId: req.user?.userId ?? '',
  role: req.user?.role ?? '',
  storeId: req.user?.storeId ?? null,
  vendorId: req.user?.vendorId ?? null,
  ipAddress: req.ip ?? null,
  userAgent: req.get('user-agent') ?? null,
});

const adminActorFromRequest = (req: {
  requestId?: string;
  traceId?: string;
  ip?: string;
  get(name: string): string | undefined;
  user?: {
    userId: string;
    role: string;
  };
}) => ({
  requestId: req.requestId ?? null,
  traceId: req.traceId ?? null,
  userId: req.user?.userId ?? '',
  role: req.user?.role ?? '',
  ipAddress: req.ip ?? null,
  userAgent: req.get('user-agent') ?? null,
});

export const placeOrderController = asyncHandler(async (req, res) => {
  const customerId = requireCustomerId(req.user?.userId);
  const body = req.body as PlaceOrderInput;
  const data = await placeOrderFromPayment(customerId, body, auditFromRequest(req));

  return sendSuccessResponse({
    res,
    message: 'Order placed successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const listOrdersController = asyncHandler(async (req, res) => {
  const customerId = requireCustomerId(req.user?.userId);
  const query = req.query as unknown as ListOrdersQuery;
  const result = await listOrdersForCustomer(customerId, query);

  return sendSuccessResponse({
    res,
    message: 'Orders fetched successfully',
    data: result.orders,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit) || 0,
        hasNextPage: result.page * result.limit < result.total,
        hasPreviousPage: result.page > 1,
      },
    },
  });
});

export const getOrderController = asyncHandler(async (req, res) => {
  const customerId = requireCustomerId(req.user?.userId);
  const orderId = req.params.orderId as string;
  const data = await getOrderForCustomer(customerId, orderId);

  return sendSuccessResponse({
    res,
    message: 'Order fetched successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const getCustomerOrderStateController = asyncHandler(async (req, res) => {
  const customerId = requireCustomerId(req.user?.userId);
  const orderId = req.params.orderId as string;
  const data = await getOrderStateForCustomer(customerId, orderId);

  return sendSuccessResponse({
    res,
    message: 'Order state fetched successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const getCustomerOrderLifecycleController = asyncHandler(async (req, res) => {
  const customerId = requireCustomerId(req.user?.userId);
  const orderId = req.params.orderId as string;
  const data = await getOrderLifecycleForCustomer(customerId, orderId);

  return sendSuccessResponse({
    res,
    message: 'Order lifecycle fetched successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const getCustomerOrderDeliveryController = asyncHandler(async (req, res) => {
  const customerId = requireCustomerId(req.user?.userId);
  const orderId = req.params.orderId as string;
  const data = await getOrderDeliveryForCustomer(customerId, orderId);

  return sendSuccessResponse({
    res,
    message: 'Customer order delivery tracking fetched successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const cancelCustomerOrderController = asyncHandler(async (req, res) => {
  const customerId = requireCustomerId(req.user?.userId);
  const orderId = req.params.orderId as string;
  const body = req.body as CancelOrderInput;
  const data = await cancelCustomerOrder(orderId, customerId, body, auditFromRequest(req));

  return sendSuccessResponse({
    res,
    message: 'Order cancelled successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const acceptStoreOrderController = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId as string;
  const data = await acceptStoreOrder(orderId, storeActorFromRequest(req));

  return sendSuccessResponse({
    res,
    message: 'Order accepted successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const rejectStoreOrderController = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId as string;
  const body = req.body as RejectStoreOrderInput;
  const data = await rejectStoreOrder(orderId, body, storeActorFromRequest(req));

  return sendSuccessResponse({
    res,
    message: 'Order rejected successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const cancelStoreOrderController = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId as string;
  const body = req.body as CancelOrderInput;
  const data = await cancelStoreOrder(orderId, body, storeActorFromRequest(req));

  return sendSuccessResponse({
    res,
    message: 'Order cancelled successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const listStoreOrdersController = asyncHandler(async (req, res) => {
  const query = req.query as unknown as ListStoreOrdersQuery;
  const result = await listOrdersForStore(query, storeActorFromRequest(req));

  return sendSuccessResponse({
    res,
    message: 'Store orders fetched successfully',
    data: result.orders,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit) || 0,
        hasNextPage: result.page * result.limit < result.total,
        hasPreviousPage: result.page > 1,
      },
    },
  });
});

export const getStoreOrderController = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId as string;
  const data = await getOrderForStore(orderId, storeActorFromRequest(req));

  return sendSuccessResponse({
    res,
    message: 'Store order fetched successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const getVendorOrderDeliveryStatusController = asyncHandler(async (req, res) => {
  const storeId = req.user?.storeId;

  if (!storeId) {
    throw orderScopeRequiredError();
  }

  const orderId = req.params.orderId as string;
  const data = await getOrderDeliveryForVendor(storeId, orderId);

  return sendSuccessResponse({
    res,
    message: 'Store order delivery status fetched successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const listAdminOrdersController = asyncHandler(async (req, res) => {
  const query = req.query as unknown as ListAdminOrdersQuery;
  const result = await listOrdersForAdmin(query);

  return sendSuccessResponse({
    res,
    message: 'Admin orders fetched successfully',
    data: result.orders,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit) || 0,
        hasNextPage: result.page * result.limit < result.total,
        hasPreviousPage: result.page > 1,
      },
    },
  });
});

export const getAdminOrderController = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId as string;
  const data = await getOrderForAdmin(orderId);

  return sendSuccessResponse({
    res,
    message: 'Admin order fetched successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const getAdminOrderTimelineController = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId as string;
  const data = await getOrderTimelineForAdmin(orderId);

  return sendSuccessResponse({
    res,
    message: 'Admin order timeline fetched successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const updateAdminOrderStatusController = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId as string;
  const body = req.body as AdminOrderStatusUpdateInput;
  const data = await updateAdminOrderStatus(orderId, body, adminActorFromRequest(req));

  return sendSuccessResponse({
    res,
    message: 'Admin order status updated successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const cancelAdminOrderController = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId as string;
  const body = req.body as CancelOrderInput;
  const data = await cancelAdminOrder(orderId, body, adminActorFromRequest(req));

  return sendSuccessResponse({
    res,
    message: 'Order cancelled successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const startStoreOrderPickingController = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId as string;
  const data = await startStoreOrderPicking(orderId, storeActorFromRequest(req));

  return sendSuccessResponse({
    res,
    message: 'Order picking started successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const markStoreOrderItemPickedController = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId as string;
  const itemId = req.params.itemId as string;
  const body = req.body as StoreOrderItemPickingInput;
  const data = await markStoreOrderItemPicked(orderId, itemId, body, storeActorFromRequest(req));

  return sendSuccessResponse({
    res,
    message: 'Order item marked picked successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const markStoreOrderItemMissingController = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId as string;
  const itemId = req.params.itemId as string;
  const body = req.body as StoreOrderItemPickingInput;
  const data = await markStoreOrderItemMissing(orderId, itemId, body, storeActorFromRequest(req));

  return sendSuccessResponse({
    res,
    message: 'Order item marked missing successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const completeStoreOrderPickingController = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId as string;
  const data = await completeStoreOrderPicking(orderId, storeActorFromRequest(req));

  return sendSuccessResponse({
    res,
    message: 'Order picking completed successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const startStoreOrderPackingController = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId as string;
  const data = await startStoreOrderPacking(orderId, storeActorFromRequest(req));

  return sendSuccessResponse({
    res,
    message: 'Order packing started successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const completeStoreOrderPackingController = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId as string;
  const data = await completeStoreOrderPacking(orderId, storeActorFromRequest(req));

  return sendSuccessResponse({
    res,
    message: 'Order packing completed successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const markStoreOrderReadyForPickupController = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId as string;
  const data = await markStoreOrderReadyForPickup(orderId, storeActorFromRequest(req));

  return sendSuccessResponse({
    res,
    message: 'Order marked ready for pickup successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});
