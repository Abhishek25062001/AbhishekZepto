import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import {
  createPaymentOrderForCustomer,
  verifyPaymentForCustomer,
} from '../services/payment.service';
import type { CreatePaymentOrderInput, VerifyPaymentInput } from '../types/payment.types';

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
