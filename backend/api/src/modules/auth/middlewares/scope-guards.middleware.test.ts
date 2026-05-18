import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AppError } from '../../../errors/AppError';
import { AUTH_SCOPE_FIELD, AUTH_SCOPE_KIND } from '../constants/auth-scope.constants';
import { createScopeGuard } from './scope-guards.middleware';

type MockRequest = {
  user?: Express.Request['user'];
  requestId?: string;
  traceId?: string;
  ip?: string;
  get: (header: string) => string | undefined;
};

const runGuard = async ({
  guard,
  req,
}: {
  guard: ReturnType<typeof createScopeGuard>;
  req: MockRequest;
}) => {
  return new Promise<unknown>((resolve) => {
    guard(
      req as never,
      {} as never,
      (error?: unknown) => {
        resolve(error);
      },
    );
  });
};

test('createScopeGuard writes tenant_access_denied for missing scope', async () => {
  const guard = createScopeGuard({
    kind: AUTH_SCOPE_KIND.VENDOR,
    field: AUTH_SCOPE_FIELD.VENDOR_ID,
    resolveExpectedValue: 'vendor-1',
  });

  const error = await runGuard({
    guard,
    req: {
      user: {
        userId: '68295cf6d5cc8fddf6b8d210',
        role: 'support_admin',
        permissions: ['users:read'],
        sessionId: 'session-1',
        vendorId: null,
        storeId: null,
        cityId: null,
      },
      requestId: 'req-1',
      traceId: 'trace-1',
      ip: '127.0.0.1',
      get: () => 'test-agent',
    },
  });

  assert.ok(error);
  assert.ok(error instanceof AppError);
  assert.equal(error.errorCode, 'VENDOR_SCOPE_REQUIRED');
});

test('createScopeGuard writes tenant_scope_mismatch for mismatched scope', async () => {
  const guard = createScopeGuard({
    kind: AUTH_SCOPE_KIND.STORE,
    field: AUTH_SCOPE_FIELD.STORE_ID,
    resolveExpectedValue: 'store-2',
  });

  const error = await runGuard({
    guard,
    req: {
      user: {
        userId: '68295cf6d5cc8fddf6b8d210',
        role: 'vendor_owner',
        permissions: ['vendor:read_store'],
        sessionId: 'session-1',
        vendorId: 'vendor-1',
        storeId: 'store-1',
        cityId: 'city-1',
      },
      requestId: 'req-2',
      traceId: 'trace-2',
      ip: '127.0.0.1',
      get: () => 'test-agent',
    },
  });

  assert.ok(error);
  assert.ok(error instanceof AppError);
  assert.equal(error.errorCode, 'STORE_SCOPE_MISMATCH');
});
