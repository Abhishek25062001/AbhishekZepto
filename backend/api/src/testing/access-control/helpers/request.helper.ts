import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import type { AccessControlMockRequest } from './auth-context.helper';

export type AccessControlMockResponse = {
  body?: unknown;
  statusCode?: number;
  status: (code: number) => AccessControlMockResponse;
  json: (payload: unknown) => AccessControlMockResponse;
};

export type AccessControlResult = {
  allowed: boolean;
  statusCode: number;
  errorCode?: string;
  body?: unknown;
};

export const modelAccessControlResult = ({
  statusCode,
  errorCode,
  body,
}: {
  statusCode: number;
  errorCode?: string;
  body?: unknown;
}): AccessControlResult => ({
  allowed: statusCode >= HTTP_STATUS.OK && statusCode < 300,
  statusCode,
  errorCode,
  body,
});

export const createAccessControlMockResponse = (
  onJson: (payload: unknown, statusCode: number) => void,
): AccessControlMockResponse => {
  const response: AccessControlMockResponse = {
    body: undefined,
    statusCode: undefined,
    status(code: number) {
      response.statusCode = code;
      return response;
    },
    json(payload: unknown) {
      response.body = payload;
      onJson(payload, response.statusCode ?? HTTP_STATUS.OK);
      return response;
    },
  };

  return response;
};

export const runAccessControlController = async (
  controller: unknown,
  req: AccessControlMockRequest,
) => {
  return new Promise<{ body: unknown; statusCode: number }>((resolve, reject) => {
    const res = createAccessControlMockResponse((body, statusCode) => {
      resolve({
        body,
        statusCode,
      });
    });

    (
      controller as (
        req: AccessControlMockRequest,
        res: AccessControlMockResponse,
        next: (error?: unknown) => void,
      ) => void
    )(req, res, (error?: unknown) => {
      if (error) {
        reject(error);
      }
    });
  });
};

export const evaluateAccessControlAction = async (
  action: () => Promise<void>,
): Promise<AccessControlResult> => {
  try {
    await action();
    return modelAccessControlResult({
      statusCode: HTTP_STATUS.OK,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return modelAccessControlResult({
        statusCode: error.statusCode,
        errorCode: error.errorCode,
      });
    }

    throw error;
  }
};

export const evaluateAccessControlController = async (
  controller: unknown,
  req: AccessControlMockRequest,
): Promise<AccessControlResult> => {
  try {
    const response = await runAccessControlController(controller, req);
    return modelAccessControlResult({
      statusCode: response.statusCode,
      body: response.body,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return modelAccessControlResult({
        statusCode: error.statusCode,
        errorCode: error.errorCode,
      });
    }

    throw error;
  }
};

export const createDeniedAccessControlResult = (
  errorCode: string = ERROR_CODES.FORBIDDEN,
  statusCode: number = HTTP_STATUS.FORBIDDEN,
) =>
  modelAccessControlResult({
    statusCode,
    errorCode,
  });

export const createAllowedAccessControlResult = () =>
  modelAccessControlResult({
    statusCode: HTTP_STATUS.OK,
  });
