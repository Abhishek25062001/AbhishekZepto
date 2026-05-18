import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as inventoryStockServiceModule from '../services/inventory-stock.service';
import {
  createInventoryStockController,
  getInventoryStockByIdController,
  listInventoryStocksController,
} from './inventory-stock.controller';

const mutableService = inventoryStockServiceModule as unknown as {
  listInventoryStocks: (...args: unknown[]) => Promise<unknown>;
  createInventoryStock: (...args: unknown[]) => Promise<unknown>;
  getInventoryStockById: (...args: unknown[]) => Promise<unknown>;
};

type MockRequest = {
  body?: Record<string, unknown>;
  params?: Record<string, string>;
  query?: Record<string, unknown>;
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

const buildStockResponse = () => ({
  id: '507f1f77bcf86cd799439013',
  storeProductId: '507f1f77bcf86cd799439012',
  availableQuantity: 50,
  totalQuantity: 50,
  status: 'active',
});

test('listInventoryStocksController returns paginated payload', async () => {
  mutableService.listInventoryStocks = async () => ({
    items: [buildStockResponse()],
    pagination: {
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  });

  const response = await runController(listInventoryStocksController, { query: { page: 1, limit: 20 } });
  const body = response.body as { success: boolean; data: unknown[] };

  assert.equal(response.statusCode, 200);
  assert.equal(body.success, true);
});

test('createInventoryStockController returns created stock', async () => {
  mutableService.createInventoryStock = async () => buildStockResponse();

  const response = await runController(createInventoryStockController, {
    body: { storeProductId: '507f1f77bcf86cd799439012', availableQuantity: 50 },
    user: { userId: '507f1f77bcf86cd799439015' },
  });
  const body = response.body as { success: boolean; data: { availableQuantity: number } };

  assert.equal(response.statusCode, 201);
  assert.equal(body.data.availableQuantity, 50);
});

test('getInventoryStockByIdController returns stock', async () => {
  mutableService.getInventoryStockById = async () => buildStockResponse();

  const response = await runController(getInventoryStockByIdController, {
    params: { inventoryStockId: '507f1f77bcf86cd799439013' },
  });
  const body = response.body as { success: boolean; data: { id: string } };

  assert.equal(response.statusCode, 200);
  assert.equal(body.data.id, '507f1f77bcf86cd799439013');
});
