import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import {
  createPaymentOrderForCustomer,
  getAdminPaymentById,
  getCustomerPaymentById,
  listAdminPayments,
  verifyPaymentByIdForCustomer,
  verifyPaymentForCustomer,
} from '../services/payment.service';
import type {
  AdminPaymentActor,
  CreatePaymentOrderInput,
  PaymentListQuery,
  VerifyPaymentByIdBody,
  VerifyPaymentInput,
} from '../types/payment.types';

const requireCustomerId = (userId?: string): string => userId ?? '';

const auditFromRequest = (req: {
  user?: { userId?: string };
  requestId?: string;
  traceId?: string;
}) => ({
  actorId: requireCustomerId(req.user?.userId),
  requestId: req.requestId ?? null,
  traceId: req.traceId ?? null,
});

const adminActorFromRequest = (req: {
  user?: {
    userId?: string;
    role?: string | null;
    cityId?: string | null;
    storeId?: string | null;
    permissions?: string[];
  };
}): AdminPaymentActor => ({
  userId: req.user?.userId ?? '',
  role: req.user?.role ?? null,
  cityId: req.user?.cityId ?? null,
  storeId: req.user?.storeId ?? null,
  permissions: req.user?.permissions ?? [],
});

export const createPaymentOrderController = asyncHandler(async (req, res) => {
  const customerId = requireCustomerId(req.user?.userId);
  const body = req.body as CreatePaymentOrderInput;
  const data = await createPaymentOrderForCustomer(customerId, body, auditFromRequest(req));

  return sendSuccessResponse({
    res,
    message: 'Payment order created successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const verifyPaymentController = asyncHandler(async (req, res) => {
  const customerId = requireCustomerId(req.user?.userId);
  const body = req.body as VerifyPaymentInput;
  const data = await verifyPaymentForCustomer(customerId, body, auditFromRequest(req));

  return sendSuccessResponse({
    res,
    message: 'Payment verified successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const verifyPaymentByIdController = asyncHandler(async (req, res) => {
  const customerId = requireCustomerId(req.user?.userId);
  const paymentId = req.params.paymentId as string;
  const body = req.body as VerifyPaymentByIdBody;
  const data = await verifyPaymentByIdForCustomer(
    customerId,
    paymentId,
    body,
    auditFromRequest(req),
  );

  return sendSuccessResponse({
    res,
    message: 'Payment verified successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const getCustomerPaymentByIdController = asyncHandler(async (req, res) => {
  const customerId = requireCustomerId(req.user?.userId);
  const paymentId = req.params.paymentId as string;
  const data = await getCustomerPaymentById(customerId, paymentId);

  return sendSuccessResponse({
    res,
    message: 'Payment fetched successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const listAdminPaymentsController = asyncHandler(async (req, res) => {
  const query = req.query as unknown as PaymentListQuery;
  const result = await listAdminPayments(query, adminActorFromRequest(req));

  return sendSuccessResponse({
    res,
    message: 'Admin payments fetched successfully',
    data: result.payments,
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

export const getAdminPaymentByIdController = asyncHandler(async (req, res) => {
  const paymentId = req.params.paymentId as string;
  const data = await getAdminPaymentById(paymentId, adminActorFromRequest(req));

  return sendSuccessResponse({
    res,
    message: 'Admin payment fetched successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});
