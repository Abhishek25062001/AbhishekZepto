import type { RequestHandler } from 'express';
import { AppError } from '../errors/AppError';
import { ERROR_CODES } from '../errors/error-codes';
import { HTTP_STATUS } from '../utils/http-status';

export const notFoundMiddleware: RequestHandler = (req, _res, next) => {
  next(
    new AppError({
      message: 'Route not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.NOT_FOUND,
      details: {
        method: req.method,
        path: req.originalUrl,
      },
    }),
  );
};
