import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as lockServiceModule from '../services/inventory-lock.service';
import { expireDueInventoryLocksController } from './inventory-lock-admin.controller';

const mutableService = lockServiceModule as unknown as {
  expireDueInventoryLocks: (...args: unknown[]) => Promise<unknown>;
};

type MockRequest = {
  user?: { userId: string };
};

type MockResponse = {
  statusCode?: number;
  status: (code: number) => MockResponse;
  json: (payload: unknown) => MockResponse;
};

const createMockResponse = (onJson: (payload: unknown, statusCode: number) => void): MockResponse => {
  const response: MockResponse = {
    statusCode: undefined,
    status(code: number) {
      response.statusCode = code;
      return response;
    },
    json(payload: unknown) {
      onJson(payload, response.statusCode ?? 200);
      return response;
    },
  };
  return response;
};

const runController = async (controller: unknown, req: MockRequest) =>
  new Promise<{ body: unknown; statusCode: number }>((resolve, reject) => {
    const res = createMockResponse((body, statusCode) => resolve({ body, statusCode }));
    (controller as (req: MockRequest, res: MockResponse, next: (error?: unknown) => void) => void)(
      req,
      res,
      (error?: unknown) => {
        if (error) reject(error);
      },
    );
  });

test('expireDueInventoryLocksController returns summary', async () => {
  mutableService.expireDueInventoryLocks = async () => ({
    processedCount: 2,
    expiredCount: 2,
    failedCount: 0,
    errors: [],
  });

  const response = await runController(expireDueInventoryLocksController, {
    user: { userId: '507f1f77bcf86cd799439010' },
  });
  const body = response.body as { success: boolean; data: { expiredCount: number } };

  assert.equal(response.statusCode, 200);
  assert.equal(body.success, true);
  assert.equal(body.data.expiredCount, 2);
});
