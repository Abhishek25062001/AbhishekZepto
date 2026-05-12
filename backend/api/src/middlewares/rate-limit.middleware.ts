import rateLimit from 'express-rate-limit';

import { ERROR_CODES } from '../errors/error-codes';
import { sendErrorResponse } from '../utils/api-response';
import { HTTP_STATUS } from '../utils/http-status';

const minutes = 60 * 1000;

export const globalRateLimitMiddleware = rateLimit({
  legacyHeaders: false,
  limit: 100,
  standardHeaders: true,
  windowMs: 15 * minutes,
  handler: (req, res) => {
    return sendErrorResponse({
      res,
      statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
      message: 'Too many requests. Please try again later.',
      errorCode: ERROR_CODES.RATE_LIMITED,
      meta: {
        requestId: req.requestId,
        traceId: req.traceId,
      },
    });
  },
});

export const authRateLimitMiddleware = rateLimit({
  legacyHeaders: false,
  limit: 5,
  standardHeaders: true,
  windowMs: 5 * minutes,
  handler: (req, res) => {
    return sendErrorResponse({
      res,
      statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
      message: 'Too many authentication requests. Please try again later.',
      errorCode: ERROR_CODES.RATE_LIMITED,
      meta: {
        requestId: req.requestId,
        traceId: req.traceId,
      },
    });
  },
});
