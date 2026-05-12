import type { RequestHandler } from 'express';
import type { ZodSchema } from 'zod';
import { AppError } from '../errors/AppError';
import { ERROR_CODES } from '../errors/error-codes';
import { HTTP_STATUS } from '../utils/http-status';

type RequestValidationSchemas = {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
};

const formatValidationError = (error: unknown): Record<string, unknown> => {
  if (error && typeof error === 'object' && 'flatten' in error) {
    const flattened = (error as { flatten: () => unknown }).flatten();

    return {
      fields: flattened,
    };
  }

  return {};
};

export const validateRequest = (schemas: RequestValidationSchemas): RequestHandler => {
  return (req, _res, next) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }

      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }

      next();
    } catch (error) {
      next(
        new AppError({
          message: 'Request validation failed',
          statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
          errorCode: ERROR_CODES.VALIDATION_ERROR,
          details: formatValidationError(error),
        }),
      );
    }
  };
};
