import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as vendorServiceModule from '../services/inventory-vendor.service';
import { listVendorInventoryStocksController } from './inventory-vendor.controller';

const mutableService = vendorServiceModule as unknown as {
  listVendorInventoryStocks: (...args: unknown[]) => Promise<unknown>;
};

type MockRequest = {
  query?: Record<string, unknown>;
  user?: { userId: string; vendorId?: string; storeId?: string };
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

test('listVendorInventoryStocksController returns paginated payload', async () => {
  mutableService.listVendorInventoryStocks = async () => ({
    items: [{ id: '507f1f77bcf86cd799439013', availableQuantity: 10 }],
    pagination: {
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  });

  const response = await runController(listVendorInventoryStocksController, {
    query: { page: 1, limit: 20 },
    user: {
      userId: '507f1f77bcf86cd799439015',
      vendorId: '65f0a0000000000000000001',
      storeId: '507f1f77bcf86cd799439011',
    },
  });
  const body = response.body as { success: boolean };

  assert.equal(response.statusCode, 200);
  assert.equal(body.success, true);
});
