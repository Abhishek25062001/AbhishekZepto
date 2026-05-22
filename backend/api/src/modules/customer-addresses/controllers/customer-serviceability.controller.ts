import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import { checkServiceability, selectStoreForCustomer } from '../services/customer-store-selection.service';
import type { SelectStoreInput, ServiceabilityInput } from '../types/customer-address.types';

const requireCustomerId = (userId?: string): string => userId ?? '';

export const checkServiceabilityController = asyncHandler(async (req, res) => {
  const customerId = requireCustomerId(req.user?.userId);
  const result = await checkServiceability(customerId, req.body as ServiceabilityInput);

  return sendSuccessResponse({
    res,
    message: 'Serviceability resolved successfully',
    data: result,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const selectStoreController = asyncHandler(async (req, res) => {
  const customerId = requireCustomerId(req.user?.userId);
  const result = await selectStoreForCustomer(customerId, req.body as SelectStoreInput, {
    actorId: customerId,
    requestId: req.requestId ?? null,
    traceId: req.traceId ?? null,
  });

  return sendSuccessResponse({
    res,
    message: 'Store selected successfully',
    data: result,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});
