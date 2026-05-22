import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import {
  getCustomerProfile,
  updateCustomerProfile,
} from '../services/profile.service';
import type { UpdateCustomerProfileBody } from '../types/profile.types';

const requireCustomerId = (userId?: string): string => userId ?? '';

export const getProfileController = asyncHandler(async (req, res) => {
  const customerId = requireCustomerId(req.user?.userId);
  const data = await getCustomerProfile(customerId);

  return sendSuccessResponse({
    res,
    message: 'Profile fetched successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const updateProfileController = asyncHandler(async (req, res) => {
  const customerId = requireCustomerId(req.user?.userId);
  const body = req.body as UpdateCustomerProfileBody;
  const data = await updateCustomerProfile(customerId, body);

  return sendSuccessResponse({
    res,
    message: 'Profile updated successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});
