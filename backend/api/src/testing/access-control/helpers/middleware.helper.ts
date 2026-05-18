import type { RequestHandler } from 'express';
import type { AccessControlMockRequest } from './auth-context.helper';
import { evaluateAccessControlAction, type AccessControlResult } from './request.helper';

export const withAccessControlRequestDefaults = (
  req: AccessControlMockRequest,
): AccessControlMockRequest => {
  req.requestId = req.requestId ?? 'access-control-test-request';
  req.traceId = req.traceId ?? 'access-control-test-trace';
  req.ip = req.ip ?? '127.0.0.1';

  if (!req.header) {
    req.header = (name: string) => {
      const normalized = name.toLowerCase();
      if (normalized === 'authorization') {
        return req.headers?.authorization;
      }

      return req.headers?.[normalized];
    };
  }

  if (!req.get) {
    req.get = (header: string) => {
      const normalized = header.toLowerCase();
      if (normalized === 'user-agent') {
        return 'access-control-test-agent';
      }

      return req.headers?.[normalized];
    };
  }

  return req;
};

export const runAccessControlMiddleware = async (
  middleware: RequestHandler,
  req: AccessControlMockRequest,
): Promise<AccessControlResult> => {
  withAccessControlRequestDefaults(req);

  return evaluateAccessControlAction(async () => {
    await new Promise<void>((resolve, reject) => {
      middleware(req as never, {} as never, (error?: unknown) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  });
};
