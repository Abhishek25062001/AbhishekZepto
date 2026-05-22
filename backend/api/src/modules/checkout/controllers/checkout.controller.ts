import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import {
  cancelCheckoutForCustomer,
  getCheckoutSummaryForCustomer,
  initiateCheckoutForCustomer,
} from '../services/checkout.service';
import type {
  CancelCheckoutInput,
  GetCheckoutSummaryQuery,
  InitiateCheckoutInput,
} from '../types/checkout.types';

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

export const initiateCheckoutController = asyncHandler(async (req, res) => {
  const customerId = requireCustomerId(req.user?.userId);
  const body = req.body as InitiateCheckoutInput;
  const data = await initiateCheckoutForCustomer(customerId, body, auditFromRequest(req));

  return sendSuccessResponse({
    res,
    message: 'Checkout initiated successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const getCheckoutSummaryController = asyncHandler(async (req, res) => {
  const customerId = requireCustomerId(req.user?.userId);
  const query = req.query as unknown as GetCheckoutSummaryQuery;
  const data = await getCheckoutSummaryForCustomer(customerId, query);

  return sendSuccessResponse({
    res,
    message: 'Checkout summary fetched successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const cancelCheckoutController = asyncHandler(async (req, res) => {
  const customerId = requireCustomerId(req.user?.userId);
  const body = req.body as CancelCheckoutInput;
  const data = await cancelCheckoutForCustomer(customerId, body, auditFromRequest(req));

  return sendSuccessResponse({
    res,
    message: 'Checkout cancelled successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});
