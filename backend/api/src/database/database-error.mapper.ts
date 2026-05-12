import mongoose from 'mongoose';
import { AppError } from '../errors/AppError';
import { ERROR_CODES } from '../errors/error-codes';
import { HTTP_STATUS } from '../utils/http-status';

type MongoDuplicateKeyError = Error & {
  code?: number;
  keyPattern?: Record<string, unknown>;
  keyValue?: Record<string, unknown>;
};

const isDuplicateKeyError = (error: unknown): error is MongoDuplicateKeyError => {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 11000;
};

export const mapDatabaseError = (error: unknown): AppError | null => {
  if (isDuplicateKeyError(error)) {
    return new AppError({
      message: 'Duplicate database record',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: ERROR_CODES.CONFLICT,
      details: {
        keyPattern: error.keyPattern || {},
      },
    });
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return new AppError({
      message: 'Database validation failed',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: ERROR_CODES.VALIDATION_ERROR,
      details: {
        fields: Object.keys(error.errors),
      },
    });
  }

  if (error instanceof mongoose.Error.CastError) {
    return new AppError({
      message: 'Invalid database identifier',
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: ERROR_CODES.BAD_REQUEST,
      details: {
        path: error.path,
      },
    });
  }

  return null;
};
