import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import {
  addCartItem,
  clearCustomerCart,
  getCartForCustomer,
  recalculateCartForCustomer,
  removeCartItem,
  updateCartItemQuantity,
} from '../services/cart.service';
import type {
  AddCartItemInput,
  CartStoreQuery,
  GetCartQuery,
  RecalculateCartInput,
} from '../types/cart.types';

const requireCustomerId = (userId?: string): string => userId ?? '';

const auditFromRequest = (req: { user?: { userId?: string }; requestId?: string; traceId?: string }) => ({
  actorId: requireCustomerId(req.user?.userId),
  requestId: req.requestId ?? null,
  traceId: req.traceId ?? null,
});

export const getCartController = asyncHandler(async (req, res) => {
  const customerId = requireCustomerId(req.user?.userId);
  const query = req.query as unknown as GetCartQuery;
  const cart = await getCartForCustomer(customerId, query, auditFromRequest(req));

  return sendSuccessResponse({
    res,
    message: 'Cart fetched successfully',
    data: cart,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const addCartItemController = asyncHandler(async (req, res) => {
  const customerId = requireCustomerId(req.user?.userId);
  const body = req.body as AddCartItemInput;
  const cart = await addCartItem(customerId, body, auditFromRequest(req));

  return sendSuccessResponse({
    res,
    message: 'Cart item added successfully',
    data: cart,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const updateCartItemController = asyncHandler(async (req, res) => {
  const customerId = requireCustomerId(req.user?.userId);
  const query = req.query as unknown as CartStoreQuery;
  const body = req.body as { quantity: number };

  const cart = await updateCartItemQuantity(
    customerId,
    {
      storeId: query.storeId,
      itemId: String(req.params.itemId),
      quantity: body.quantity,
    },
    auditFromRequest(req),
  );

  return sendSuccessResponse({
    res,
    message: 'Cart item updated successfully',
    data: cart,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const removeCartItemController = asyncHandler(async (req, res) => {
  const customerId = requireCustomerId(req.user?.userId);
  const query = req.query as unknown as CartStoreQuery;
  const cart = await removeCartItem(
    customerId,
    query.storeId,
    String(req.params.itemId),
    auditFromRequest(req),
  );

  return sendSuccessResponse({
    res,
    message: 'Cart item removed successfully',
    data: cart,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const recalculateCartController = asyncHandler(async (req, res) => {
  const customerId = requireCustomerId(req.user?.userId);
  const body = req.body as RecalculateCartInput;
  const cart = await recalculateCartForCustomer(customerId, body, auditFromRequest(req));

  return sendSuccessResponse({
    res,
    message: 'Cart recalculated successfully',
    data: cart,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const clearCartController = asyncHandler(async (req, res) => {
  const customerId = requireCustomerId(req.user?.userId);
  const query = req.query as unknown as CartStoreQuery;
  const cart = await clearCustomerCart(customerId, query.storeId, auditFromRequest(req));

  return sendSuccessResponse({
    res,
    message: 'Cart cleared successfully',
    data: cart,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});
