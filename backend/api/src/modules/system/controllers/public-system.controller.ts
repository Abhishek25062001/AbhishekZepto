import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import { getHealthStatus, getSystemInfo, getVersionInfo } from '../services/public-system.service';

export const healthCheckController = asyncHandler(async (_req, res) => {
  return sendSuccessResponse({
    res,
    message: 'Backend is healthy',
    data: getHealthStatus(),
  });
});

export const versionController = asyncHandler(async (_req, res) => {
  return sendSuccessResponse({
    res,
    message: 'Version fetched successfully',
    data: getVersionInfo(),
  });
});

export const systemInfoController = asyncHandler(async (_req, res) => {
  return sendSuccessResponse({
    res,
    message: 'System info fetched successfully',
    data: getSystemInfo(),
  });
});
