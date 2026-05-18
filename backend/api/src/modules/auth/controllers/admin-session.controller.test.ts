import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import * as sessionServiceModule from '../services/session.service';
import {
  listAdminUserSessionsController,
  revokeAdminUserSessionController,
  revokeAllAdminUserSessionsController,
} from './admin-session.controller';

const mutableSessionService = sessionServiceModule as unknown as {
  listAdminUserSessions: (...args: unknown[]) => Promise<unknown>;
  revokeAdminUserSession: (...args: unknown[]) => Promise<unknown>;
  revokeAllAdminUserSessions: (...args: unknown[]) => Promise<unknown>;
};

type MockRequest = {
  params?: Record<string, string>;
  user?: Record<string, unknown>;
  requestId?: string;
  traceId?: string;
};

type MockResponse = {
  body?: unknown;
  statusCode?: number;
  status: (code: number) => MockResponse;
  json: (payload: unknown) => MockResponse;
};

const createMockResponse = (
  onJson: (payload: unknown, statusCode: number) => void,
): MockResponse => {
  const response: MockResponse = {
    body: undefined,
    statusCode: undefined,
    status(code: number) {
      response.statusCode = code;
      return response;
    },
    json(payload: unknown) {
      response.body = payload;
      onJson(payload, response.statusCode ?? 200);
      return response;
    },
  };

  return response;
};

const runController = async (controller: unknown, req: MockRequest) => {
  return new Promise<{ body: unknown; statusCode: number }>((resolve, reject) => {
    const res = createMockResponse((body, statusCode) => {
      resolve({
        body,
        statusCode,
      });
    });

    (controller as (req: MockRequest, res: MockResponse, next: (error?: unknown) => void) => void)(
      req,
      res,
      (error?: unknown) => {
        if (error) {
          reject(error);
        }
      },
    );
  });
};

const adminUser = {
  userId: '68295cf6d5cc8fddf6b8d201',
  role: 'operations_admin',
  permissions: ['auth:manage'],
  sessionId: '68295cf6d5cc8fddf6b8d2ab',
  vendorId: null,
  storeId: null,
  cityId: null,
};

test('listAdminUserSessionsController returns admin session summaries without secrets', async () => {
  const original = mutableSessionService.listAdminUserSessions;
  mutableSessionService.listAdminUserSessions = async () => ({
    userId: '68295cf6d5cc8fddf6b8d200',
    sessions: [
      {
        id: '68295cf6d5cc8fddf6b8d2aa',
        role: 'customer',
        deviceId: 'device-1',
        deviceName: 'Customer App Android',
        deviceType: 'android',
        appSurface: 'customer_app',
        appVersion: '1.0.0',
        ipAddress: '127.0.0.1',
        userAgent: 'agent',
        lastUsedAt: '2026-05-15T00:00:00.000Z',
        expiresAt: '2026-06-01T00:00:00.000Z',
        isRevoked: false,
        revokedAt: null,
        revokedReason: null,
        createdAt: '2026-05-01T00:00:00.000Z',
      },
    ],
  });

  const response = await runController(listAdminUserSessionsController, {
    params: {
      userId: '68295cf6d5cc8fddf6b8d200',
    },
    requestId: 'req-1',
    traceId: 'trace-1',
  });

  mutableSessionService.listAdminUserSessions = original;

  assert.equal(response.statusCode, 200);
  const payload = response.body as {
    success: boolean;
    data: {
      userId: string;
      sessions: Array<Record<string, unknown>>;
    };
  };
  assert.equal(payload.success, true);
  assert.equal(payload.data.userId, '68295cf6d5cc8fddf6b8d200');
  assert.equal(payload.data.sessions.length, 1);
  assert.equal('refreshTokenHash' in payload.data.sessions[0]!, false);
  assert.equal('isCurrent' in payload.data.sessions[0]!, false);
});

test('revokeAdminUserSessionController returns revoke metadata', async () => {
  const original = mutableSessionService.revokeAdminUserSession;
  mutableSessionService.revokeAdminUserSession = async () => ({
    userId: '68295cf6d5cc8fddf6b8d200',
    sessionId: '68295cf6d5cc8fddf6b8d2aa',
    alreadyRevoked: false,
  });

  const response = await runController(revokeAdminUserSessionController, {
    params: {
      userId: '68295cf6d5cc8fddf6b8d200',
      sessionId: '68295cf6d5cc8fddf6b8d2aa',
    },
    user: adminUser,
  });

  mutableSessionService.revokeAdminUserSession = original;

  assert.equal(response.statusCode, 200);
  const payload = response.body as {
    success: boolean;
    data: {
      sessionId: string;
      alreadyRevoked: boolean;
    };
  };
  assert.equal(payload.data.sessionId, '68295cf6d5cc8fddf6b8d2aa');
  assert.equal(payload.data.alreadyRevoked, false);
});

test('revokeAdminUserSessionController requires authenticated admin user', async () => {
  await assert.rejects(
    () =>
      runController(revokeAdminUserSessionController, {
        params: {
          userId: '68295cf6d5cc8fddf6b8d200',
          sessionId: '68295cf6d5cc8fddf6b8d2aa',
        },
      }),
    (error: unknown) =>
      error instanceof AppError && error.errorCode === ERROR_CODES.UNAUTHORIZED,
  );
});

test('revokeAllAdminUserSessionsController returns revoked count', async () => {
  const original = mutableSessionService.revokeAllAdminUserSessions;
  mutableSessionService.revokeAllAdminUserSessions = async () => ({
    userId: '68295cf6d5cc8fddf6b8d200',
    revokedCount: 2,
  });

  const response = await runController(revokeAllAdminUserSessionsController, {
    params: {
      userId: '68295cf6d5cc8fddf6b8d200',
    },
    user: adminUser,
  });

  mutableSessionService.revokeAllAdminUserSessions = original;

  assert.equal(response.statusCode, 200);
  const payload = response.body as {
    success: boolean;
    data: {
      revokedCount: number;
    };
  };
  assert.equal(payload.data.revokedCount, 2);
});
