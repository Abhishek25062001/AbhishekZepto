import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as lockServiceModule from '../services/inventory-lock.service';
import { createInventoryLockController } from './inventory-lock-internal.controller';

const mutableService = lockServiceModule as unknown as {
  createInventoryLock: (...args: unknown[]) => Promise<unknown>;
};

type MockRequest = {
  body?: Record<string, unknown>;
  params?: Record<string, string>;
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

test('createInventoryLockController returns created lock', async () => {
  mutableService.createInventoryLock = async () => ({
    id: '507f1f77bcf86cd799439099',
    lockToken: 'lock_abc',
    status: 'active',
    quantity: 3,
  });

  const response = await runController(createInventoryLockController, {
    body: {
      inventoryStockId: '507f1f77bcf86cd799439011',
      storeProductId: '507f1f77bcf86cd799439012',
      quantity: 3,
      lockType: 'cart',
    },
    user: { userId: '507f1f77bcf86cd799439010' },
  });

  const body = response.body as { success: boolean; data: { lockToken: string } };
  assert.equal(response.statusCode, 201);
  assert.equal(body.success, true);
  assert.equal(body.data.lockToken, 'lock_abc');
});
