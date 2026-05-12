import type { Response } from 'express';
import type { ApiMeta, ApiPaginationMeta } from '../types/api-response.types';
import { HTTP_STATUS, type HttpStatusCode } from './http-status';

type SuccessResponseOptions<T> = {
  res: Response;
  statusCode?: HttpStatusCode;
  message: string;
  data: T;
  meta?: ApiResponseMeta;
};

type ErrorResponseOptions = {
  res: Response;
  statusCode?: number;
  message: string;
  errorCode: string;
  details?: ApiMeta;
  meta?: ApiResponseMeta;
};

type PaginatedResponseOptions<T> = {
  res: Response;
  message: string;
  data: T[];
  pagination: ApiPaginationMeta;
  meta?: ApiResponseMeta;
};

export type ApiResponseMeta = ApiMeta & {
  requestId?: string;
  traceId?: string;
};

export const sendSuccessResponse = <T>({
  res,
  statusCode = HTTP_STATUS.OK,
  message,
  data,
  meta = {},
}: SuccessResponseOptions<T>): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
};

export const sendCreatedResponse = <T>(
  options: Omit<SuccessResponseOptions<T>, 'statusCode'>,
): Response => {
  return sendSuccessResponse({
    ...options,
    statusCode: HTTP_STATUS.CREATED,
  });
};

export const sendAcceptedResponse = <T>(
  options: Omit<SuccessResponseOptions<T>, 'statusCode'>,
): Response => {
  return sendSuccessResponse({
    ...options,
    statusCode: HTTP_STATUS.ACCEPTED,
  });
};

export const sendErrorResponse = ({
  res,
  statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  message,
  errorCode,
  details = {},
  meta = {},
}: ErrorResponseOptions): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: {
      code: errorCode,
      details,
    },
    meta,
  });
};

export const sendPaginatedResponse = <T>({
  res,
  message,
  data,
  pagination,
  meta = {},
}: PaginatedResponseOptions<T>): Response => {
  return sendSuccessResponse({
    res,
    message,
    data,
    meta: {
      ...meta,
      pagination,
    },
  });
};
