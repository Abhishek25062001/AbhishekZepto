import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import { getCustomerHomeFeed } from '../services/customer-home.service';
import type { CustomerHomeQuery } from '../types/customer-home.types';

const requireCustomerId = (userId?: string): string => userId ?? '';

export const getCustomerHomeController = asyncHandler(async (req, res) => {
  const customerId = requireCustomerId(req.user?.userId);
  const query = req.query as unknown as CustomerHomeQuery;

  const feed = await getCustomerHomeFeed(
    customerId,
    query,
    {
      userId: customerId,
      cityId: query.cityId ?? req.user?.cityId ?? null,
    },
    {
      actorId: customerId,
      requestId: req.requestId ?? null,
      traceId: req.traceId ?? null,
    },
  );

  return sendSuccessResponse({
    res,
    message: 'Customer home feed fetched successfully',
    data: feed,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});
