import type { Request, Response } from 'express';

import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import { getRealtimeHealth } from '../services/realtime-health.service';

export const getAdminRealtimeHealthController = asyncHandler(
  async (req: Request, res: Response) => {
    void req;
    const health = getRealtimeHealth();

    return sendSuccessResponse({
      res,
      message: 'Realtime health status fetched successfully',
      data: health,
    });
  },
);
