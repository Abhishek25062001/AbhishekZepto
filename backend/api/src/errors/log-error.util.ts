import type { Request } from 'express';

type BuildErrorLogPayloadOptions = {
  req: Request;
  error: unknown;
  statusCode: number;
  errorCode: string;
  message: string;
  includeStack: boolean;
};

export type ErrorLogPayload = {
  requestId?: string;
  traceId?: string;
  method: string;
  path: string;
  statusCode: number;
  errorCode: string;
  message: string;
  userId?: string;
  role?: string;
  stack?: string;
};

export const buildErrorLogPayload = ({
  req,
  error,
  statusCode,
  errorCode,
  message,
  includeStack,
}: BuildErrorLogPayloadOptions): ErrorLogPayload => {
  const stack = error instanceof Error ? error.stack : undefined;

  return {
    requestId: req.requestId,
    traceId: req.traceId,
    method: req.method,
    path: req.originalUrl || req.url,
    statusCode,
    errorCode,
    message,
    userId: req.user?.userId,
    role: req.user?.role,
    ...(includeStack && stack ? { stack } : {}),
  };
};
