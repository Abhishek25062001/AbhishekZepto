import type { ErrorRequestHandler } from 'express';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { mapDatabaseError } from '../database/database-error.mapper';
import { AppError } from '../errors/AppError';
import { ERROR_CODES } from '../errors/error-codes';
import { buildErrorLogPayload } from '../errors/log-error.util';
import { sendErrorResponse } from '../utils/api-response';
import { HTTP_STATUS } from '../utils/http-status';

const getUnknownErrorMessage = (): string => {
  if (env.APP_ENV === 'production') {
    return 'Internal server error';
  }

  return 'Unexpected backend error';
};

export const globalErrorMiddleware: ErrorRequestHandler = (error, req, res, _next) => {
  void _next;
  const includeStack = env.APP_ENV !== 'production';

  if (error instanceof AppError && error.isOperational) {
    logger.warn(
      buildErrorLogPayload({
        req,
        error,
        statusCode: error.statusCode,
        errorCode: error.errorCode,
        message: error.message,
        includeStack,
      }),
      'Operational backend error',
    );

    return sendErrorResponse({
      res,
      statusCode: error.statusCode,
      message: error.message,
      errorCode: error.errorCode,
      details: env.APP_ENV === 'production' ? {} : error.details,
      meta: {
        requestId: req.requestId,
        traceId: req.traceId,
      },
    });
  }

  const mappedDatabaseError = mapDatabaseError(error);

  if (mappedDatabaseError) {
    logger.warn(
      buildErrorLogPayload({
        req,
        error,
        statusCode: mappedDatabaseError.statusCode,
        errorCode: mappedDatabaseError.errorCode,
        message: mappedDatabaseError.message,
        includeStack,
      }),
      'Database backend error',
    );

    return sendErrorResponse({
      res,
      statusCode: mappedDatabaseError.statusCode,
      message: mappedDatabaseError.message,
      errorCode: mappedDatabaseError.errorCode,
      details: env.APP_ENV === 'production' ? {} : mappedDatabaseError.details,
      meta: {
        requestId: req.requestId,
        traceId: req.traceId,
      },
    });
  }

  logger.error(
    buildErrorLogPayload({
      req,
      error,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: getUnknownErrorMessage(),
      includeStack,
    }),
    'Unknown backend error',
  );

  return sendErrorResponse({
    res,
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: getUnknownErrorMessage(),
    errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
    details:
      env.APP_ENV === 'production'
        ? {}
        : {
            message: error instanceof Error ? error.message : 'Unknown error',
          },
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
};
