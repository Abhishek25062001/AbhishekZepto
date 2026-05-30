import { Router } from 'express';
import { asyncHandler } from '../../../utils/async-handler';
import { sendSuccessResponse } from '../../../utils/api-response';
import { markDelayedDeliveriesForSla } from '../services/delivery-sla-marking.service';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';

const router = Router();

router.post(
  '/evaluate',
  asyncHandler(async (req, res) => {
    // Validate x-internal-secret header
    const internalSecret = process.env.INTERNAL_SECRET || 'test-internal-secret';
    const requestSecret = req.headers['x-internal-secret'];

    if (!requestSecret || requestSecret !== internalSecret) {
      throw new AppError({
        message: 'Unauthorized internal access',
        statusCode: 401,
        errorCode: ERROR_CODES.UNAUTHORIZED,
      });
    }

    const limit = typeof req.body?.limit === 'number' ? req.body.limit : 100;

    const result = await markDelayedDeliveriesForSla({ limit });

    return sendSuccessResponse({
      res,
      message: 'Delivery SLA evaluation completed successfully',
      data: result,
    });
  }),
);

export default router;
