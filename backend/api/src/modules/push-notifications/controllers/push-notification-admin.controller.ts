import type { Request, Response } from 'express';

import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import {
  findPushLogById,
  listPushLogs,
} from '../repositories/push-notification-log.repository';
import { mapPushLogResponse } from '../utils/push-notification-response.mapper';

export const listPushNotificationLogsController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await listPushLogs(req.query as never);

    return sendSuccessResponse({
      res,
      message: 'Push notification logs fetched successfully',
      data: {
        items: result.items.map(mapPushLogResponse),
        pagination: {
          limit: Number(req.query.limit),
          page: Number(req.query.page),
          total: result.total,
        },
      },
    });
  },
);

export const getPushNotificationLogController = asyncHandler(
  async (req: Request, res: Response) => {
    const { logId } = req.params as { logId: string };
    const log = await findPushLogById(logId);

    return sendSuccessResponse({
      res,
      message: 'Push notification log fetched successfully',
      data: log ? mapPushLogResponse(log) : null,
    });
  },
);
