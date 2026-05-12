import type { ErrorCode } from './error-codes';

export class AppError extends Error {
  public readonly statusCode: number;

  public readonly errorCode: ErrorCode;

  public readonly details: Record<string, unknown>;

  public readonly isOperational: boolean;

  public constructor({
    message,
    statusCode,
    errorCode,
    details = {},
    isOperational = true,
  }: {
    message: string;
    statusCode: number;
    errorCode: ErrorCode;
    details?: Record<string, unknown>;
    isOperational?: boolean;
  }) {
    super(message);

    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}
